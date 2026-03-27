import mongoose from "mongoose";
import { IEMRModel } from "../database/mongo/model/EMR";
import { Service } from "./Service";
import { PatientRepositoryImplementation } from "../repository/PatientRepositoryImplementation";
import { PatientServiceInterface } from "./PatientServiceInterface";
import { Patient } from "../dto/Patient";
import { JWT } from "../utility/JWT";
import { User } from "../dto/User";
import { TimeSlot } from "../dto/TimeSlot";
import { ClinicDTO } from "../dto/ClinicDTO";
import { Payment } from "../utility/Payment";
import { IAllergyModel } from "../database/mongo/model/Allergy";
import { AllergyDTO } from "../dto/AllergyDTO";
import { FileDTO } from "../dto/FileDTO";
import { ChronicIllnessDTO } from "../dto/ChronicIllnessDTO";
import { IChronicIllnessModel } from "../database/mongo/model/ChronicIllness";
import BookingServiceRabbitMQClient from "../RabbitMQ/BookingServiceRabbitMQClient";
import { TimeSlotReservationConflictException } from "../error/TimeSlotReservationConflictException";
import MailServiceRabbitMQClient from "../RabbitMQ/MailServiceRabbitMQClient";
import { DoctorDTO } from "../dto/DoctorDTO";
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

    const patientSignUpMailData = {
      operation: "patient-signup",
      patient: {
        firstName: newPatient.FirstName,
        email: newPatient.Email,
      },
    };
    MailServiceRabbitMQClient.produce({ data: patientSignUpMailData });
    return newPatient;
  };

  public reserveTimeSlot = async (timeSlot: TimeSlot): Promise<TimeSlot> => {
    // 1- authorize
    const patient = await (
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
    const doctor: DoctorDTO = await (
      this.repositoryImplementaion as PatientRepositoryImplementation
    ).getDoctorProfileFromTimeSlot(updatedTimeSlot.timeslot_id);

    MailServiceRabbitMQClient.produce({
      data: {
        operation: "patient-reserved",
        patient: {
          firstName: patient.FirstName,
          email: patient.Email,
        },
        doctor: {
          firstName: doctor.FirstName,
          email: doctor.Email,
        },
      },
    });

    return updatedTimeSlot;
  };

  public deleteReservedTimeSlot = async (timeSlot: TimeSlot): Promise<void> => {
    // 1- authorize
    const patient: Patient = await (
      this.repositoryImplementaion as PatientRepositoryImplementation
    ).authorize(timeSlot.patient_id as number);

    // 2- delete reservation
    await (
      this.repositoryImplementaion as PatientRepositoryImplementation
    ).deleteReservationByPatient(timeSlot);

    const doctor: DoctorDTO = await (
      this.repositoryImplementaion as PatientRepositoryImplementation
    ).getDoctorProfileFromTimeSlot(timeSlot.timeslot_id!);

    MailServiceRabbitMQClient.produce({
      data: {
        operation: "patient-cancelled",
        patient: {
          firstName: patient.FirstName,
          email: patient.Email,
        },
        doctor: {
          firstName: doctor.FirstName,
          email: doctor.Email,
        },
      },
    });

    return;
  };

  public payOnline = async (
    clinicDTO: ClinicDTO,
    patient_id: number,
  ): Promise<string> => {
    const authorizedPatient: Patient = await (
      this.repositoryImplementaion as PatientRepositoryImplementation
    ).authorize(patient_id as number);
    const clinic: ClinicDTO = await (
      this.repositoryImplementaion as PatientRepositoryImplementation
    ).getClinicData(clinicDTO);
    const payment: Payment = new Payment(clinic, authorizedPatient);
    const URL: string = await payment.getPaymentKey();
    return URL;
  };

  public getSchedule = async (patient_id: number): Promise<any> => {
    const result = await (
      this.repositoryImplementaion as PatientRepositoryImplementation
    ).getPatientSchedule(patient_id);
    return result;
  };

  public addAllergy = async (
    allergyDTO: AllergyDTO,
    files: FileDTO[],
    patient: Patient,
  ): Promise<IEMRModel> => {
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

  public getAllAllergy = async (patient: Patient): Promise<AllergyDTO[]> => {
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
    patient: Patient,
  ): Promise<IEMRModel> => {
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

  public getAllChronicIllness = async (
    patient: Patient,
  ): Promise<ChronicIllnessDTO[]> => {
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
    file_id: string,
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
    file_id: string,
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
}
