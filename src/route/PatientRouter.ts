import express, { Router } from "express";
import { patientRoute } from "../constant/route";
// import { PatientController } from "../controller/PatientController";
import { PatientController } from "../controller/PatientController";
import { tryCatch } from "../utility/tryCatch";
import { setId } from "../middleware/setId";
import { JWT } from "../utility/JWT";
const PatientRouter: Router = express.Router();

const patientController: PatientController = new PatientController();

// PatientRouter.route(patientRoute.root).get(tryCatch(patientController.getAll));

PatientRouter.route(patientRoute.signup).post(
  tryCatch(patientController.signup)
);
PatientRouter.route(patientRoute.signin).post(
  tryCatch(patientController.signin)
);

PatientRouter.route(patientRoute.payOnline).post(
  //JWT.verifyAccessToken,
  tryCatch(patientController.payOnline)
);

PatientRouter.route(patientRoute.emr + patientRoute.allergy)
  .post(JWT.verifyAccessToken, tryCatch(patientController.addAllergy))
  .get(JWT.verifyAccessToken, tryCatch(patientController.getAllAllergy));

PatientRouter.route(patientRoute.emr + patientRoute.chronicIllness)
  .post(JWT.verifyAccessToken, tryCatch(patientController.addChronicIllness))
  .get(JWT.verifyAccessToken, tryCatch(patientController.getAllChronicIllness));

PatientRouter.route(patientRoute.reserveTimeSlot).post(
  JWT.verifyAccessToken,
  tryCatch(patientController.reserveTimeSlot)
);

PatientRouter.route(patientRoute.schedule).get(patientController.getSchedule);

export { PatientRouter };
