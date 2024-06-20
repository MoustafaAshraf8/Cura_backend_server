import { Request, Response, NextFunction, json } from "express";
import { PatientService } from "../service/PatientService";
// import { Patient_Interface } from "../type/patient/Patient_Interface";
import { Hasher } from "../utility/Hasher";
// import { LoginCredential_Interface } from "../type/generic/LoginCredential_Interface";
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
import { TimeSlotReservationSchema } from "../validation/TimeSlotReservationSchema";
import { TimeSlot } from "../class/TimeSlot";
import { PaymentSchema } from "../validation/PaymentSchema";
import { ClinicDTO } from "../class/ClinicDTO";
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
    const validation = await TimeSlotReservationSchema.validateAsync(req.body);
    const timeslot_id = validation.timeslot_id;
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
    const patient_id: number = Number(req.body.patient_id);
    const result = await (this.service as PatientService).getSchedule(
      patient_id
    );
    res.json(result);
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
