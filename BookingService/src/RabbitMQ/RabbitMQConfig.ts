export class RabbitMQConfig {
  private Host: string;
  private MainQueue: string;

  constructor() {
    this.Host = process.env.RABBITMQ_HOST as string;
    this.MainQueue = process.env.RABBITMQ_MAINQUEUE as string;
  }

  public getHost() {
    return this.Host;
  }

  public getRabbitMQurl(): string {
    return `amqp://${this.Host}`;
  }

  public getMainQueue(): string {
    return this.MainQueue;
  }
}
