import express, { Router } from "express";
import { doctorRoute } from "../constant/route";
import { DoctorController } from "../controller/DoctorController";
import { tryCatch } from "../utility/tryCatch";

const DoctorRouter: Router = express.Router();
console.log("777777777777777");

DoctorRouter.route(doctorRoute.signup).post(tryCatch(DoctorController.signup));
DoctorRouter.route(doctorRoute.login).post(tryCatch(DoctorController.login));

export { DoctorRouter };
