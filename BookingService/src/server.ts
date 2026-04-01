import dotenv from "dotenv";
import RabbitMQClient from "./RabbitMQ/RabbitMQClient";
import db from "./model";

dotenv.config();

function sleep(ms: number) {
  return new Promise((resolve) => {
    setTimeout(resolve, ms);
  });
}
async function connectToDB(tries: number) {
  console.log(`try -> ${tries}`);
  await sleep(5000);
  if (tries >= 3) {
    throw new Error("Cannot connect to DB!!");
  }
  try {
    await db.sequelize.authenticate();
  } catch (err) {
    console.log(err);
    connectToDB(tries++);
  }
}

const operateService = async () => {
  try {
    await connectToDB(1);
    await RabbitMQClient.initialize();
  } catch (error) {
    console.log(error);
    process.exit(0);
  }
};

operateService();
