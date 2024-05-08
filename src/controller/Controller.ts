import { Repository } from "../repository/Repository";
import { Service } from "../service/Service";

export abstract class Controller {
  public service: Service;

  constructor(service: Service) {
    this.service = service;
  }
}
