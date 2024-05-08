import { Request, Response, NextFunction } from "express";
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
import { Patient } from "../class/Patient";
import { statusCode } from "../constant/StatusCode";
import { UserValidationSchema } from "../validation/UserValidationSchema";
import { User } from "../class/User";
export class PatientController extends Controller {
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
  ): Promise<void> => {};

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
