import { Request, Response, NextFunction } from "express";
import { PatientService } from "../service/PatientService";
import { Patient_Interface } from "../type/Patient_Interface";
import { Hasher } from "../utility/Hasher";
import { LogicalOperator } from "typescript";
import { LoginCredential_Interface } from "../type/LoginCredential_Interface";

export class PatientController {
  static async signup(
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<void> {
    const patientData: Patient_Interface = { ...req.body };
    // to be properly implemented in model setter using hooks
    patientData.Password = await Hasher.hashPassword(patientData.Password);
    const result: Patient_Interface = await PatientService.signup(patientData);
    res.json(result);
    return;
  }

  static async login(
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<void> {
    const credential: LoginCredential_Interface = { ...req.body };
    const patient: Patient_Interface = await PatientService.login(credential);
    res.json(patient);
    return;
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
