/*
import RabbitMQClient from "../RabbitMQ/RabbitMQClient";

export class MessageHandler {
  static async handle(parameters: {
    operation: string;
    data: any;
    correlationId: string;
    replyToQueue: string;
  }) {
    let response = {};
    const { num1, num2 } = parameters.data;
    console.log(`The operation is: ${parameters.operation}`);
    switch (parameters.operation.toLowerCase()) {
      case "multiply":
        response = num1 * num2;
        break;
      case "addition":
        response = num1 + num2;
        break;
      default:
        response = 0;
    }

    await RabbitMQClient.produce({
      data: response,
      correlationId: parameters.correlationId,
      replyToQueue: parameters.replyToQueue,
    });
  }
}

*/
import RabbitMQClient from "../RabbitMQ/RabbitMQClient";
import db from "../model";
export class MessageHandler {
  static async handle(parameters: {
    operation: string;
    data: any;
    correlationId: string;
    replyToQueue: string;
  }) {
    let response: any;

    try {
      // const timeSlotObj = await db.sequelize.transaction(async (t: any) => {
      //   const timeslot = await db.TimeSlot.findOne({
      //     where: {
      //       timeslot_id: parameters.data.timeslot_id,
      //     },
      //   });

      //   if (timeslot.patient_id != null) {
      //     throw new Error("cannot reserver");
      //   }

      //   await timeslot.update({ patient_id: parameters.data.patient_id });
      //   await timeslot.save();

      //   return timeslot.dataValues;
      // });
      const timeslot = await db.TimeSlot.update(
        {
          patient_id: parameters.data.patient_id,
        },
        {
          where: {
            timeslot_id: parameters.data.timeslot_id,
            patient_id: null,
          },
        }
      );

      if (timeslot[0] == 0) {
        throw new Error("cannot reserver");
      }

      response = timeslot;
    } catch (error) {
      console.log(error);
      response = null;
    }

    await RabbitMQClient.produce({
      data: response,
      correlationId: parameters.correlationId,
      replyToQueue: parameters.replyToQueue,
    });
  }
}
