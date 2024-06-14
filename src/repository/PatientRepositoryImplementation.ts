//import { Patient_Interface } from "../type/patient/Patient_Interface";

//import { LoginCredential_Interface } from "../type/generic/LoginCredential_Interface";
import { Op } from "sequelize";
import { UserNotFoundException } from "../error/UserNotFoundException";
//import { EMR_Interface } from "../type/patient/EMR_Interface";
import mongoose from "mongoose";
import { EMR } from "../database/mongo/model/EMR";
import internal from "stream";
import busboy from "busboy";
import { IncomingHttpHeaders } from "http";
import path from "path";
import { MailService } from "../service/MailService";
import { PatientRepository } from "./PatientRepository";
import { Repository } from "./Repository";
import db from "../model/index";
import { Patient } from "../class/Patient";
import { User } from "../class/User";
import { UnothorizedUserException } from "../error/UnothorizedUserException";

export class PatientRepositoryImplementation
  extends Repository
  implements PatientRepository
{
  constructor() {
    super(db.Patient);
  }

  public signin = async (user: User): Promise<Patient> => {
    try {
      const patientData = await db.Patient.findOne({
        where: {
          [Op.and]: [{ Email: user.Email }],
        },
        // attributes: ["patient_id", "Password"],
      });

      const patient: Patient = new Patient(patientData.dataValues);
      return patient;
    } catch (err) {
      throw UserNotFoundException;
    }
  };

  public signup = async (patient: Patient): Promise<Patient> => {
    const patientData = await db.sequelize.transaction(async (t: any) => {
      const patientData = await (this.model as typeof db.Patient).create(
        patient,
        {
          include: [{ model: db.PatientPhoneNumber, as: "patientphonenumber" }],
        }
      );
      const emr = await db.EMR.create({
        patient_id: patientData.dataValues.patient_id,
      });

      const patientId = patientData.dataValues.patient_id;

      // create mongo data entry
      // const emrMongo = await EMR.create({
      //   patient_id: patientId,
      // });

      return patientData;
    });

    return new Patient(patientData.dataValues);
  };

  public authorize = async (patient_id: number): Promise<Patient> => {
    const patient = await (this.model as typeof db.Patient).findOne({
      where: {
        patient_id: patient_id,
      },
    });

    if (patient.dataValues.length == 0) throw new UnothorizedUserException();

    return patient;
  };

  //   public getEMR = async (id: number): Promise<EMR_Interface> => {
  //     console.log("get emr service");

  //     const emr = await db.EMR.findOne({
  //       where: {
  //         patient_id: id,
  //       },
  //       // include: [{ all: true, nested: true }],
  //       include: [
  //         {
  //           model: db.Desease,
  //           as: "desease",
  //           include: [{ model: db.Prescription, as: "prescription" }],
  //         },
  //         { model: db.Surgery, as: "surgery", nested: true },
  //       ],
  //     });
  //     if (emr == null) {
  //       throw UserNotFoundException;
  //     }
  //     return emr;
  //   };

  //   public getAll = async (): Promise<Patient_Interface> => {
  //     const patients = await db.Patient.findAll({
  //       include: [
  //         { model: db.EMR, association: "emr" },
  //         { model: db.PatientPhoneNumber, association: "patientphonenumber" },
  //       ],
  //     });
  //     return patients;
  //   };

  //   public addSurgery = async (
  //     surgeryName: String,
  //     //  name: String,
  //     //  file: internal.Readable,
  //     //  info: busboy.FileInfo,
  //     headers: IncomingHttpHeaders
  //   ): Promise<busboy.Busboy> => {
  //     const db = mongoose.connections[0].db;
  //     const gridFSBucket: mongoose.mongo.GridFSBucket =
  //       new mongoose.mongo.GridFSBucket(db, {
  //         bucketName: "newUploads",
  //       });
  //     const bb: busboy.Busboy = busboy({ headers: headers });
  //     bb.on("file", (name, file, info) => {
  //       console.log("file found");
  //       const { filename, encoding, mimeType } = info;
  //       const saveTo = path.join(".", filename);
  //       // here we PIPE the file to DB.
  //       file.pipe(gridFSBucket.openUploadStream(saveTo));
  //     });
  //     //  req.pipe(bb);
  //     return bb;
  //   };
}
