import { RabbitMQConfig } from "./RabbitMQConfig";

export class BookingServiceRabbitMQConfig extends RabbitMQConfig {
  private MainQueue: string;

  constructor() {
    super();
    this.MainQueue = process.env.BOOKINGSERVICE_RABBITMQ_MAINQUEUE as string;
  }

  public getMainQueue(): string {
    return this.MainQueue;
  }
}
