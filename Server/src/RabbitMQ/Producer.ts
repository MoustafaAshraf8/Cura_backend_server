import { Channel } from "amqplib";
import { randomUUID } from "crypto";
import { EventEmitter } from "events";
import { RabbitMQConfig } from "./RabbitMQConfig";
export class Producer {
  private channel: Channel;
  private replyQueueName: string;
  private eventEmitter: EventEmitter;
  private rabbitMQConfig: RabbitMQConfig;

  constructor(parameters: {
    channel: Channel;
    replyQueueName: string;
    eventEmitter: EventEmitter;
    rabbitMQConfig: RabbitMQConfig;
  }) {
    this.channel = parameters.channel;
    this.replyQueueName = parameters.replyQueueName;
    this.eventEmitter = parameters.eventEmitter;
    this.rabbitMQConfig = parameters.rabbitMQConfig;
  }

  async produceMessage(parameters: { data: any }) {
    const uuid = randomUUID();
    this.channel.sendToQueue(
      this.rabbitMQConfig.getMainQueue(),
      Buffer.from(JSON.stringify(parameters.data)),
      {
        replyTo: this.replyQueueName,
        correlationId: uuid,
        expiration: 10, // after 10 seconds message will expire and no longer on the queue
        headers: {
          timeslot_id: parameters.data.timeslot_id,
        },
      },
    );

    return new Promise((resolve, reject) => {
      this.eventEmitter.once(uuid, async (data) => {
        const result = JSON.parse(data.content.toString());
        resolve(result);
      });
    });
  }
}
