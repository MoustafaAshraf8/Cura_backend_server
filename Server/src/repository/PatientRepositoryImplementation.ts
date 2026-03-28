import { Op } from "sequelize";
import { UserNotFoundException } from "../error/UserNotFoundException";
import mongoose from "mongoose";
import { EMR, IEMRModel } from "../database/mongo/model/EMR";
import path from "path";
import { PatientRepository } from "./PatientRepository";
import { Repository } from "./Repository";
import db from "../model/index";
import { Patient } from "../dto/Patient";
import { User } from "../dto/User";
import { UnothorizedUserException } from "../error/UnothorizedUserException";
import { AllergyDTO } from "../dto/AllergyDTO";
import {
  Allergy,
  IAllergy,
  IAllergyModel,
} from "../database/mongo/model/Allergy";
import { FileDTO } from "../dto/FileDTO";
import { ChronicIllnessDTO } from "../dto/ChronicIllnessDTO";
import {
  ChronicIllness,
  IChronicIllnessModel,
} from "../database/mongo/model/ChronicIllness";
import { EMRNotFoundException } from "../error/EMRNotFoundException";
import { DatabaseConnectionError } from "../error/DatabaseConnectionError";
// import { Encryptor } from "../utility/Encryptor";
import { DoctorDTO } from "../dto/DoctorDTO";
import { TimeSlot } from "../dto/TimeSlot";
import { TimeSlotNotFoundException } from "../error/TimeSlotNotFoundException";
import { ClinicDTO } from "../dto/ClinicDTO";
import { ClinicNotFoundException } from "../error/doctorException/ClinicNotFoundException";

