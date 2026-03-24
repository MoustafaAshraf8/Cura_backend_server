import { Channel, ConsumeMessage } from "amqplib";
import { EventEmitter } from "events";
export class Consumer {
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

  async consumeMessage() {
    this.channel.consume(
      this.replyQueueName,
      (message: ConsumeMessage | null) => {
        this.eventEmitter.emit(
          message?.properties.correlationId.toString(),
          message,
        );
      },
      {
        noAck: true,
      },
    );
  }
}
