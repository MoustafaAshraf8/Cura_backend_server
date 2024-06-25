// amqp (Advanced Message Queuing Protocol)

import { Channel, Connection, connect } from "amqplib";
import { Consumer } from "./Consumer";
import { Producer } from "./Producer";
import { BookingServiceRabbitMQConfig } from "./BookingServiceRabbitMQConfig";
import { EventEmitter } from "events";
import { randomUUID } from "crypto";

// singelton
class BookingServiceRabbitMQClient {
  private static instance: BookingServiceRabbitMQClient;
  private isInitialized = false;

  private producer: Producer;
  private consumer: Consumer;
  private connection: Connection;
  private producerChannel: Channel;
  private consumerChannel: Channel;

  private eventEmitter: EventEmitter;

  private constructor() {}

  public static getInstance() {
    if (!this.instance) {
      this.instance = new BookingServiceRabbitMQClient();
    }
    return this.instance;
  }

  async initialize() {
    if (this.isInitialized) {
      return;
    }

    try {
      const rabbitMQConfig: BookingServiceRabbitMQConfig =
        new BookingServiceRabbitMQConfig();
      const uniqueUUID: string = randomUUID();
      this.eventEmitter = new EventEmitter();

      this.connection = await connect(rabbitMQConfig.getRabbitMQurl());
      this.producerChannel = await this.connection.createChannel();
      this.consumerChannel = await this.connection.createChannel();

      console.log(`client_queueName: ${uniqueUUID}`);
      const { queue: replyQueueName } = await this.consumerChannel.assertQueue(
        uniqueUUID.toString(),
        {
          exclusive: true, // when connection is off the channel is deleted
        }
      );

      this.consumer = new Consumer({
        channel: this.consumerChannel,
        replyQueueName: replyQueueName,
        eventEmitter: this.eventEmitter,
      });
      this.producer = new Producer({
        channel: this.producerChannel,
        replyQueueName: replyQueueName,
        eventEmitter: this.eventEmitter,
      });

      this.consumer.consumeMessage();
      this.isInitialized = true;
    } catch (error) {
      console.error(error);
    }
  }

  async produce(parameters: { data: any }) {
    if (!this.isInitialized) {
      await this.initialize();
    }
    return await this.producer.produceMessage({ data: parameters.data });
  }

  //   async produce(parameters: { data: any }) {
  //     if (!this.isInitialized) {
  //       await this.initialize();
  //     }
  //     return await this.producer.produceMessage({ data: parameters.data });
  //   }
}

export default BookingServiceRabbitMQClient.getInstance();
