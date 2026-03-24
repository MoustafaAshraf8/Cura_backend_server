import { Channel, Connection, connect } from "amqplib";
import { Consumer } from "./Consumer";
import { Producer } from "./Producer";
import { EventEmitter } from "events";
import { randomUUID } from "crypto";
import { MAilServiceRabbitMQConfig } from "./MailServiceRabbitMQConfig";

class MailServiceRabbitMQClient {
  private static instance: MailServiceRabbitMQClient;
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
      this.instance = new MailServiceRabbitMQClient();
    }
    return this.instance;
  }

  async initialize() {
    if (this.isInitialized) {
      return;
    }

    try {
      const rabbitMQConfig: MAilServiceRabbitMQConfig =
        new MAilServiceRabbitMQConfig();
      const uniqueUUID: string = randomUUID();
      this.eventEmitter = new EventEmitter();

      this.connection = await connect(rabbitMQConfig.getRabbitMQurl()); // open connection
      this.producerChannel = await this.connection.createChannel(); // create channel (to produce on)
      this.consumerChannel = await this.connection.createChannel(); // create channel (to listen to)

      const { queue: replyQueueName } = await this.consumerChannel.assertQueue(
        uniqueUUID.toString(),
        {
          exclusive: true,
        },
      ); // create queue inside the consume channel

      this.consumer = new Consumer({
        channel: this.consumerChannel,
        replyQueueName: replyQueueName,
        eventEmitter: this.eventEmitter,
      });
      this.producer = new Producer({
        channel: this.producerChannel,
        replyQueueName: replyQueueName,
        eventEmitter: this.eventEmitter,
        rabbitMQConfig: rabbitMQConfig,
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
}

export default MailServiceRabbitMQClient.getInstance();
