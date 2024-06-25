export class BookingServiceRabbitMQConfig {
  private Host: string;
  private MainQueue: string;

  constructor() {
    this.Host = process.env.RABBITMQ_HOST as string;
    this.MainQueue = process.env.BOOKINGSERVICE_RABBITMQ_MAINQUEUE as string;
  }

  public getRabbitMQurl(): string {
    return `amqp://${this.Host}`;
  }

  public getMainQueue(): string {
    return this.MainQueue;
  }
}
