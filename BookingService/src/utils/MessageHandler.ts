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
