"use strict";
import { InferAttributes, InferCreationAttributes, Model } from "sequelize";
module.exports = (sequelize: any, DataTypes: any) => {
  class EMR extends Model<InferAttributes<EMR>, InferCreationAttributes<EMR>> {
    declare emr_id: number;
    static associate(models: any) {
      EMR.belongsTo(models.Patient, {
        foreignKey: "patient_id",
        as: "patient",
        onDelete: "cascade",
        onUpdate: "cascade",
      });
    }
  }
  EMR.init(
    {
      emr_id: {
        primaryKey: true,
        autoIncrement: true,
        type: DataTypes.INTEGER,
      },
    },
    {
      sequelize,
      tableName: "emr",
      modelName: "EMR",
    }
  );
  return EMR;
};
