import dotenv from "dotenv";
import RabbitMQClient from "./RabbitMQ/RabbitMQClient";
import db from "./model";

dotenv.config();

const operateService = async () => {
  await db.sequelize.authenticate();
  RabbitMQClient.initialize();
};

operateService();
