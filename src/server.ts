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
    console.log("_______ middleware _________");
    next();
  }
);
server.use(patientRoute.baseUrl, PatientRouter);

server.get("/", async (req: Request, res: Response, next: NextFunction) => {
  res.json({ msg: "hello!!" });
});

server.listen(port, async () => {
  console.log(`server listening on port: 8080`);
  await db.sequelize.authenticate();
});
