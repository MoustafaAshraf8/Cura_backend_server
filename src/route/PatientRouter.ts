import express, { Router, Request, Response, NextFunction } from "express";
import { patientRoute } from "../constant/route";
import { PatientController } from "../controller/PatientController";
const PatientRouter: Router = express.Router();

PatientRouter.route(patientRoute.root).get(
  (req: Request, res: Response, next: NextFunction) => {
    res.json({ msg: "patient data" });
  }
);

PatientRouter.route(patientRoute.login).post(PatientController.login);

export { PatientRouter };
