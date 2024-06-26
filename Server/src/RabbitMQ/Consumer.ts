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
    console.log("Ready to consume message...");

    this.channel.consume(
      this.replyQueueName,
      (message: ConsumeMessage | null) => {
        console.log(
          "the reply is -> " + JSON.parse(message!.content.toString())
        );
        this.eventEmitter.emit(
          message?.properties.correlationId.toString(),
          message
        );
      },
      {
        noAck: true,
      }
    );
  }
}
