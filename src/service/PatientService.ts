import { Patient_Interface } from "../type/patient/Patient_Interface";
import db from "../model/index";
import { LoginCredential_Interface } from "../type/generic/LoginCredential_Interface";
import { Op } from "sequelize";
import { UserNotFoundException } from "../error/UserNotFoundException";
import { EMR_Interface } from "../type/patient/EMR_Interface";
import mongoose from "mongoose";
import { EMR } from "../database/mongo/model/EMR";
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
      throw UserNotFoundException;
    }
  }

  static async signup(patient: Patient_Interface): Promise<Patient_Interface> {
    console.log("patient service");

    const patientData = await db.sequelize.transaction(async (t: any) => {
      const patientData = await db.Patient.create(patient, {
        include: [{ model: db.PatientPhoneNumber, as: "patientphonenumber" }],
      });

      const emr = await db.EMR.create({
        patient_id: patientData.dataValues.patient_id,
      });

      return patientData;
    });

    console.log(patientData.dataValues);
    const emr = await EMR.create({
      patient_id: patientData.dataValues.patient_id!,
    });
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
      throw UserNotFoundException;
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
}
