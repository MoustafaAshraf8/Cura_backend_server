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
export class PatientController
  extends Controller
  implements PatientControllerInterface
{
  constructor() {
    super(new PatientRepositoryImplementation());
  }

  public signup = async (
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<void> => {
    console.log("new PatientController");
    const patientData: Patient_Interface = { ...req.body };
    const headers: IncomingHttpHeaders = req.headers;
    // to be properly implemented in model setter using hooks
    patientData.Password = await Hasher.hashPassword(patientData.Password);

    const patient: Patient_Interface = await (
      this.repositoryImplementaion as PatientRepositoryImplementation
    ).signup(patientData, headers);
    console.log(patient);

    // await MailService.sendMail(patient.Email);
    const jwt = await JWT.createAccessToken({ id: patient.patient_id });
    res.json({ accessToken: jwt });
    return;
  };

  public login = async (
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<void> => {
    const credential: LoginCredential_Interface = { ...req.body };
    const patient: Patient_Interface = await (
      this.repositoryImplementaion as PatientRepositoryImplementation
    ).login(credential);

    console.log(patient);
    const verified: boolean = await Hasher.verifyPassword(
      credential.Password,
      patient.Password
    );
    if (!verified) {
      throw WrongPasswordException;
    }
    const jwt = await JWT.createAccessToken({ id: patient.patient_id });
    res.json({ accessToken: jwt });
  };

  public getEMR = async (
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<void> => {
    const id: number = Object(req).id;
    const emr = await (
      this.repositoryImplementaion as PatientRepositoryImplementation
    ).getEMR(id);
    res.statusCode = 200;
    res.json(emr);
  };

  public getAll = async (
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<void> => {
    const patients = await (
      this.repositoryImplementaion as PatientRepositoryImplementation
    ).getAll();
    res.statusCode = 200;
    res.json(patients);
  };

  public addSurgery = async (
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<void> => {
    const headers: IncomingHttpHeaders = req.headers;
    const surgeryName: String = req.body!.surgeryName;
    const bb: busboy.Busboy = await (
      this.repositoryImplementaion as PatientRepositoryImplementation
    ).addSurgery(surgeryName, headers);
    req.pipe(bb);
    res.end();
  };
}
