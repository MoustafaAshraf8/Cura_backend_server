import { Express, Application, Request, Response, NextFunction } from "express";
import express from "express";
import mongoose from "mongoose";
import db from "./model/index";
import { doctorRoute, patientRoute, serverRoute } from "./constant/route";
import { PatientRouter } from "./route/PatientRouter";
import { DoctorRouter } from "./route/DoctorRouter";
import dotenv from "dotenv";
import { errorHandler } from "./middleware/errorHandler";
dotenv.config();
const port = process.env.PORT || 8080;
const server: Application = express();

server.use(express.json());
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

server.use(errorHandler);

server.listen(port, async () => {
  console.log(`server listening on port: 8080`);
  try {
    await db.sequelize.authenticate();
    // await db.sequelize.sync({ force: true });

    await mongoose.connect(process.env.MONGODB_URI as string);
  } catch (error) {
    console.log(error);
  }
  //   const user = {
  //     FirstName: "user_001",
  //     LastName: "testLastName",
  //     Email: "email001",
  //     Password: "123",
  //     patientphonenumber: [
  //       { PhoneNumber: 1111 },
  //       { PhoneNumber: 2222 },
  //       { PhoneNumber: 3333 },
  //       { PhoneNumber: 4444 },
  //       { PhoneNumber: 5555 },
  //       { PhoneNumber: 6666 },
  //       { PhoneNumber: 7777 },
  //     ],
  //   };

  //   const patient = await db.Patient.create(user, {
  //     include: [
  //       { model: db.PatientPhoneNumber, as: "patientphonenumber" },
  //       // { model: db.EMR, as: "emr" },
  //     ],
  //   });
  //   const emr = {
  //     patient_id: Number(patient.dataValues.patient_id),
  //     desease: [
  //       {
  //         Diagnose: "test diagnose 01",
  //         Note: "test note",
  //         prescription: [
  //           { Name: "pres0", Dose: 100, Frequency: 24 },
  //           { Name: "pres1", Dose: 100, Frequency: 24 },
  //           { Name: "pres2", Dose: 100, Frequency: 24 },
  //           { Name: "pres3", Dose: 100, Frequency: 24 },
  //         ],
  //       },
  //       {
  //         Diagnose: "test diagnose 02",
  //         Note: "test note",
  //         prescription: [
  //           { Name: "pres0", Dose: 100, Frequency: 24 },
  //           { Name: "pres1", Dose: 100, Frequency: 24 },
  //           { Name: "pres2", Dose: 100, Frequency: 24 },
  //           { Name: "pres3", Dose: 100, Frequency: 24 },
  //         ],
  //       },
  //     ],
  //     surgery: [
  //       { Name: "surgery001" },
  //       { Name: "surgery002" },
  //       { Name: "surgery003" },
  //       { Name: "surgery004" },
  //     ],
  //   };
  //   const res = await db.EMR.create(emr, {
  //     include: [
  //       { model: db.Desease, as: "desease" },
  //       { model: db.Surgery, as: "surgery" },
  //     ],
  //   });
});
