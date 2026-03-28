export abstract class RabbitMQConfig {
  private Host: string;

  constructor() {
    this.Host = process.env.RABBITMQ_HOST as string;
  }

  public getRabbitMQurl(): string {
    return `amqp://${this.Host}`;
  }

  public abstract getMainQueue(): string;
}
