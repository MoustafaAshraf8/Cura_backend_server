import dotenv from "dotenv";
import RabbitMQClient from "./RabbitMQ/RabbitMQClient";

dotenv.config();
const operateService = async () => {
  try {
    await RabbitMQClient.initialize();
  } catch (error) {
    console.log(error);
    process.exit(0);
  }
};

operateService();
