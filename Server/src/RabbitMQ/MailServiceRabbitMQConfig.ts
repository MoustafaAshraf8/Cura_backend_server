import { RabbitMQConfig } from "./RabbitMQConfig";

export class MAilServiceRabbitMQConfig extends RabbitMQConfig {
  private MainQueue: string;

  constructor() {
    super();
    this.MainQueue = process.env.MAILSERVICE_RABBITMQ_MAINQUEUE as string;
  }

  public getMainQueue(): string {
    return this.MainQueue;
  }
}
