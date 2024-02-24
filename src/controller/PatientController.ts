import { Request, Response, NextFunction } from "express";
import { PatientService } from "../service/PatientService";
import { Patient_Interface } from "../type/Patient_Interface";

export class PatientController {
  static async login(
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<void> {
    await PatientService.login();
    res.json({ msg: "patient controller login !!" });
    return;
  }

  static async signup(
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<void> {
    const patient: Patient_Interface = { ...req.body };
    await PatientService.signup(patient);
    res.json({ msg: "patient controller signup !!" });
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
