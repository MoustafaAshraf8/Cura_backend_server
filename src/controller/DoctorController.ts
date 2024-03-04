import { Request, Response, NextFunction } from "express";
import { PatientService } from "../service/PatientService";
import { Patient_Interface } from "../type/patient/Patient_Interface";
import { Hasher } from "../utility/Hasher";
import { LoginCredential_Interface } from "../type/generic/LoginCredential_Interface";
import { WrongPasswordException } from "../error/WrongPasswordException";
import { JWT } from "../utility/JWT";
import { Doctor_Interface } from "../type/doctor/Doctor_Interface";
import { DoctorService } from "../service/DoctorService";
import { Schedule_Interface } from "../type/doctor/Schedule_Interface";
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
    // res.json({ accessToken: jwt });
    res.json(doctor);
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
    // res.json({ accessToken: jwt });
    res.json(doctor);
  }

  static async addSchedule(
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<void> {
    const clinic_id: number = Object(req).clinic_id;
    const schedule: Schedule_Interface = { ...req.body };
    const result: Schedule_Interface = await DoctorService.addSchedule(
      schedule
    );
    res.statusCode = 200;
    res.json(result);
  }

  static async getSchedule(
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<void> {
    const clinic_id: number = Object(req).clinic_id;
    const schedule: Schedule_Interface = await DoctorService.getSchedule(
      clinic_id
    );
    res.statusCode = 200;
    res.json(schedule);
  }

  static async addTimeSlot(
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<void> {
    const clinic_id: number = Object(req).clinic_id;
    const schedule: Schedule_Interface = { ...req.body };
    const result: Schedule_Interface = await DoctorService.addSchedule(
      schedule
    );
    res.statusCode = 200;
    res.json(result);
  }

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
