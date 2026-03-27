import dotenv from "dotenv";
import RabbitMQClient from "./RabbitMQ/RabbitMQClient";

dotenv.config();
const operateService = async () => {
  try {
    await RabbitMQClient.initialize();
    console.log("MailingAndNotificationService consuming...");
  } catch (error) {
    console.log(error);
    operateService();
  }
};

operateService();
