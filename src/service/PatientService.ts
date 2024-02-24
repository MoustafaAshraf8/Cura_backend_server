import { Patient_Interface } from "../type/Patient_Interface";
import db from "../model/index";
export class PatientService {
  static async login(): Promise<void> {
    console.log("patient service");
    return;
  }

  static async signup(patient: Patient_Interface): Promise<void> {
    console.log("patient service");
    await db.Patient.create(patient);
    return;
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
