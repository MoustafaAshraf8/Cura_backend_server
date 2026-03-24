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
      const timeslot = await db.TimeSlot.findOne({
        where: { timeslot_id: parameters.data.timeslot_id },
      });

      if (timeslot) {
        timeslot.patient_id = parameters.data.patient_id;
        await timeslot.save();
      } else {
        throw new Error("timeslot not found");
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
