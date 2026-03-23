import { Channel } from "amqplib";
import { RabbitMQConfig } from "./RabbitMQConfig";
import { randomUUID } from "crypto";
export class Producer {
  private channel: Channel;

  constructor(parameters: { channel: Channel }) {
    this.channel = parameters.channel;
  }

  async produceMessage(parameters: {
    data: any;
    correlationId: string;
    replyToQueue: string;
  }) {
    console.log(`responding to correlationId: ${parameters.correlationId}`);
    this.channel.sendToQueue(
      parameters.replyToQueue,
      Buffer.from(JSON.stringify(parameters.data)),
      {
        correlationId: parameters.correlationId,
      }
    );
  }
}
