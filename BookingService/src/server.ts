// import express, { Express, Request, Response, Application } from "express";
import dotenv from "dotenv";
import RabbitMQClient from "./RabbitMQ/RabbitMQClient";

//For env File
dotenv.config();

// const app: Application = express();

// app.get("/", (req: Request, res: Response) => {
//   res.send("Welcome to Express & TypeScript Server");
// });

// const port = process.env.PORT || 8000;
// app.listen(port, () => {
//   console.log(`Server is Fire at http://localhost:${port}`);
// });

RabbitMQClient.initialize();
