import { Request, Response, NextFunction } from "express";
import { PatientService } from "../service/PatientService";

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
}
