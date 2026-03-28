import { Channel, ConsumeMessage } from "amqplib";
import { MessageHandler } from "../utility/MessageHandler";
import { EventEmitter } from "events";

export class Consumer {
  private channel: Channel;
  private rpcQueueName: string;

  constructor(parameters: { channel: Channel; rpcQueueName: string }) {
    this.channel = parameters.channel;
    this.rpcQueueName = parameters.rpcQueueName;
  }

  async consumeMessage() {
    console.log("BookingService consuming...");
    this.channel.consume(
      this.rpcQueueName,
      async (message: ConsumeMessage | null) => {
        const { correlationId, replyTo } = message!.properties;
        const operation: string = message?.properties.headers!.function;
        const messageContent = JSON.parse(message!.content.toString());
        console.log(
          `BookingService received message, correlationId: ${correlationId}`
        );

        if (!correlationId || !replyTo) {
          console.log("missing some properties...");
        } else {
          await MessageHandler.handle({
            operation: operation,
            data: messageContent,
            correlationId: correlationId,
            replyToQueue: replyTo,
          });
        }
      },
      {
        noAck: true,
      }
    );
  }
}
