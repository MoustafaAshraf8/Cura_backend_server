import { Doctor_Interface } from "../type/doctor/Doctor_Interface";
import db from "../model/index";
import { LoginCredential_Interface } from "../type/generic/LoginCredential_Interface";
import { Op } from "sequelize";
import { UserNotFoundException } from "../error/UserNotFoundException";
import { Schedule_Interface } from "../type/doctor/Schedule_Interface";
import { ScheduleNotFoundException } from "../error/doctorException/ScheduleNotFoundException";
export class DoctorService {
  static async login(
    credential: LoginCredential_Interface
  ): Promise<Doctor_Interface> {
    const doctorData = await db.Doctor.findOne({
      where: {
        [Op.and]: [{ Email: credential.Email }],
      },
      // attributes: ["patient_id", "Password"],
      include: { model: db.Speciality, as: "speciality" },
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
      const doctorData = await db.Doctor.create(doctor);

      const clinic = await db.Clinic.create({
        doctor_id: doctorData.dataValues.doctor_id,
        Name: doctorData.dataValues.FirstName + "'s " + "clinic",
      });

      return doctorData.dataValues;
    });

    return doctorData;
  }

  static async addSchedule(
    schedule: Schedule_Interface
  ): Promise<Schedule_Interface> {
    console.log("doctor addSchedule service");

    const scheduleData = await db.Schedule.create(schedule);
    if (scheduleData == null) {
      throw new Error();
    }

    return scheduleData;
  }

  static async getSchedule(clinic_id: number): Promise<Schedule_Interface> {
    console.log("doctor getSchedule service");

    const scheduleData = await db.Schedule.findAll({
      where: {
        clinic_id: clinic_id,
      },
    });
    if (scheduleData == null) {
      throw ScheduleNotFoundException;
    }

    return scheduleData;
  }
}
