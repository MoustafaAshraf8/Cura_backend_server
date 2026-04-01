import { Express, Application, Request, Response, NextFunction } from "express";
// import cron from "node-cron";
import express from "express";
import mongoose from "mongoose";
import db from "./model/index";
import { doctorRoute, patientRoute, serverRoute } from "./constant/route";
import { PatientRouter } from "./route/PatientRouter";
import { DoctorRouter } from "./route/DoctorRouter";
import dotenv from "dotenv";
import { errorHandler } from "./middleware/errorHandler";
import logger from "./utility/logger";
// import approveDoctor from "./scheduledevent/approveDoctor";
// import { Encryptor } from "./utility/Encryptor";
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
  },
);
server.use(patientRoute.baseUrl, PatientRouter);
server.use(doctorRoute.baseUrl, DoctorRouter);

// let x = "";
// // cron.schedule("0 */6 * * *", approveDoctor);
// server.get(
//   serverRoute.baseUrl,
//   async (req: Request, res: Response, next: NextFunction) => {
//     /*
//      const desease = await db.Desease.findAll({
//         include: [{ model: db.Prescription, as: "prescription" }],
//       });
//       const patient = await db.Patient.findAll({
//         include: [{ model: db.PatientPhoneNumber, as: "phone" }],
//       });

//       res.json(patient);
//      const patient = await db.Patient.findAll({
//        // where: {
//        //   desease_id: 1,
//        // },
//        include: [{ model: db.EMR, as: "emr" }],
//      });
//      res.json(patient);
//      const cipher = req.body.cipher;
//     */
//     try {
//       console.log("x: " + x);
//       const plain = Encryptor.decryptData(x);
//       res.json({
//         plain: plain,
//       });
//     } catch (err) {
//       console.error(err);
//       res.statusCode = 403;
//       res.end();
//     }
//   },
// );

// server.post(
//   serverRoute.baseUrl,
//   async (req: Request, res: Response, next: NextFunction) => {
//     //  console.log(req.body);
//     //  const result: any = await RabbitMQClient.produce({ data: req.body });
//     //  res.json({ result: result });
//     const plain = req.body.plain;
//     const encrypted = Encryptor.encryptData(plain);
//     x = encrypted;
//     res.json({
//       encrypted: encrypted,
//     });
//   },
// );

// function sleep(ms: number) {
//   return new Promise((resolve) => {
//     setTimeout(resolve, ms);
//   });
// }

function sleep(ms: number) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

async function connectToDB(tries: number) {
  logger.info(`try -> ${tries}`);
  await sleep(5000);
  if (tries >= 3) {
    throw new Error("Cannot connect to DB!!");
  }
  try {
    await db.sequelize.authenticate();
    await mongoose.connect(process.env.MONGODB_URI as string);
  } catch (err) {
    console.log(err);
    connectToDB(tries++);
  }
}

async function runMigrations() {
  await sleep(5000);
  logger.info("running migrations...");
  nrc.run("npm run migrate_up");
  logger.info("migrations ✔");
}

async function runSeeds() {
  await sleep(5000);
  logger.info("running seeds...");
  nrc.run("npm run seed_up");
  logger.info("seeds ✔");
}

var nrc = require("node-run-cmd");
server.listen(port, async () => {
  try {
    await connectToDB(1);
    await runMigrations();
    //  await runSeeds();
    logger.info(`server listening on port: ${port}`);
  } catch (err) {
    console.error(err);
    process.exit(0);
  }
});

server.use(errorHandler);
