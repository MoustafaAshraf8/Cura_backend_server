import { Patient_Interface } from "../type/Patient/Patient_Interface";
import db from "../model/index";
import { LoginCredential_Interface } from "../type/Generic/LoginCredential_Interface";
import { Op } from "sequelize";
import { UserNotFoundException } from "../error/UserNotFoundException";
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

    return patientData.dataValues;
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
