import { Patient_Interface } from "../type/Patient_Interface";
import db from "../model/index";
import { LoginCredential_Interface } from "../type/LoginCredential_Interface";
import { Op } from "sequelize";
export class PatientService {
  static async login(
    credential: LoginCredential_Interface
  ): Promise<Patient_Interface> {
    const patient: Patient_Interface = await db.Patient.findOne({
      where: {
        [Op.and]: [
          { Email: credential.Email },
          { Password: credential.Password },
        ],
      },
      attributes: ["patient_id"],
    });
    return patient;
  }

  static async signup(patient: Patient_Interface): Promise<any> {
    console.log("patient service");
    const result: Patient_Interface = await db.Patient.create(patient, {
      include: [{ model: db.PatientPhoneNumber, as: "patientphonenumber" }],
    });
    return result;
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
