import { Express, Application, Request, Response, NextFunction } from "express";
import express from "express";
import dotenv from "dotenv";
dotenv.config();
const server: Application = express();

server.get("/", (req: Request, res, next) => {
  console.log("hello!");
  res.json({ msg: "hello in cura server" });
});

server.listen(8080, () => {
  console.log(`server listening on port: 8080`);
});
