//import { Patient_Interface } from "../type/patient/Patient_Interface";
import db from "../model/index";
//import { LoginCredential_Interface } from "../type/generic/LoginCredential_Interface";
import { Op } from "sequelize";
import { UserNotFoundException } from "../error/UserNotFoundException";
//import { EMR_Interface } from "../type/patient/EMR_Interface";
import mongoose from "mongoose";
import { EMR, IEMRModel } from "../database/mongo/model/EMR";
import internal from "stream";
import busboy from "busboy";
import { IncomingHttpHeaders } from "http";
import path from "path";
import { MailService } from "./MailService";
import { extend } from "joi";
import { Service } from "./Service";
import { PatientRepositoryImplementation } from "../repository/PatientRepositoryImplementation";
import { PatientServiceInterface } from "./PatientServiceInterface";
import { Patient } from "../dto/Patient";
import { JWT } from "../utility/JWT";
import { User } from "../dto/User";
import { DoctorService } from "./DoctorService";
import { TimeSlot } from "../dto/TimeSlot";
import { ClinicDTO } from "../dto/ClinicDTO";
import { Payment } from "../utility/Payment";
import { Allergy, IAllergyModel } from "../database/mongo/model/Allergy";
import { AllergyDTO } from "../dto/AllergyDTO";
import { FileDTO } from "../dto/FileDTO";
import { ChronicIllnessDTO } from "../dto/ChronicIllnessDTO";
import {
  IChronicIllness,
  IChronicIllnessModel,
} from "../database/mongo/model/ChronicIllness";
import BookingServiceRabbitMQClient from "../RabbitMQ/BookingServiceRabbitMQClient";
import { TimeSlotReservationConflictException } from "../error/TimeSlotReservationConflictException";
// import { AllergyGridFSBucket } from "../database/mongo/model/AllergyGridFSBucket";
export class PatientService extends Service implements PatientServiceInterface {
  constructor() {
    super(new PatientRepositoryImplementation());
  }
  public signin = async (user: User): Promise<Patient> => {
    const patient: Patient = await (
      this.repositoryImplementaion as PatientRepositoryImplementation
    ).signin(user);
    patient.accessToken = JWT.createAccessToken({
      id: patient.patient_id,
    });
    return patient;
  };

  public signup = async (patient: Patient): Promise<Patient> => {
    const newPatient: Patient = await (
      this.repositoryImplementaion as PatientRepositoryImplementation
    ).signup(patient);

    newPatient.accessToken = JWT.createAccessToken({
      id: newPatient.patient_id,
    });
    await MailService.sendMail(newPatient.Email as String);
    return newPatient;
  };

  public reserveTimeSlot = async (timeSlot: TimeSlot): Promise<TimeSlot> => {
    // 1- authorize
    await (
      this.repositoryImplementaion as PatientRepositoryImplementation
    ).authorize(timeSlot.patient_id as number);

    // 2- reserve
    const data: any = {
      timeslot_id: timeSlot.timeslot_id,
      patient_id: timeSlot.patient_id,
    };
    const updatedTimeSlot: any = await BookingServiceRabbitMQClient.produce({
      data: data,
    });
    if (updatedTimeSlot == null) {
      throw new TimeSlotReservationConflictException();
    }
    return updatedTimeSlot;
  };

  public deleteReservedTimeSlot = async (
    timeSlot: TimeSlot
  ): Promise<boolean> => {
    // 1- authorize
    await (
      this.repositoryImplementaion as PatientRepositoryImplementation
    ).authorize(timeSlot.patient_id as number);

    // 2- delete reservation
    const result: boolean = await DoctorService.deleteReservedTimeSlot(
      timeSlot
    );
    return result;
  };

  public payOnline = async (
    clinicDTO: ClinicDTO,
    patient_id: number
  ): Promise<string> => {
    const patient: Patient = new Patient({});
    const clinic: ClinicDTO = new ClinicDTO({});
    // const patient: Patient = await (
    //   this.repositoryImplementaion as PatientRepositoryImplementation
    // ).authorize(patient_id as number);
    // const clinic: ClinicDTO = await DoctorService.getClinicData(clinicDTO);
    const payment: Payment = new Payment(clinic, patient);
    const URL: string = await payment.getPaymentKey();
    return URL;
  };

