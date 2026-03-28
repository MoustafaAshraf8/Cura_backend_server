import { Model } from "sequelize-typescript";

export class DAO {
  protected model: Model;

  constructor(model: Model) {
    this.model = model;
  }
}
