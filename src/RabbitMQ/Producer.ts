import { Channel } from "amqplib";
import { BookingServiceRabbitMQConfig } from "./BookingServiceRabbitMQConfig";
import { randomUUID } from "crypto";
import { EventEmitter } from "events";
export class Producer {
  private channel: Channel;
  private replyQueueName: string;
  private eventEmitter: EventEmitter;

  constructor(parameters: {
    channel: Channel;
    replyQueueName: string;
    eventEmitter: EventEmitter;
  }) {
    this.channel = parameters.channel;
    this.replyQueueName = parameters.replyQueueName;
    this.eventEmitter = parameters.eventEmitter;
  }

  async produceMessage(parameters: { data: any }) {
    const uuid = randomUUID();
    console.log(`correlationID = ${uuid}`);
    const rabbitMQConfig: BookingServiceRabbitMQConfig =
      new BookingServiceRabbitMQConfig();
    console.log(
      `rabbitMQConfig.getMainQueue: ${rabbitMQConfig.getMainQueue()}`
    );
    this.channel.sendToQueue(
      rabbitMQConfig.getMainQueue(),
      Buffer.from(JSON.stringify(parameters.data)),
      {
        replyTo: this.replyQueueName,
        correlationId: uuid,
        expiration: 10, // after 10 seconds message will expire and no longer on the queue
        headers: {
          timeslot_id: parameters.data.timeslot_id,
        },
      }
    );

    return new Promise((resolve, reject) => {
      this.eventEmitter.once(uuid, async (data) => {
        const result = JSON.parse(data.content.toString());
        console.log(result);
        resolve(result);
      });
    });
  }

  /*
  async produceMessage(parameters: { data: any }) {
    const uuid = randomUUID();
    console.log(`correlationID = ${uuid}`);
    const rabbitMQConfig: BookingServiceRabbitMQConfig =
      new BookingServiceRabbitMQConfig();
    console.log(
      `rabbitMQConfig.getMainQueue: ${rabbitMQConfig.getMainQueue()}`
    );
    this.channel.sendToQueue(
      rabbitMQConfig.getMainQueue(),
      Buffer.from(JSON.stringify(parameters.data)),
      {
        replyTo: this.replyQueueName,
        correlationId: uuid,
        expiration: 10, // after 10 seconds message will expire and no longer on the queue
        headers: {
          function: parameters.data.operation,
        },
      }
    );

    return new Promise((resolve, reject) => {
      this.eventEmitter.once(uuid, async (data) => {
        const result = JSON.parse(data.content.toString());
        console.log(result);
        resolve(result);
      });
    });
  }
*/
}
