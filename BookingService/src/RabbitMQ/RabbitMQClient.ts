// amqp (Advanced Message Queuing Protocol)

import { Channel, Connection, connect } from "amqplib";
import { Consumer } from "./Consumer";
import { Producer } from "./Producer";
import { RabbitMQConfig } from "./RabbitMQConfig";

// singelton
class RabbitMQClient {
  private producer: Producer;
  private consumer: Consumer;
  private connection: Connection;
  private producerChannel: Channel;
  private consumerChannel: Channel;

  private static instance: RabbitMQClient;
  private isInitialized = false;

  private constructor() {}

  public static getInstance() {
    if (!this.instance) {
      this.instance = new RabbitMQClient();
    }
    return this.instance;
  }

  async initialize() {
    if (this.isInitialized) {
      return;
    }

    try {
      const rabbitMQConfig: RabbitMQConfig = new RabbitMQConfig();
      this.connection = await connect(rabbitMQConfig.getRabbitMQurl());
      this.producerChannel = await this.connection.createChannel();
      this.consumerChannel = await this.connection.createChannel();

      // assert (create queue that client will listen to)
      const assertQueueOptions = {
        exclusive: true, // when connection is off the channel is deleted
      };
      const { queue: rpcQueueName } = await this.consumerChannel.assertQueue(
        rabbitMQConfig.getMainQueue(),
        assertQueueOptions
      );

      this.consumer = new Consumer({
        channel: this.consumerChannel,
        rpcQueueName: rpcQueueName,
      });
      this.producer = new Producer({
        channel: this.producerChannel,
      });

      this.consumer.consumeMessage();
      this.isInitialized = true;
    } catch (error) {
      console.error(error);
    }
  }

  async produce(parameters: {
    data: any;
    correlationId: string;
    replyToQueue: string;
  }) {
    if (!this.isInitialized) {
      await this.initialize();
    }
    return await this.producer.produceMessage({
      data: parameters.data,
      correlationId: parameters.correlationId,
      replyToQueue: parameters.replyToQueue,
    });
  }
}

export default RabbitMQClient.getInstance();