export class PatientRepositoryImplementation
  extends Repository
  implements PatientRepository
{
  constructor() {
    super(db.Patient);
  }

  public signin = async (user: User): Promise<Patient> => {
    try {
      const patientData = await db.Patient.findOne({
        where: {
          [Op.and]: [{ Email: user.Email }],
        },
      });

      const patient: Patient = new Patient(patientData.dataValues);
      return patient;
    } catch (err) {
      throw UserNotFoundException;
    }
  };

  public signup = async (patient: Patient): Promise<Patient> => {
    const patientData = await db.sequelize.transaction(async (t: any) => {
      const patientData = await (this.model as typeof db.Patient).create(
        patient,
        {
          include: [{ model: db.PatientPhoneNumber, as: "patientphonenumber" }],
        },
      );

      const patientId = patientData.dataValues.patient_id;

      await db.EMR.create({
        patient_id: patientData.dataValues.patient_id,
      });

      // create mongo data entry
      await EMR.create({
        patient_id: patientId,
      });

      return patientData;
    });

    return new Patient(patientData.dataValues);
  };

  public authorize = async (patient_id: number): Promise<Patient> => {
    const patient = await (this.model as typeof db.Patient).findOne({
      where: {
        patient_id: patient_id,
      },
    });
    if (patient == null) throw new UnothorizedUserException();

    return new Patient(patient.dataValues);
  };

  public getEMR = async (patient_id: number): Promise<IEMRModel> => {
    const emr: IEMRModel | null = await EMR.findOne({
      patient_id: patient_id,
    });
    if (emr == null) {
      throw new EMRNotFoundException();
    }
    return emr;
  };

  public addAllergy = async (
    allergyDTO: AllergyDTO,
  ): Promise<IAllergyModel> => {
    /*
      allergyDTO.allergen = Encryptor.encryptData(allergyDTO.allergen);
      allergyDTO.reaction = Encryptor.encryptData(allergyDTO.reaction);
      allergyDTO.severity = Encryptor.encryptData(allergyDTO.severity);
      allergyDTO.diagnosisDate = Encryptor.encryptData(allergyDTO.diagnosisDate);
      allergyDTO.notes = Encryptor.encryptData(allergyDTO.notes);
      allergyDTO.file = allergyDTO.file;
    */
    const allergy: IAllergyModel = await Allergy.create(allergyDTO.toJson());

    return allergy;
  };

  public getAllAllergy = async (patient: Patient): Promise<AllergyDTO[]> => {
    const emr: IEMRModel | null = await EMR.findOne({
      patient_id: patient.patient_id,
    }).populate("allergy");
    if (emr === null) {
      throw new EMRNotFoundException();
    }
    let allergies: AllergyDTO[] = Object(emr).allergy.map((allergy: IAllergy) =>
      AllergyDTO.fromJson(Object(allergy)._doc),
    );
    /*
       allergies = allergies.map((allergyDTO) => {
      return AllergyDTO.fromJson({
        _id: allergydto._id,
        allergen: Encryptor.decryptData(allergydto.allergen),
        reaction: Encryptor.decryptData(allergydto.reaction),
        severity: Encryptor.decryptData(allergydto.severity),
        diagnosisDate: Encryptor.decryptData(allergydto.diagnosisDate),
        notes: Encryptor.decryptData(allergydto.notes),
        file: allergydto.file,
      });
      allergyDTO.allergen = Encryptor.decryptData(allergyDTO.allergen);
      allergyDTO.reaction = Encryptor.decryptData(allergyDTO.reaction);
      allergyDTO.severity = Encryptor.decryptData(allergyDTO.severity);
      allergyDTO.diagnosisDate = Encryptor.decryptData(
        allergyDTO.diagnosisDate
      );
      allergyDTO.notes = Encryptor.decryptData(allergyDTO.notes);
      allergyDTO.file = allergyDTO.file;
      return allergyDTO;
       });
      console.log(emr?.allergy);
    */
    return allergies;
  };

  public addAllergyFile = async (
    file: FileDTO,
  ): Promise<mongoose.mongo.GridFSBucketWriteStream> => {
    var Readable = require("stream").Readable;
    const db = mongoose.connections[0].db;
    const AllergyGridFSBucket: mongoose.mongo.GridFSBucket =
      new mongoose.mongo.GridFSBucket(db, {
        bucketName: "AllergyGridFSBucket",
      });
    const imgBuffer = Buffer.from(file.base64, "base64");
    const metadata: object = file.getMetaData();
    var s = new Readable();
    const saveTo = path.join(".", file.filename);
    await s.push(imgBuffer);
    await s.push(null);
    const stream: mongoose.mongo.GridFSBucketWriteStream = await s.pipe(
      AllergyGridFSBucket.openUploadStream(saveTo, { metadata: metadata }),
    );
    return stream;
  };

  public getAllergyFile = async (
    file_id: string,
  ): Promise<mongoose.mongo.GridFSBucketReadStream> => {
    const db = mongoose.connections[0].db;
    const AllergyGridFSBucket: mongoose.mongo.GridFSBucket =
      new mongoose.mongo.GridFSBucket(db, {
        bucketName: "AllergyGridFSBucket",
      });

    if (!mongoose.connection.db) {
      throw new DatabaseConnectionError();
    }

    const readStream: mongoose.mongo.GridFSBucketReadStream =
      AllergyGridFSBucket.openDownloadStream(
        new mongoose.Types.ObjectId(file_id),
      );
    return readStream;
  };

  public addChronicIllness = async (
    chronicIllnessDTO: ChronicIllnessDTO,
  ): Promise<IChronicIllnessModel> => {
    /*
      chronicIllnessDTO.illness = Encryptor.encryptData(
         chronicIllnessDTO.illness
      );
      chronicIllnessDTO.diagnosisDate = Encryptor.encryptData(
         chronicIllnessDTO.diagnosisDate
      );
      chronicIllnessDTO.treatment = Encryptor.encryptData(
         chronicIllnessDTO.treatment
      );
      chronicIllnessDTO.notes = Encryptor.encryptData(chronicIllnessDTO.notes);
      chronicIllnessDTO.file = chronicIllnessDTO.file;
   */
    const chronicIllness: IChronicIllnessModel = await ChronicIllness.create(
      chronicIllnessDTO.toJson(),
    );

    return chronicIllness;
  };

  public getAllChronicIllness = async (
    patient: Patient,
  ): Promise<ChronicIllnessDTO[]> => {
    const emr: IEMRModel | null = await EMR.findOne({
      patient_id: patient.patient_id,
    }).populate("chronicIllness");

    let chronicIllness: ChronicIllnessDTO[] = Object(emr).chronicIllness.map(
      (chronicIllness: IChronicIllnessModel) =>
        ChronicIllnessDTO.fromJson(Object(chronicIllness)._doc),
    );
    /*
      chronicIllness = chronicIllness.map((chronicIllnessDTO) => {
         chronicIllnessDTO.illness = Encryptor.decryptData(
            chronicIllnessDTO.illness
         );
         chronicIllnessDTO.diagnosisDate = Encryptor.decryptData(
            chronicIllnessDTO.diagnosisDate
         );
         chronicIllnessDTO.treatment = Encryptor.decryptData(
            chronicIllnessDTO.treatment
         );
         chronicIllnessDTO.notes = Encryptor.decryptData(chronicIllnessDTO.notes);
         chronicIllnessDTO.file = chronicIllnessDTO.file;
         return chronicIllnessDTO;
      });
    */
    return chronicIllness;
  };

  public addChronicIllnessFile = async (
    file: FileDTO,
  ): Promise<mongoose.mongo.GridFSBucketWriteStream> => {
    var Readable = require("stream").Readable;
    const db = mongoose.connections[0].db;
    const ChronicIllnessGridFSBucket: mongoose.mongo.GridFSBucket =
      new mongoose.mongo.GridFSBucket(db, {
        bucketName: "ChronicIllnessGridFSBucket",
      });
    const imgBuffer = Buffer.from(file.base64, "base64");
    const metadata: object = file.getMetaData();
    var s = new Readable();
    const saveTo = path.join(".", file.filename);
    await s.push(imgBuffer);
    await s.push(null);
    const stream: mongoose.mongo.GridFSBucketWriteStream = await s.pipe(
      ChronicIllnessGridFSBucket.openUploadStream(saveTo, {
        metadata: metadata,
      }),
    );
    return stream;
  };

  public getChronicIllnessFile = async (
    file_id: string,
  ): Promise<mongoose.mongo.GridFSBucketReadStream> => {
    const db = mongoose.connections[0].db;
    const ChronicIllnessGridFSBucket: mongoose.mongo.GridFSBucket =
      new mongoose.mongo.GridFSBucket(db, {
        bucketName: "ChronicIllnessGridFSBucket",
      });

    if (!mongoose.connection.db) {
      throw new DatabaseConnectionError();
    }

    const readStream: mongoose.mongo.GridFSBucketReadStream =
      ChronicIllnessGridFSBucket.openDownloadStream(
        new mongoose.Types.ObjectId(file_id),
      );
    return readStream;
  };

  public getDoctorProfileFromTimeSlot = async (
    timeslot_id: number,
  ): Promise<DoctorDTO> => {
    // Query the TimeSlot table
    const timeSlotData = await db.TimeSlot.findOne({
      where: {
        timeslot_id: timeslot_id,
      },
      include: [
        {
          model: db.Doctor,
          as: "doctor", // make sure your TimeSlot model has `belongsTo(Doctor)` with alias 'doctor'
          attributes: ["doctor_id", "firstname", "email"],
        },
      ],
      attributes: [], // exclude timeslot fields if you only want doctor info
    });

    if (!timeSlotData || !timeSlotData.doctor) {
      throw UserNotFoundException;
    }

    return new DoctorDTO(timeSlotData.doctor.dataValues);
  };

  public deleteReservationByPatient = async (
    targetTimeSlot: TimeSlot,
  ): Promise<void> => {
    const timeslotObj = await db.TimeSlot.update(
      {
        patient_id: null,
      },
      {
        where: {
          patient_id: targetTimeSlot.patient_id,
          timeslot_id: targetTimeSlot.timeslot_id,
        },
      },
    );

    if (!timeslotObj[0]) {
      throw new TimeSlotNotFoundException();
    }
    return;
  };

  public getPatientSchedule = async (patient_id: number): Promise<any> => {
    const timeSlot = await db.TimeSlot.findAll({
      where: {
        patient_id: patient_id,
      },
      include: [
        {
          association: "schedule",

          include: [
            {
              association: "clinic",
              include: [
                {
                  association: "doctor",
                  include: [{ association: "speciality" }],
                },
              ],
            },
          ],
        },
      ],
    });
    return timeSlot;
  };

  public getClinicData = async (clinicDTO: ClinicDTO): Promise<ClinicDTO> => {
    const clinic: ClinicDTO = await db.Clinic.findOne({
      where: {
        clinic_id: clinicDTO.clinic_id,
      },
    });

    if (clinic == null) {
      throw new ClinicNotFoundException();
    }
    return new ClinicDTO(clinic);
  };
}
