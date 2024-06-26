"use strict";
import { InferAttributes, InferCreationAttributes, Model } from "sequelize";
module.exports = (sequelize: any, DataTypes: any) => {
  class EMR extends Model<InferAttributes<EMR>, InferCreationAttributes<EMR>> {
    declare emr_id: number;
    declare patient_id: number;
    static associate(models: any) {
      EMR.belongsTo(models.Patient, {
        foreignKey: "patient_id",
        as: "patient",
        targetKey: "patient_id",
        onDelete: "CASCADE",
        onUpdate: "CASCADE",
      });
      EMR.hasMany(models.Desease, {
        foreignKey: "emr_id",
        as: "desease",
      });
      EMR.hasMany(models.Surgery, {
        foreignKey: "emr_id",
        as: "surgery",
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
      patient_id: {
        allowNull: false,
        type: DataTypes.INTEGER,
      },
    },
    {
      sequelize,
      timestamps: false,
      tableName: "emr",
      modelName: "EMR",
    }
  );
  return EMR;
};
