import { Request, Response, NextFunction } from "express";
import { PatientService } from "../service/PatientService";
import { Patient_Interface } from "../type/patient/Patient_Interface";
import { Hasher } from "../utility/Hasher";
import { LoginCredential_Interface } from "../type/generic/LoginCredential_Interface";
import { WrongPasswordException } from "../error/WrongPasswordException";
import { JWT } from "../utility/JWT";
import { Doctor_Interface } from "../type/doctor/Doctor_Interface";
import { DoctorService } from "../service/DoctorService";
export class DoctorController {
  static async signup(
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<void> {
    const doctorData: Doctor_Interface = { ...req.body };
    // to be properly implemented in model setter using hooks
    doctorData.Password = await Hasher.hashPassword(doctorData.Password);
    const doctor: Doctor_Interface = await DoctorService.signup(doctorData);
    const jwt = await JWT.createAccessToken({ id: doctor.doctor_id });
    res.json({ accessToken: jwt });
  }

  static async login(
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<void> {
    const credential: LoginCredential_Interface = { ...req.body };
    const doctor: Doctor_Interface = await DoctorService.login(credential);

    console.log(doctor);
    const verified: boolean = await Hasher.verifyPassword(
      credential.Password,
      doctor.Password
    );
    if (!verified) {
      throw WrongPasswordException;
    }
    const jwt = await JWT.createAccessToken({ id: doctor.doctor_id });
    res.json({ accessToken: jwt });
  }

  //   static async getEMR(
  //     req: Request,
  //     res: Response,
  //     next: NextFunction
  //   ): Promise<void> {
  //     const id: number = Object(req).id;
  //     const emr = await PatientService.getEMR(id);
  //     res.statusCode = 200;
  //     res.json(emr);
  //   }

  //   static async getAll(
  //     req: Request,
  //     res: Response,
  //     next: NextFunction
  //   ): Promise<void> {
  //     const patients = await PatientService.getAll();
  //     res.statusCode = 200;
  //     res.json(patients);
  //   }
}