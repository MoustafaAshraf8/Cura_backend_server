import { Express, Application, Request, Response, NextFunction } from "express";
import express from "express";
import mongoose from "mongoose";
import db from "./model/index";
import { doctorRoute, patientRoute, serverRoute } from "./constant/route";
import { PatientRouter } from "./route/PatientRouter";
import { DoctorRouter } from "./route/DoctorRouter";
import dotenv from "dotenv";
import { errorHandler } from "./middleware/errorHandler";
import RabbitMQClient from "./RabbitMQ/BookingServiceRabbitMQClient";
dotenv.config();
const port = process.env.PORT || 8080;
const server: Application = express();

server.use(express.json({ limit: "50mb" }));
server.use(express.urlencoded({ limit: "50mb" }));
server.use(
  serverRoute.baseUrl,
  (req: Request, res: Response, next: NextFunction) => {
    console.log("________________");
    next();
  }
);
server.use(patientRoute.baseUrl, PatientRouter);
server.use(doctorRoute.baseUrl, DoctorRouter);

server.get(
  serverRoute.baseUrl,
  async (req: Request, res: Response, next: NextFunction) => {
    //   const desease = await db.Desease.findAll({
    //     include: [{ model: db.Prescription, as: "prescription" }],
    //   });
    //   const patient = await db.Patient.findAll({
    //     include: [{ model: db.PatientPhoneNumber, as: "phone" }],
    //   });

    //   res.json(patient);
    const patient = await db.Patient.findAll({
      // where: {
      //   desease_id: 1,
      // },
      include: [{ model: db.EMR, as: "emr" }],
    });
    res.json(patient);
  }
);

server.post(
  serverRoute.baseUrl,
  async (req: Request, res: Response, next: NextFunction) => {
    console.log(req.body);
    const result: any = await RabbitMQClient.produce({ data: req.body });
    res.json({ result: result });
  }
);

server.use(errorHandler);

import logger from "./utility/logger";
function sleep(ms: number) {
  return new Promise((resolve) => {
    setTimeout(resolve, ms);
  });
}

async function connectToDB(tries: number) {
  logger.info(`try -> ${tries}`);
  //   await sleep(5000);
  if (tries >= 3) {
    throw new Error("Cannot connect to DB!!");
  }
  try {
    await db.sequelize.authenticate();
    //  await mongoose.connect(process.env.MONGODB_URI as string);
  } catch (err) {
    console.log(err);
    connectToDB(tries++);
  }
}

async function runMigrations() {
  await sleep(5000);
  nrc.run("npm run migrate_up");
}

var nrc = require("node-run-cmd");
server.listen(port, async () => {
  try {
    await connectToDB(1);
    //  await runMigrations();
    logger.info(`server listening on port: ${port}`);
  } catch (err) {
    console.error(err);
    process.exit(0);
  }
});
