import express, { Router } from "express";
import { doctorRoute } from "../constant/route";
import { DoctorController } from "../controller/DoctorController";
import { tryCatch } from "../utility/tryCatch";
import { doctorClinicSetId } from "../middleware/doctorClinicSetId";

const DoctorRouter: Router = express.Router();

DoctorRouter.route(doctorRoute.signup).post(tryCatch(DoctorController.signup));
DoctorRouter.route(doctorRoute.login).post(tryCatch(DoctorController.login));
DoctorRouter.route(doctorRoute.schedule)
  .post(tryCatch(DoctorController.addSchedule))
  .get(doctorClinicSetId, tryCatch(DoctorController.getSchedule));
DoctorRouter.route(doctorRoute.timeSlot).post(
  tryCatch(DoctorController.addTimeSlot)
);

export { DoctorRouter };
