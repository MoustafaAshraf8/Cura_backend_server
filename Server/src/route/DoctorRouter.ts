import express, { Router } from "express";
import { doctorRoute } from "../constant/route";
import { DoctorController } from "../controller/DoctorController";
import { tryCatch } from "../utility/tryCatch";
import { JWT } from "../utility/JWT";

const DoctorRouter: Router = express.Router();

DoctorRouter.route(doctorRoute.signup).post(tryCatch(DoctorController.signup));
DoctorRouter.route(doctorRoute.login).post(tryCatch(DoctorController.login));

DoctorRouter.route(doctorRoute.mySchedule)
  .post(JWT.verifyAccessToken, tryCatch(DoctorController.addSchedule))
  .get(JWT.verifyAccessToken, tryCatch(DoctorController.getMySchedule));

DoctorRouter.route(doctorRoute.timeSlot).post(
  JWT.verifyAccessToken,
  tryCatch(DoctorController.addTimeSlot),
);
DoctorRouter.route(doctorRoute.reservedTimeslot).get(
  JWT.verifyAccessToken,
  tryCatch(DoctorController.getReservedTimeSlot),
);
DoctorRouter.route(doctorRoute.timeSlotWithId).delete(
  JWT.verifyAccessToken,
  tryCatch(DoctorController.deleteReservedTimeSlot),
);

DoctorRouter.route(doctorRoute.allergyWithId)
  .get(DoctorController.getAllAllergy)
  .post(DoctorController.addAllergy);

DoctorRouter.route(doctorRoute.chronicIllnessWithId).get(
  DoctorController.getAllChronicIllness,
);

DoctorRouter.route(doctorRoute.allergyFileWithId).get(
  DoctorController.getAllChronicIllness,
);
DoctorRouter.route(doctorRoute.chronicIllnessFileWithId).get(
  DoctorController.getAllChronicIllness,
);

DoctorRouter.route(doctorRoute.root).get(
  JWT.verifyAccessToken,
  tryCatch(DoctorController.getDoctorBySpeciality),
);

DoctorRouter.route(doctorRoute.profile).get(
  JWT.verifyAccessToken,
  tryCatch(DoctorController.getDoctorProfile),
);

DoctorRouter.route(doctorRoute.scheduleWithId).get(
  JWT.verifyAccessToken,
  tryCatch(DoctorController.getScheduleById),
);

export { DoctorRouter };
