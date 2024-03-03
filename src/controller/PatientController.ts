import { Request, Response, NextFunction } from "express";
import { PatientService } from "../service/PatientService";
import { Patient_Interface } from "../type/patient/Patient_Interface";
import { Hasher } from "../utility/Hasher";
import { LoginCredential_Interface } from "../type/generic/LoginCredential_Interface";
import { WrongPasswordException } from "../error/WrongPasswordException";
import { JWT } from "../utility/JWT";
export class PatientController {
  static async signup(
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<void> {
    const patientData: Patient_Interface = { ...req.body };
    // to be properly implemented in model setter using hooks
    patientData.Password = await Hasher.hashPassword(patientData.Password);
    const patient: Patient_Interface = await PatientService.signup(patientData);
    const jwt = await JWT.createAccessToken({ id: patient.patient_id });
    res.json({ accessToken: jwt });
    return;
  }

  static async login(
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<void> {
    const credential: LoginCredential_Interface = { ...req.body };
    const patient: Patient_Interface = await PatientService.login(credential);

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
  }

  static async getEMR(
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<void> {
    const id: number = Object(req).id;
    const emr = await PatientService.getEMR(id);
    res.statusCode = 200;
    res.json(emr);
  }

  static async getAll(
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<void> {
    const patients = await PatientService.getAll();
    res.statusCode = 200;
    res.json(patients);
  }
}
