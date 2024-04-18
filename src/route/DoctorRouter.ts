import express, { Router } from "express";
import { doctorRoute } from "../constant/route";
import { DoctorController } from "../controller/DoctorController";
import { tryCatch } from "../utility/tryCatch";
import { doctorSetVirtualId } from "../middleware/doctorClinicSetId";

const DoctorRouter: Router = express.Router();

DoctorRouter.route(doctorRoute.root).get(
  tryCatch(DoctorController.getDoctorBySpeciality)
);
DoctorRouter.route(doctorRoute.signup).post(tryCatch(DoctorController.signup));
DoctorRouter.route(doctorRoute.login).post(tryCatch(DoctorController.login));
DoctorRouter.route(doctorRoute.schedule)
  .post(doctorSetVirtualId, tryCatch(DoctorController.addSchedule))
  .get(doctorSetVirtualId, tryCatch(DoctorController.getSchedule));
// DoctorRouter.route(doctorRoute.timeSlot).post(
//   doctorSetVirtualId,
//   tryCatch(DoctorController.addTimeSlot)
// );

export { DoctorRouter };
