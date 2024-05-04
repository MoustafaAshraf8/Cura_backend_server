import express, { Router } from "express";
import { patientRoute } from "../constant/route";
// import { PatientController } from "../controller/PatientController";
import { PatientController } from "../controller/PatientController";
import { tryCatch } from "../utility/tryCatch";
import { setId } from "../middleware/setId";
const PatientRouter: Router = express.Router();

const patientController: PatientController = new PatientController();

PatientRouter.route(patientRoute.root).get(tryCatch(patientController.getAll));

PatientRouter.route(patientRoute.login).post(tryCatch(patientController.login));
PatientRouter.route(patientRoute.signup).post(
  tryCatch(patientController.signup)
);
PatientRouter.route(patientRoute.emr).get(
  setId,
  tryCatch(patientController.getEMR)
);

export { PatientRouter };
