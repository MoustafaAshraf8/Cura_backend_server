import express, { Router, Request, Response, NextFunction } from "express";
import { patientRoute } from "../constant/route";
import { PatientController } from "../controller/PatientController";
const PatientRouter: Router = express.Router();

PatientRouter.route(patientRoute.root).get(PatientController.getAll);

PatientRouter.route(patientRoute.login).post(PatientController.login);
PatientRouter.route(patientRoute.signup).post(PatientController.signup);

export { PatientRouter };
