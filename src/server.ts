import { Express, Application, Request, Response, NextFunction } from "express";
import express from "express";
import db from "./model/index";
import { patientRoute, serverRoute } from "./constant/route";
import { PatientRouter } from "./route/PatientRouter";
import dotenv from "dotenv";
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

server.get("/", async (req: Request, res: Response, next: NextFunction) => {
  //   const desease = await db.Desease.findAll({
  //     include: [{ model: db.Prescription, as: "prescription" }],
  //   });
  const patient = await db.Patient.findAll({
    include: [{ model: db.PatientPhoneNumber, as: "phone" }],
  });

  res.json(patient);
});

server.listen(port, async () => {
  console.log(`server listening on port: 8080`);
  await db.sequelize.authenticate();

  //   const user = {
  //     FirstName: "test",
  //     LastName: "test",
  //     Email: "email1`",
  //     Password: "123",
  //     patientphonenumber: [
  //       { PhoneNumber: 1 },
  //       { PhoneNumber: 2 },
  //       { PhoneNumber: 3 },
  //       { PhoneNumber: 4 },
  //       { PhoneNumber: 5 },
  //       { PhoneNumber: 6 },
  //       { PhoneNumber: 7 },
  //     ],
  //   };
  //   const patient = await db.Patient.create(user, {
  //     include: [
  //       { model: db.PatientPhoneNumber, as: "patientphonenumber" },
  //       // { model: db.EMR, as: "emr" },
  //     ],
  //   });

  //   const desease = {
  //     Diagnose: "test diagnose",
  //     Note: "test note",
  //     prescription: [
  //       { Name: "pres0", Dose: 100, Frequency: 24 },
  //       { Name: "pres1", Dose: 100, Frequency: 24 },
  //       { Name: "pres2", Dose: 100, Frequency: 24 },
  //       { Name: "pres3", Dose: 100, Frequency: 24 },
  //     ],
  //   };

  //   const res = await db.Desease.create(desease, {
  //     include: [{ model: db.Prescription, as: "prescription" }],
  //   });

  //   //   const emr = await db.EMR.create({
  //   //     patient_id: patient.dataValues.patient_id,
  //   //   });

  //   //  const patient = await db.Patient.findAll({
  //   //    where: {
  //   //      patient_id: 1,
  //   //    },
  //   //    include: { model: db.EMR, as: "emr" },
  //   //  });
  //   //   console.log(patient);
  //   // await db.Patient.destroy({ where: { patient_id: 1 } });
});
