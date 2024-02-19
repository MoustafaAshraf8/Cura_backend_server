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

server.get("/", (req: Request, res: Response, next: NextFunction) => {
  res.json({ msg: "hello in cura server!!" });
});

server.listen(port, async () => {
  console.log(`server listening on port: 8080`);
  //   const user = {
  //     FirstName: "test",
  //     LastName: "test",
  //     Email: "email21`",
  //     Password: "123",
  //     patientphonenumber: { PhoneNumber: 123456789 },
  //   };
  //   await db.sequelize.authenticate();
  //   const patient = await db.Patient.create(user, {
  //     include: [
  //       { model: db.PatientPhoneNumber, as: "patientphonenumber" },
  //       { model: db.EMR, as: "emr" },
  //     ],
  //   });

  //   const emr = await db.EMR.create({
  //     patient_id: patient.dataValues.patient_id,
  //   });

  //  const patient = await db.Patient.findAll({
  //    where: {
  //      patient_id: 1,
  //    },
  //    include: { model: db.EMR, as: "emr" },
  //  });
  //   console.log(patient);
  // await db.Patient.destroy({ where: { patient_id: 1 } });
});
