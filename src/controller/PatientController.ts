import { Request, Response, NextFunction, json } from "express";
import { PatientService } from "../service/PatientService";
import { Patient_Interface } from "../type/patient/Patient_Interface";
import { Hasher } from "../utility/Hasher";
import { LoginCredential_Interface } from "../type/generic/LoginCredential_Interface";
import { WrongPasswordException } from "../error/WrongPasswordException";
import { JWT } from "../utility/JWT";
import { IncomingHttpHeaders } from "http";
import busboy from "busboy";
import { MailService } from "../service/MailService";
import { Controller } from "./Controller";
import { PatientControllerInterface } from "./PatientControllerInterface";
import { PatientRepositoryImplementation } from "../repository/PatientRepositoryImplementation";
import { PatientSignUpSchema } from "../validation/PatientSignUpSchema";
import Joi from "joi";
import { Validate } from "sequelize-typescript";
import { Patient } from "../dto/Patient";
import { statusCode } from "../constant/StatusCode";
import { UserValidationSchema } from "../validation/UserValidationSchema";
import { User } from "../dto/User";
import { TimeSlotReservationSchema } from "../validation/TimeSlotReservationSchema";
import { TimeSlot } from "../dto/TimeSlot";
import { PaymentSchema } from "../validation/PaymentSchema";
import { ClinicDTO } from "../dto/ClinicDTO";
import { EMR, IEMRModel } from "../database/mongo/model/EMR";
import { Allergy } from "../database/mongo/model/Allergy";
import { AllergyDTO } from "../dto/AllergyDTO";
import { FileDTO } from "../dto/FileDTO";
import { ChronicIllnessDTO } from "../dto/ChronicIllnessDTO";
import mongoose from "mongoose";
export class PatientController
  extends Controller
  implements PatientControllerInterface
{
  // implements PatientControllerInterface
  constructor() {
    super(new PatientService());
  }

  public signup = async (
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<void> => {
    console.log("new PatientController");

    const validation = await PatientSignUpSchema.validateAsync(req.body);
    const patient: Patient = new Patient(validation);
    console.log(patient);
    const newPatient: Patient = await (this.service as PatientService).signup(
      patient
    );
    console.log(newPatient);
    res.statusCode = statusCode.success.ok;
    res.json(newPatient);
  };

  public signin = async (
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<void> => {
    const validation = await UserValidationSchema.validateAsync(req.body);

    const user: User = new User(validation);
    const patient: Patient = await (this.service as PatientService).signin(
      user
    );
    res.statusCode = statusCode.success.ok;
    res.json(patient);
  };

  public reserveTimeSlot = async (
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<void> => {
    // const validation = await TimeSlotReservationSchema.validateAsync(req.body);
    const timeslot_id = Number(req.params.id);
    const patient_id = Number(Object(req).user_id);
    const timeSlot = new TimeSlot({
      timeslot_id: timeslot_id,
      patient_id: patient_id,
    });
    const updatedTimeSlot: TimeSlot = await (
      this.service as PatientService
    ).reserveTimeSlot(timeSlot);

    res.statusCode = statusCode.success.ok;
    res.json(updatedTimeSlot);
  };

  public deleteReservedTimeSlot = async (
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<void> => {
    // const validation = await TimeSlotReservationSchema.validateAsync(req.body);
    const timeslot_id = Number(req.params.id);
    const patient_id = Number(Object(req).user_id);
    const timeSlot = new TimeSlot({
      timeslot_id: timeslot_id,
      patient_id: patient_id,
    });
    console.log("777777777");
    const result: boolean = await (
      this.service as PatientService
    ).deleteReservedTimeSlot(timeSlot);

    res.statusCode = statusCode.success.ok;
    res.end();
  };

  public payOnline = async (
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<void> => {
    const validation = await PaymentSchema.validateAsync(req.body);
    const clinicDTO: ClinicDTO = new ClinicDTO(validation);
    //const patient = new Patient(Number(Object(req).user_id));
    const URL: string = await (this.service as PatientService).payOnline(
      clinicDTO,
      Number(Object(req).user_id)
    );
    res.statusCode = statusCode.redirect.seeOther;
    res.redirect(URL);
  };

  public getSchedule = async (
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<void> => {
    const patient_id: number = Number(Object(req).user_id);
    const result = await (this.service as PatientService).getSchedule(
      patient_id
    );
    res.json(result);
  };

  public addAllergy = async (
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<void> => {
    const allergyData = req.body.data;
    const fileData = req.body.files;
    const patient = new Patient({ patient_id: Number(Object(req).user_id) });
    const allergy: AllergyDTO = AllergyDTO.fromJson(allergyData);
    const files: FileDTO[] = FileDTO.fromJSON(fileData);
    const result = await (this.service as PatientService).addAllergy(
      allergy,
      files,
      patient
    );
    res.json(result);
  };

  public getAllAllergy = async (
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<void> => {
    const patient = new Patient({ patient_id: Number(Object(req).user_id) });

    const result = await (this.service as PatientService).getAllAllergy(
      patient
    );
    res.json(result);
  };

  public addChronicIllness = async (
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<void> => {
    console.log("55555555555");
    const chronicIllnessData = req.body.data;
    const fileData = req.body.files;

    const patient = new Patient({ patient_id: Number(Object(req).user_id) });
    const chronicIllness: ChronicIllnessDTO =
      ChronicIllnessDTO.fromJson(chronicIllnessData);
    const files: FileDTO[] = FileDTO.fromJSON(fileData);

    const result = await (this.service as PatientService).addChronicIllness(
      chronicIllness,
      files,
      patient
    );
    res.json(result);
  };

  public getAllChronicIllness = async (
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<void> => {
    const patient = new Patient({ patient_id: Number(Object(req).user_id) });

    const result = await (this.service as PatientService).getAllChronicIllness(
      patient
    );
    res.json(result);
  };

  public getAllergyFile = async (
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<void> => {
    const patient = new Patient({ patient_id: Number(Object(req).user_id) });
    const file_id: string = req.params.id;
    const readstream: mongoose.mongo.GridFSBucketReadStream = await (
      this.service as PatientService
    ).getAllergyFile(patient, file_id);
    // readstream.pipe(res);
    // Convert stream to buffer
    const streamToBuffer = (stream: mongoose.mongo.GridFSBucketReadStream) => {
      return new Promise((resolve, reject) => {
        const chunks: any = [];
        stream.on("data", (chunk) => {
          chunks.push(chunk);
        });
        stream.on("end", () => {
          resolve(Buffer.concat(chunks));
        });
        stream.on("error", reject);
      });
    };

    const buffer = await streamToBuffer(readstream);

    // res.setHeader("Content-Type", "application/octet-stream");
    // res.setHeader('Content-Disposition', `attachment; filename="${filename}"`);
    res.send(buffer);
  };

  public getChronicIllnessFile = async (
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<void> => {
    const patient = new Patient({ patient_id: Number(Object(req).user_id) });
    const file_id: string = req.params.id;
    const readstream: mongoose.mongo.GridFSBucketReadStream = await (
      this.service as PatientService
    ).getChronicIllnessFile(patient, file_id);
    readstream.pipe(res);
  };

  //   public getEMR = async (
  //     req: Request,
  //     res: Response,
  //     next: NextFunction
  //   ): Promise<void> => {
  //     const id: number = Object(req).id;
  //     const emr = await (
  //       this.repositoryImplementaion as PatientRepositoryImplementation
  //     ).getEMR(id);
  //     res.statusCode = 200;
  //     res.json(emr);
  //   };

  //   public getAll = async (
  //     req: Request,
  //     res: Response,
  //     next: NextFunction
  //   ): Promise<void> => {
  //     const patients = await (
  //       this.repositoryImplementaion as PatientRepositoryImplementation
  //     ).getAll();
  //     res.statusCode = 200;
  //     res.json(patients);
  //   };

  //   public addSurgery = async (
  //     req: Request,
  //     res: Response,
  //     next: NextFunction
  //   ): Promise<void> => {
  //     const headers: IncomingHttpHeaders = req.headers;
  //     const surgeryName: String = req.body!.surgeryName;
  //     const bb: busboy.Busboy = await (
  //       this.repositoryImplementaion as PatientRepositoryImplementation
  //     ).addSurgery(surgeryName, headers);
  //     req.pipe(bb);
  //     res.end();
  //   };
}
