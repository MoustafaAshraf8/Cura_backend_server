import express, { Router } from "express";
import { patientRoute } from "../constant/route";
import { PatientController } from "../controller/PatientController";
import { tryCatch } from "../utility/tryCatch";
import { setId } from "../middleware/setId";
const PatientRouter: Router = express.Router();

PatientRouter.route(patientRoute.root).get(tryCatch(PatientController.getAll));

PatientRouter.route(patientRoute.login).post(tryCatch(PatientController.login));
PatientRouter.route(patientRoute.signup).post(
  tryCatch(PatientController.signup)
);
PatientRouter.route(patientRoute.emr).get(
  setId,
  tryCatch(PatientController.getEMR)
);

export { PatientRouter };
