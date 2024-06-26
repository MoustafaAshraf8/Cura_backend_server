//import { Patient_Interface } from "../type/patient/Patient_Interface";

//import { LoginCredential_Interface } from "../type/generic/LoginCredential_Interface";
import { Op } from "sequelize";
import { UserNotFoundException } from "../error/UserNotFoundException";
//import { EMR_Interface } from "../type/patient/EMR_Interface";
import mongoose from "mongoose";
import { EMR, IEMR, IEMRModel } from "../database/mongo/model/EMR";
import internal, { Readable } from "stream";
import busboy from "busboy";
import { IncomingHttpHeaders } from "http";
import path from "path";
import { MailService } from "../service/MailService";
import { PatientRepository } from "./PatientRepository";
import { Repository } from "./Repository";
import db from "../model/index";
import { Patient } from "../dto/Patient";
import { User } from "../dto/User";
import { UnothorizedUserException } from "../error/UnothorizedUserException";
import { AllergyDTO } from "../dto/AllergyDTO";
import {
  Allergy,
  IAllergy,
  IAllergyModel,
} from "../database/mongo/model/Allergy";
import { FileDTO } from "../dto/FileDTO";
import { ChronicIllnessDTO } from "../dto/ChronicIllnessDTO";
import {
  ChronicIllness,
  IChronicIllness,
  IChronicIllnessModel,
} from "../database/mongo/model/ChronicIllness";
import { EMRNotFoundException } from "../error/EMRNotFoundException";

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

  public getEMR = async (patient_id: number): Promise<IEMRModel> => {
    const emr: IEMRModel | null = await EMR.findOne({
      patient_id: patient_id,
    });
    if (emr == null) {
      throw new Error("emr not found");
    }
    return emr;
  };

  public addAllergy = async (
    allergyDTO: AllergyDTO
  ): Promise<IAllergyModel> => {
    const allergy: IAllergyModel = await Allergy.create(allergyDTO.toJson());

    return allergy;
  };

  public addAllergyFile = async (file: FileDTO): Promise<any> => {
    var fs = require("fs");
    var Readable = require("stream").Readable;
    const db = mongoose.connections[0].db;
    const AllergyGridFSBucket: mongoose.mongo.GridFSBucket =
      new mongoose.mongo.GridFSBucket(db, {
        bucketName: "AllergyGridFSBucket",
      });
    const imgBuffer = Buffer.from(file.base64, "base64");
    const metadata: object = file.getMetaData();
    var s = new Readable();
    const saveTo = path.join(".", file.filename);
    await s.push(imgBuffer);
    await s.push(null);
    const stream = await s.pipe(
      AllergyGridFSBucket.openUploadStream(saveTo, { metadata: metadata })
    );
    return stream;
  };

  public getAllAllergy = async (patient: Patient): Promise<AllergyDTO[]> => {
    const emr: IEMRModel | null = await EMR.findOne({
      patient_id: patient.patient_id,
    }).populate("allergy");
    //  const pipeline = [
    //    {
    //      $match: {
    //        patient_id: 30,
    //      },
    //    },
    //    {
    //      $lookup: {
    //        from: "Allergy",
    //        localField: "allergy",
    //        foreignField: "_id",
    //        as: "allergies",
    //      },
    //    },
    //  ];
    //  var emr: any = await Object(mongoose.connections[0].db)
    //    .collection("EMR")
    //    .aggregate(pipeline);

    //  console.log("xxxxxxxxxxxxxxxxxxxxxxxx");
    //  emr = await emr.toArray();
    //  console.log(emr);
    //  console.log("xxxxxxxxxxxxxxxxxxxxxxxx");
    if (emr === null) {
      throw new EMRNotFoundException();
    }
    const allergies: AllergyDTO[] = Object(emr).allergy.map(
      (allergy: IAllergy) => AllergyDTO.fromJson(Object(allergy)._doc)
    );
    // console.log(emr?.allergy);
    return allergies;
  };

  public getAllergyFile = async (
    file_id: string
  ): Promise<mongoose.mongo.GridFSBucketReadStream> => {
    // var fs = require("fs");
    // var Readable = require("stream").Readable;
    const db = mongoose.connections[0].db;
    const AllergyGridFSBucket: mongoose.mongo.GridFSBucket =
      new mongoose.mongo.GridFSBucket(db, {
        bucketName: "AllergyGridFSBucket",
      });

    const readStream: mongoose.mongo.GridFSBucketReadStream =
      await AllergyGridFSBucket.openDownloadStream(
        new mongoose.Types.ObjectId(file_id)
      );
    return readStream;
  };

  public addChronicIllness = async (
    chronicIllnessDTO: ChronicIllnessDTO
  ): Promise<IChronicIllnessModel> => {
    const chronicIllness: IChronicIllnessModel = await ChronicIllness.create(
      chronicIllnessDTO.toJson()
    );

    return chronicIllness;
  };

  public addChronicIllnessFile = async (file: FileDTO): Promise<any> => {
    var fs = require("fs");
    var Readable = require("stream").Readable;
    const db = mongoose.connections[0].db;
    const ChronicIllnessGridFSBucket: any = new mongoose.mongo.GridFSBucket(
      db,
      {
        bucketName: "ChronicIllnessGridFSBucket",
      }
    );
    const imgBuffer = Buffer.from(file.base64, "base64");
    var s = new Readable();
    const saveTo = path.join(".", file.filename);
    await s.push(imgBuffer);
    await s.push(null);
    const stream = await s.pipe(
      ChronicIllnessGridFSBucket.openUploadStream(saveTo)
    );
    return stream;
  };

  public getAllChronicIllness = async (
    patient: Patient
  ): Promise<ChronicIllnessDTO[]> => {
    const emr: IEMRModel | null = await EMR.findOne({
      patient_id: patient.patient_id,
    }).populate("chronicIllness");

    const chronicIllness: ChronicIllnessDTO[] = Object(emr).chronicIllness.map(
      (chronicIllness: IChronicIllnessModel) =>
        ChronicIllnessDTO.fromJson(Object(chronicIllness)._doc)
    );

    return chronicIllness;
  };

  public getChronicIllnessFile = async (
    file_id: string
  ): Promise<mongoose.mongo.GridFSBucketReadStream> => {
    // var fs = require("fs");
    // var Readable = require("stream").Readable;
    const db = mongoose.connections[0].db;
    const AllergyGridFSBucket: mongoose.mongo.GridFSBucket =
      new mongoose.mongo.GridFSBucket(db, {
        bucketName: "ChronicIllnessGridFSBucket",
      });

    const readStream: mongoose.mongo.GridFSBucketReadStream =
      await AllergyGridFSBucket.openDownloadStream(
        new mongoose.Types.ObjectId(file_id)
      );
    return readStream;
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