  public getSchedule = async (patient_id: number): Promise<any> => {
    const result = await DoctorService.getPatientSchedule(patient_id);
    return result;
  };

  public addAllergy = async (
    allergyDTO: AllergyDTO,
    files: FileDTO[],
    patient: Patient
  ): Promise<any> => {
    // 1- authorize
    await (
      this.repositoryImplementaion as PatientRepositoryImplementation
    ).authorize(patient.patient_id as number);

    // 2- get the emr
    const emr: IEMRModel = await (
      this.repositoryImplementaion as PatientRepositoryImplementation
    ).getEMR(patient.patient_id as number);

    // 3- create the allergy document
    const newAllergy: IAllergyModel = await (
      this.repositoryImplementaion as PatientRepositoryImplementation
    ).addAllergy(allergyDTO);

    // 4- add files to bucket

    files.map(async (file) => {
      const stream = await (
        this.repositoryImplementaion as PatientRepositoryImplementation
      ).addAllergyFile(file);
      newAllergy.file.push(stream.id);
    });
    await newAllergy.save();
    // 5- add allergy to emr
    emr.allergy.push(newAllergy._id as mongoose.Types.ObjectId);
    await emr.save();

    return emr;
  };

  public getAllAllergy = async (patient: Patient): Promise<any> => {
    // 1- authorize
    await (
      this.repositoryImplementaion as PatientRepositoryImplementation
    ).authorize(patient.patient_id as number);

    // 2- getAllergy
    const allergies: AllergyDTO[] = await (
      this.repositoryImplementaion as PatientRepositoryImplementation
    ).getAllAllergy(patient);
    return allergies;
  };

  public addChronicIllness = async (
    chronicIllnessDTO: ChronicIllnessDTO,
    files: FileDTO[],
    patient: Patient
  ): Promise<any> => {
    // 1- authorize
    await (
      this.repositoryImplementaion as PatientRepositoryImplementation
    ).authorize(patient.patient_id as number);

    // 2- get the emr
    const emr: IEMRModel = await (
      this.repositoryImplementaion as PatientRepositoryImplementation
    ).getEMR(patient.patient_id as number);

    // 3- create the allergy document
    const newChronicIllness: IChronicIllnessModel = await (
      this.repositoryImplementaion as PatientRepositoryImplementation
    ).addChronicIllness(chronicIllnessDTO);

    // 4- add files to bucket

    files.map(async (file) => {
      const stream = await (
        this.repositoryImplementaion as PatientRepositoryImplementation
      ).addChronicIllnessFile(file);
      newChronicIllness.file.push(stream.id);
    });
    await newChronicIllness.save();
    // 5- add allergy to emr
    emr.chronicIllness.push(newChronicIllness._id as mongoose.Types.ObjectId);
    await emr.save();

    return emr;
  };

  public getAllChronicIllness = async (patient: Patient): Promise<any> => {
    // 1- authorize
    await (
      this.repositoryImplementaion as PatientRepositoryImplementation
    ).authorize(patient.patient_id as number);

    // 2- getAllergy
    const chronicIllness: ChronicIllnessDTO[] = await (
      this.repositoryImplementaion as PatientRepositoryImplementation
    ).getAllChronicIllness(patient);
    return chronicIllness;
  };

  public getAllergyFile = async (
    patient: Patient,
    file_id: string
  ): Promise<mongoose.mongo.GridFSBucketReadStream> => {
    // 1 - authorize;
    await (
      this.repositoryImplementaion as PatientRepositoryImplementation
    ).authorize(patient.patient_id as number);

    // 2- getAllergyFile
    const readstream: mongoose.mongo.GridFSBucketReadStream = await (
      this.repositoryImplementaion as PatientRepositoryImplementation
    ).getAllergyFile(file_id);
    return readstream;
  };

