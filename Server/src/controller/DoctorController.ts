import { Request, Response, NextFunction } from "express";
import { Hasher } from "../utility/Hasher";
import { LoginCredential_Interface } from "../type/generic/LoginCredential_Interface";
import { WrongPasswordException } from "../error/WrongPasswordException";
import { JWT } from "../utility/JWT";
import { Doctor_Interface } from "../type/doctor/Doctor_Interface";
import { DoctorService } from "../service/DoctorService";
import { Schedule_Interface } from "../type/doctor/Schedule_Interface";
import { TimeSlot_Interface } from "../type/doctor/TimeSlot_Interface";
import { ScheduleDTO } from "../dto/ScheduleDTO";
import logger from "../utility/logger";
import { Patient } from "../dto/Patient";
import { PatientService } from "../service/PatientService";
import { AllergyDTO } from "../dto/AllergyDTO";
import { FileDTO } from "../dto/FileDTO";
import mongoose from "mongoose";
import { MailService } from "../service/MailService";
export class DoctorController {
  static async signup(
    req: Request,
    res: Response,
    next: NextFunction,
  ): Promise<void> {
    const doctorData: Doctor_Interface = { ...req.body };
    doctorData.Password = await Hasher.hashPassword(doctorData.Password);
    const doctor: Doctor_Interface = await DoctorService.signup(doctorData);
    const jwt = await JWT.createAccessToken({ id: doctor.doctor_id });
    Object(doctor).accessToken = jwt;
    res.json(doctor);
  }

  static async login(
    req: Request,
    res: Response,
    next: NextFunction,
  ): Promise<void> {
    const credential: LoginCredential_Interface = { ...req.body };
    const doctor: Doctor_Interface = await DoctorService.login(credential);

    const verified: boolean = await Hasher.verifyPassword(
      credential.Password,
      doctor.Password,
    );
    if (!verified) {
      throw new WrongPasswordException();
    }
    const jwt = await JWT.createAccessToken({ id: doctor.doctor_id });
    Object(doctor).accessToken = jwt;
    res.json(doctor);
  }

  static async addSchedule(
    req: Request,
    res: Response,
    next: NextFunction,
  ): Promise<void> {
    const doctor_id: number = Object(req).user_id;
    const schedule: ScheduleDTO = new ScheduleDTO(req.body);
    const result: ScheduleDTO = await DoctorService.addSchedule(
      doctor_id,
      schedule,
    );
    res.statusCode = 200;
    res.json(result);
  }

  static async getMySchedule(
    req: Request,
    res: Response,
    next: NextFunction,
  ): Promise<void> {
    const doctor_id: number = Object(req).user_id;
    const schedule: Schedule_Interface[] =
      await DoctorService.getMySchedule(doctor_id);
    res.statusCode = 200;
    res.json(schedule);
  }

  static async addTimeSlot(
    req: Request,
    res: Response,
    next: NextFunction,
  ): Promise<void> {
    const doctor_id: number = Object(req).doctor_id;
    const timeSlot: TimeSlot_Interface = { ...req.body };
    const result = await DoctorService.addTimeSlot(doctor_id, timeSlot);
    res.statusCode = 200;
    res.json(result);
  }

  static async getReservedTimeSlot(
    req: Request,
    res: Response,
    next: NextFunction,
  ): Promise<void> {
    const doctor_id: number = Object(req).user_id;

    const result: any = await DoctorService.getReservedTimeSlot(doctor_id);
    res.statusCode = 200;
    res.json(result);
  }

  static async deleteReservedTimeSlot(
    req: Request,
    res: Response,
    next: NextFunction,
  ): Promise<void> {
    const doctor_id: number = Object(req).user_id;
    const timeslot_id = Number(req.params.id);
    const result: any = await DoctorService.deleteReservedTimeSlot(
      doctor_id,
      timeslot_id,
    );
    res.statusCode = 200;
    res.end();
  }

  static async getDoctorProfile(
    req: Request,
    res: Response,
    next: NextFunction,
  ): Promise<void> {
    const doctor_id: number = Number(req.params.id);
    const doctorData = await DoctorService.getDoctorProfile(doctor_id);
    res.json(doctorData);
  }

  static async getScheduleById(
    req: Request,
    res: Response,
    next: NextFunction,
  ): Promise<void> {
    const doctor_id: number = Number(req.params.id);
    const schedule: Schedule_Interface[] =
      await DoctorService.getScheduleById(doctor_id);
    console.log(schedule);
    res.statusCode = 200;
    res.json(schedule);
  }

  static async getDoctorBySpeciality(
    req: Request,
    res: Response,
    next: NextFunction,
  ): Promise<void> {
    const speciality = req.query.speciality as String;
    const result = await DoctorService.getDoctorBySpeciality(speciality);
    res.json(result);
  }

  static getAllAllergy = async (
    req: Request,
    res: Response,
    next: NextFunction,
  ): Promise<void> => {
    const patient = new Patient({ patient_id: Number(req.params.id) });
    const patientService = new PatientService();
    const result = await patientService.getAllAllergy(patient);
    res.json(result);
  };

  public getAllergyFile = async (
    req: Request,
    res: Response,
    next: NextFunction,
  ): Promise<void> => {
    const patient = new Patient({ patient_id: 30 });
    const file_id: string = req.params.id;
    const patientService = new PatientService();
    const readstream: mongoose.mongo.GridFSBucketReadStream =
      await patientService.getAllergyFile(patient, file_id);
    readstream.pipe(res);
    //  // Convert stream to buffer
    //  const streamToBuffer = (stream: mongoose.mongo.GridFSBucketReadStream) => {
    //    return new Promise((resolve, reject) => {
    //      const chunks: any = [];
    //      stream.on("data", (chunk) => {
    //        chunks.push(chunk);
    //      });
    //      stream.on("end", () => {
    //        resolve(Buffer.concat(chunks));
    //      });
    //      stream.on("error", reject);
    //    });
    //  };
  };
  public getChronicIllnessFile = async (
    req: Request,
    res: Response,
    next: NextFunction,
  ): Promise<void> => {
    const patient = new Patient({ patient_id: 30 });
    const file_id: string = req.params.id;
    const patientService = new PatientService();
    const readstream: mongoose.mongo.GridFSBucketReadStream =
      await patientService.getChronicIllnessFile(patient, file_id);
    readstream.pipe(res);
  };
  static addAllergy = async (
    req: Request,
    res: Response,
    next: NextFunction,
  ): Promise<void> => {
    logger.info(req.body.data);
    //  logger.info(req.body.files.split("A")[0]);
    const allergyData = req.body.data;
    const fileData = req.body.files;
    const patient = new Patient({ patient_id: Number(req.params.id) });
    const allergy: AllergyDTO = AllergyDTO.fromJson(allergyData);
    const files: FileDTO[] = FileDTO.fromJSON(fileData);
    const patientService = new PatientService();
    const result = await patientService.addAllergy(allergy, files, patient);
    res.json(result);
  };

  static getAllChronicIllness = async (
    req: Request,
    res: Response,
    next: NextFunction,
  ): Promise<void> => {
    const patient = new Patient({ patient_id: Number(req.params.id) });
    const patientService = new PatientService();
    const result = await patientService.getAllChronicIllness(patient);
    res.json(result);
  };
}
