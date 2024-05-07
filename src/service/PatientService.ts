import { Patient_Interface } from "../type/patient/Patient_Interface";
import db from "../model/index";
import { LoginCredential_Interface } from "../type/generic/LoginCredential_Interface";
import { Op } from "sequelize";
import { UserNotFoundException } from "../error/UserNotFoundException";
import { EMR_Interface } from "../type/patient/EMR_Interface";
import mongoose from "mongoose";
import { EMR } from "../database/mongo/model/EMR";
import internal from "stream";
import busboy from "busboy";
import { IncomingHttpHeaders } from "http";
import path from "path";
import { MailService } from "./MailService";
export class PatientService {
  static async login(
    credential: LoginCredential_Interface
  ): Promise<Patient_Interface> {
    try {
      const patientData = await db.Patient.findOne({
        where: {
          [Op.and]: [{ Email: credential.Email }],
        },
        attributes: ["patient_id", "Password"],
      });
      const patient: Patient_Interface = patientData.dataValues;

      return patient;
    } catch (err) {
      throw new UserNotFoundException();
    }
  }

  static async signup(
    patient: Patient_Interface,
    headers: IncomingHttpHeaders
  ): Promise<Patient_Interface> {
    // create sql data entry
    const patientData = await db.sequelize.transaction(async (t: any) => {
      const patientData = await db.Patient.create(patient, {
        include: [{ model: db.PatientPhoneNumber, as: "patientphonenumber" }],
      });
      const emr = await db.EMR.create({
        patient_id: patientData.dataValues.patient_id,
      });

      const patientId = patientData.dataValues.patient_id;

      // create mongo data entry
      const emrMongo = await EMR.create({
        patient_id: patientId,
      });

      return patientData;
    });

    // create profile image
    //  const ObjectId: mongoose.Types.ObjectId = new mongoose.Types.ObjectId(
    //    patientId
    //  );

    //  const mongoDB = mongoose.connections[0].db;
    //  const gridFSBucket: mongoose.mongo.GridFSBucket =
    //    new mongoose.mongo.GridFSBucket(mongoDB, {
    //      bucketName: "Images",
    //    });
    //  const bb: busboy.Busboy = busboy({ headers: headers });
    //  bb.on("file", async (name, file, info) => {
    //    const { filename, encoding, mimeType } = info;
    //    const newFileName = patientId + "_" + "profile_image";
    //    const saveTo = path.join(".", newFileName);
    //    const stream: mongoose.mongo.GridFSBucketWriteStream = await file.pipe(
    //      gridFSBucket.openUploadStreamWithId(ObjectId, saveTo)
    //    );
    //  });

    return patientData.dataValues;
  }

  static async getEMR(id: number): Promise<EMR_Interface> {
    console.log("get emr service");

    const emr = await db.EMR.findOne({
      where: {
        patient_id: id,
      },
      // include: [{ all: true, nested: true }],
      include: [
        {
          model: db.Desease,
          as: "desease",
          include: [{ model: db.Prescription, as: "prescription" }],
        },
        { model: db.Surgery, as: "surgery", nested: true },
      ],
    });
    if (emr == null) {
      throw new UserNotFoundException();
    }
    return emr;
  }

  static async getAll(): Promise<Patient_Interface> {
    const patients = await db.Patient.findAll({
      include: [
        { model: db.EMR, association: "emr" },
        { model: db.PatientPhoneNumber, association: "patientphonenumber" },
      ],
    });
    return patients;
  }

  static async addSurgery(
    surgeryName: String,
    //  name: String,
    //  file: internal.Readable,
    //  info: busboy.FileInfo,
    headers: IncomingHttpHeaders
  ): Promise<busboy.Busboy> {
    const db = mongoose.connections[0].db;
    const gridFSBucket: mongoose.mongo.GridFSBucket =
      new mongoose.mongo.GridFSBucket(db, {
        bucketName: "newUploads",
      });
    const bb: busboy.Busboy = busboy({ headers: headers });
    bb.on("file", (name, file, info) => {
      console.log("file found");
      const { filename, encoding, mimeType } = info;
      const saveTo = path.join(".", filename);
      // here we PIPE the file to DB.
      file.pipe(gridFSBucket.openUploadStream(saveTo));
    });
    //  req.pipe(bb);
    return bb;
  }
}