  public getChronicIllnessFile = async (
    patient: Patient,
    file_id: string
  ): Promise<mongoose.mongo.GridFSBucketReadStream> => {
    // 1- authorize
    await (
      this.repositoryImplementaion as PatientRepositoryImplementation
    ).authorize(patient.patient_id as number);

    // 2- getChronicIllnessFile
    const readstream: mongoose.mongo.GridFSBucketReadStream = await (
      this.repositoryImplementaion as PatientRepositoryImplementation
    ).getChronicIllnessFile(file_id);
    return readstream;
  };

  // create sql data entry
  //       const patientData = await db.sequelize.transaction(async (t: any) => {
  //         const patientData = await db.Patient.create(patient, {
  //           include: [{ model: db.PatientPhoneNumber, as: "patientphonenumber" }],
  //         });
  //         const emr = await db.EMR.create({
  //           patient_id: patientData.dataValues.patient_id,
  //         });
  //         const patientId = patientData.dataValues.patient_id;
  //         // create mongo data entry
  //         const emrMongo = await EMR.create({
  //           patient_id: patientId,
  //         });
  //         return patientData;
  //       });
  //   create profile image
  //    const ObjectId: mongoose.Types.ObjectId = new mongoose.Types.ObjectId(
  //      patientId
  //    );
  //    const mongoDB = mongoose.connections[0].db;
  //    const gridFSBucket: mongoose.mongo.GridFSBucket =
  //      new mongoose.mongo.GridFSBucket(mongoDB, {
  //        bucketName: "Images",
  //      });
  //    const bb: busboy.Busboy = busboy({ headers: headers });
  //    bb.on("file", async (name, file, info) => {
  //      const { filename, encoding, mimeType } = info;
  //      const newFileName = patientId + "_" + "profile_image";
  //      const saveTo = path.join(".", newFileName);
  //      const stream: mongoose.mongo.GridFSBucketWriteStream = await file.pipe(
  //        gridFSBucket.openUploadStreamWithId(ObjectId, saveTo)
  //      );
  //    });
  //       return patientData.dataValues;
  // };
  //   static async getEMR(id: number): Promise<EMR_Interface> {
  //     console.log("get emr service");
  //     const emr = await db.EMR.findOne({
  //       where: {
  //         patient_id: id,
  //       },
  //       // include: [{ all: true, nested: true }],
  //       include: [
  //         {
  //           model: db.Desease,
  //           as: "desease",
  //           include: [{ model: db.Prescription, as: "prescription" }],
  //         },
  //         { model: db.Surgery, as: "surgery", nested: true },
  //       ],
  //     });
  //     if (emr == null) {
  //       throw new UserNotFoundException();
  //     }
  //     return emr;
  //   }
  //   static async getAll(): Promise<Patient_Interface> {
  //     const patients = await db.Patient.findAll({
  //       include: [
  //         { model: db.EMR, association: "emr" },
  //         { model: db.PatientPhoneNumber, association: "patientphonenumber" },
  //       ],
  //     });
  //     return patients;
  //   }
  //   static async addSurgery(
  //     surgeryName: String,
  //     //  name: String,
  //     //  file: internal.Readable,
  //     //  info: busboy.FileInfo,
  //     headers: IncomingHttpHeaders
  //   ): Promise<busboy.Busboy> {
  //     const db = mongoose.connections[0].db;
  //     const gridFSBucket: mongoose.mongo.GridFSBucket =
  //       new mongoose.mongo.GridFSBucket(db, {
  //         bucketName: "newUploads",
  //       });
  //     const bb: busboy.Busboy = busboy({ headers: headers });
  //     bb.on("file", (name, file, info) => {
  //       console.log("file found");
  //       const { filename, encoding, mimeType } = info;
  //       const saveTo = path.join(".", filename);
  //       // here we PIPE the file to DB.
  //       file.pipe(gridFSBucket.openUploadStream(saveTo));
  //     });
  //     //  req.pipe(bb);
  //     return bb;
  //   }
}
