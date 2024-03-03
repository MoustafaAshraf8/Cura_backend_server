import { Doctor_Interface } from "../type/doctor/Doctor_Interface";
import db from "../model/index";
import { LoginCredential_Interface } from "../type/generic/LoginCredential_Interface";
import { Op } from "sequelize";
import { UserNotFoundException } from "../error/UserNotFoundException";
export class DoctorService {
  static async login(
    credential: LoginCredential_Interface
  ): Promise<Doctor_Interface> {
    const doctorData = await db.Patient.findOne({
      where: {
        [Op.and]: [{ Email: credential.Email }],
      },
      attributes: ["patient_id", "Password"],
    });
    if (!doctorData) {
      throw UserNotFoundException;
    }
    const doctor: Doctor_Interface = doctorData.dataValues;
    return doctor;
  }

  static async signup(doctor: Doctor_Interface): Promise<Doctor_Interface> {
    console.log("doctor signup service");

    const doctorData = await db.sequelize.transaction(async (t: any) => {
      // const doctorData = await db.Patient.create(doctor, {
      //   include: [{ model: db.PatientPhoneNumber, as: "patientphonenumber" }],
      // });
      const doctorData = await db.Doctor.create(doctor);

      const clinic = await db.Clinic.create({
        doctor_id: doctorData.dataValues.doctor_id,
        Name: doctorData.dataValues.FirstName + "'s " + "clinic",
      });

      return doctorData.dataValues;
    });

    return doctorData;
  }

  //   static async getEMR(id: number): Promise<EMR_Interface> {
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
  //   }

  //   static async getAll(): Promise<Patient_Interface> {
  //     const patients = await db.Patient.findAll({
  //       include: [
  //         { model: db.EMR, association: "emr" },
  //         { model: db.PatientPhoneNumber, association: "patientphonenumber" },
  //       ],
  //     });
  //     return patients;
  //   }
}
