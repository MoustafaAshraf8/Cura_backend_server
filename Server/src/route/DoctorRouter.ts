import express, { Router } from "express";
import { doctorRoute } from "../constant/route";
import { DoctorController } from "../controller/DoctorController";
import { tryCatch } from "../utility/tryCatch";
import { doctorSetVirtualId } from "../middleware/doctorClinicSetId";
import { JWT } from "../utility/JWT";
import { DoctorService } from "../service/DoctorService";

const DoctorRouter: Router = express.Router();

DoctorRouter.route(doctorRoute.root).get(
  tryCatch(DoctorController.getDoctorBySpeciality)
);
DoctorRouter.route(doctorRoute.signup).post(tryCatch(DoctorController.signup));
DoctorRouter.route(doctorRoute.login).post(tryCatch(DoctorController.login));

DoctorRouter.route(doctorRoute.mySchedule)
  .post(JWT.verifyAccessToken, tryCatch(DoctorController.addSchedule))
  .get(JWT.verifyAccessToken, tryCatch(DoctorController.getMySchedule));

DoctorRouter.route(doctorRoute.reserved)
  //   .post(JWT.verifyAccessToken, tryCatch(DoctorController.addSchedule))
  .get(JWT.verifyAccessToken, tryCatch(DoctorController.getReservedTimeSlot));

DoctorRouter.route(doctorRoute.scheduleWithId).get(
  tryCatch(DoctorController.getScheduleById)
);
//   .delete(
//     JWT.verifyAccessToken,
//     tryCatch(DoctorController.)
//   );
DoctorRouter.route(doctorRoute.timeSlotWithId).delete(
  JWT.verifyAccessToken,
  tryCatch(DoctorController.deleteReservedTimeSlot)
);

DoctorRouter.route(doctorRoute.timeSlot).post(
  doctorSetVirtualId,
  tryCatch(DoctorController.addTimeSlot)
);

DoctorRouter.route(doctorRoute.profile).get(
  tryCatch(DoctorController.getDoctorProfile)
);

export { DoctorRouter };
