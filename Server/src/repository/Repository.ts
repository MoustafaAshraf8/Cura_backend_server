import { Model } from "sequelize-typescript";
export abstract class Repository {
  protected model: Model;

  constructor(model: Model) {
    this.model = model;
  }
}
