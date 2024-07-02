import db from "../model/index";
import { Doctor_Interface } from "../type/doctor/Doctor_Interface";
import { LoginCredential_Interface } from "../type/generic/LoginCredential_Interface";
import { Op } from "sequelize";
import { UserNotFoundException } from "../error/UserNotFoundException";
import { Schedule_Interface } from "../type/doctor/Schedule_Interface";
import { ScheduleNotFoundException } from "../error/doctorException/ScheduleNotFoundException";
import { TimeSlot_Interface } from "../type/doctor/TimeSlot_Interface";
import { ForbiddenAccessException } from "../error/ForbiddenAccessException";
import { TimeSlot } from "../dto/TimeSlot";
import { ClinicDTO } from "../dto/ClinicDTO";
import { ClinicNotFoundException } from "../error/doctorException/ClinicNotFoundException";
import { TimeSlotNotFoundException } from "../error/TimeSlotNotFoundException";
import { ScheduleDTO } from "../dto/ScheduleDTO";
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
      throw new UserNotFoundException();
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
    doctor_id: number,
    schedule: ScheduleDTO
  ): Promise<ScheduleDTO> {
    console.log("doctor addSchedule service");

    const clinic_id = await db.Clinic.findOne({
      where: {
        doctor_id: doctor_id,
      },
      attributes: ["clinic_id"],
    });

    if (clinic_id == null) {
      throw new UserNotFoundException();
    }

    const scheduleObj = {
      clinic_id: clinic_id.dataValues.clinic_id,
      Day: schedule.Day,
      Date: schedule.Date,
    };

    const scheduleData = await db.Schedule.create(scheduleObj);
    if (scheduleData == null) {
      throw new Error();
    }

    const timeslotObjList = schedule.timeslot.map((slot) => {
      return {
        schedule_id: scheduleData.dataValues.schedule_id,
        Start: slot.Start,
        End: slot.End,
      };
    });

    const timeslotData = await db.TimeSlot.bulkCreate(timeslotObjList);
    const newSchedule = new ScheduleDTO({
      ...scheduleData.dataValues,
      timeslot: timeslotData,
    });

    return newSchedule;
  }

  static async getMySchedule(doctor_id: number): Promise<Schedule_Interface[]> {
    console.log("doctor getSchedule service");

    const clinic_id = await db.Clinic.findOne({
      where: {
        doctor_id: doctor_id,
      },
      attributes: ["clinic_id"],
    });

    if (clinic_id == null) {
      throw UserNotFoundException;
    }

    const scheduleData: Schedule_Interface[] = await db.Schedule.findAll({
      where: {
        clinic_id: clinic_id.dataValues.clinic_id,
      },
      include: [{ association: "timeslot" }],
      // attributes: {
      //   exclude: ["clinic_id"],
      // },
    });
    if (scheduleData == null) {
      throw new ScheduleNotFoundException();
    }

    return scheduleData;
  }

  static async getScheduleById(
    doctor_id: number
  ): Promise<Schedule_Interface[]> {
    console.log("doctor getSchedule service");

    const clinic_id = await db.Clinic.findOne({
      where: {
        doctor_id: doctor_id,
      },
      attributes: ["clinic_id"],
    });
    if (clinic_id == null) {
      throw UserNotFoundException;
    }
    const scheduleData: Schedule_Interface[] = await db.Schedule.findAll({
      include: {
        association: "timeslot",
        attributes: ["timeslot_id", "Start", "End"],
      },
      where: {
        clinic_id: clinic_id.dataValues.clinic_id,
      },
      attributes: {
        exclude: ["clinic_id"],
      },
    });
    if (scheduleData == null) {
      throw ScheduleNotFoundException;
    }

    return scheduleData;
  }

  static async getReservedTimeSlot(doctor_id: number): Promise<any> {
    const timeslots = await db.TimeSlot.findAll({
      include: [
        {
          association: "schedule",
          include: [
            {
              association: "clinic",
              include: [
                {
                  association: "doctor",
                  where: { doctor_id: doctor_id }, // Filter by doctor_id
                },
              ],
            },
          ],
        },
        {
          association: "patient",
        },
      ],
      where: {
        patient_id: {
          [Op.ne]: null,
        },
      },
    })
      .then((timeSlots: any) => {
        return timeSlots;
      })
      .catch((err: any) => {
        // Handle errors
        console.error("Error fetching time slots:", err);
      });
    return timeslots;
  }

  static async deleteReservedTimeSlot2(doctor_id: number, timeslot_id: number) {
    try {
      // Find the TimeSlot that matches the criteria
      const timeSlot = await db.TimeSlot.findOne({
        where: {
          timeslot_id: timeslot_id,
        },
        include: [
          {
            association: "schedule",
            include: [
              {
                association: "clinic",
                include: [
                  {
                    association: "doctor",
                    where: { doctor_id: doctor_id }, // Filter by doctor_id
                  },
                ],
              },
            ],
          },
          {
            association: "patient",
          },
        ],
      });

      // If the time slot is found, update the patient_id to null
      if (timeSlot) {
        timeSlot.patient_id = null;
        await timeSlot.save();
        return timeSlot;
      } else {
        throw new TimeSlotNotFoundException();
      }
    } catch (err) {
      // Handle errors
      console.error("Error updating time slot:", err);
      throw err; // Rethrow the error or handle it as needed
    }
  }

  static async getDoctorBySpeciality(
    speciality: String
  ): Promise<Doctor_Interface[]> {
    const doctorList = await db.Doctor.findAll({
      include: {
        association: "speciality",
        attributes: [],
        where: { Name: speciality },
      },
      attributes: [
        "doctor_id",
        "FirstName",
        "LastName",
        "Gender",
        "Rating",
        "Experience",
      ],
    });

    return doctorList;
  }

  static async addTimeSlot(
    doctor_id: number,
    timeSlot: TimeSlot_Interface
  ): Promise<TimeSlot_Interface> {
    console.log("doctor addTimeSlot service");

    const timeSlotData = await db.TimeSlot.create(timeSlot);
    return timeSlotData.dataValues;
  }

  static async getDoctorProfile(
    doctor_id: number
  ): Promise<Schedule_Interface[]> {
    console.log("doctor getProfile service");

    const doctorData = await db.Doctor.findOne({
      where: {
        doctor_id: doctor_id,
      },
      include: [
        {
          association: "speciality",
        },
        {
          association: "clinic",
          attributes: {
            exclude: ["doctor_id"],
          },
          include: [
            {
              association: "schedule",
              include: [
                {
                  association: "timeslot",
                  // where: {
                  //   patient_id: null,
                  // },
                },
              ],
            },
          ],
        },
      ],
      attributes: {
        exclude: ["Password", "speciality_id", "DOB"],
      },
    });
    if (doctorData == null) {
      throw UserNotFoundException;
    }

    return doctorData;
  }

  static async reserveTimeSlot(targetTimeSlot: TimeSlot): Promise<TimeSlot> {
    // const timeSlot = db.TimeSlot.findOne({
    //    where:{
    //       timeslot_id:timeslot_id
    //    }
    // });
    // await timeSlot.update({patient_id:patient_id});
    // timeSlot.save();

    //  const timeSlot = await db.TimeSlot.update(
    //    { patient_id: patient_id },
    //    {
    //      where: {
    //        timeslot_id: timeslot_id,
    //        patient_id: null,
    //      },
    //    }
    //  );
    //  console.log("-------------------------");
    //  console.log(timeSlot);
    //  if (timeSlot[0] == 0) throw new ForbiddenAccessException();

    const timeSlotObj = await db.sequelize.transaction(async (t: any) => {
      const timeslot = await db.TimeSlot.findOne({
        where: {
          timeslot_id: targetTimeSlot.timeslot_id,
        },
      });

      if (timeslot.patient_id != null) {
        throw new ForbiddenAccessException();
      }

      await timeslot.update({ patient_id: targetTimeSlot.patient_id });
      await timeslot.save();

      return timeslot.dataValues;
    });

    return new TimeSlot(timeSlotObj);
  }

  static async deleteReservedTimeSlot(
    targetTimeSlot: TimeSlot
  ): Promise<boolean> {
    // const timeSlot = db.TimeSlot.findOne({
    //    where:{
    //       timeslot_id:timeslot_id
    //    }
    // });
    // await timeSlot.update({patient_id:patient_id});
    // timeSlot.save();

    //  const timeSlot = await db.TimeSlot.update(
    //    { patient_id: patient_id },
    //    {
    //      where: {
    //        timeslot_id: timeslot_id,
    //        patient_id: null,
    //      },
    //    }
    //  );
    //  console.log("-------------------------");
    //  console.log(timeSlot);
    //  if (timeSlot[0] == 0) throw new ForbiddenAccessException();

    //  const timeSlotObj = await db.sequelize.transaction(async (t: any) => {
    //    const timeslot = await db.TimeSlot.findOne({
    //      where: {
    //        timeslot_id: targetTimeSlot.timeslot_id,
    //      },
    //    });

    //    if (timeslot.patient_id != null) {
    //      throw new ForbiddenAccessException();
    //    }

    //    await timeslot.update({ patient_id: targetTimeSlot.patient_id });
    //    await timeslot.save();

    //    return timeslot.dataValues;
    //  });

    const timeslotObj = await db.TimeSlot.update(
      {
        patient_id: null,
      },
      {
        where: {
          patient_id: targetTimeSlot.patient_id,
          timeslot_id: targetTimeSlot.timeslot_id,
        },
      }
    );

    if (!timeslotObj[0]) {
      throw new TimeSlotNotFoundException();
    }
    return true;
  }

  static async getClinicData(clinicDTO: ClinicDTO): Promise<ClinicDTO> {
    const clinic: ClinicDTO = await db.Clinic.findOne({
      where: {
        clinic_id: clinicDTO.clinic_id,
      },
    });

    if (clinic == null) {
      throw new ClinicNotFoundException();
    }
    return new ClinicDTO(clinic);
  }

  static async getPatientSchedule(patient_id: number): Promise<any> {
    const timeSlot = await db.TimeSlot.findAll({
      // raw: true,
      // include: [
      //   {
      //     association: "schedule",
      //     as: "schedule",
      //     include: [
      //       {
      //         association: "clinic",
      //         as: "clinic",
      //         include: [
      //           {
      //             association: "doctor",
      //             as: "doctor",
      //           },
      //         ],
      //       },
      //     ],
      //   },
      // ],
      where: {
        patient_id: patient_id,
      },
      include: [
        {
          association: "schedule",

          include: [
            {
              association: "clinic",
              include: [
                {
                  association: "doctor",
                  include: [{ association: "speciality" }],
                },
              ],
            },
          ],
        },
      ],
    });
    console.log(timeSlot);
    return timeSlot;
  }
}
