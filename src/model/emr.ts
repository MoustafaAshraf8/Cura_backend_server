"use strict";
import { InferAttributes, InferCreationAttributes, Model } from "sequelize";
module.exports = (sequelize: any, DataTypes: any) => {
  class EMR extends Model<InferAttributes<EMR>, InferCreationAttributes<EMR>> {
    declare emr_id: number;
    //  static associate(models: any) {
    //    EMR.belongsTo(models.Patient, {
    //      foreignKey: "patient_id",
    //      as: "patient",
    //      //   onDelete: "cascade",
    //      //   onUpdate: "cascade",
    //    });
    //  }
    declare patient_id: number;
    declare desease_id: number;
    declare surgery_id: number;
    static associate(models: any) {
      EMR.belongsTo(models.Patient, {
        foreignKey: "patient_id",
        as: "patient",
        targetKey: "patient_id",
      });
      EMR.belongsTo(models.Desease, {
        foreignKey: "desease_id",
        as: "desease",
        targetKey: "desease_id",
      });
      EMR.belongsTo(models.Surgery, {
        foreignKey: "surgery_id",
        as: "surgery",
        targetKey: "surgery_id",
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
      desease_id: {
        allowNull: false,
        type: DataTypes.INTEGER,
      },
      surgery_id: {
        allowNull: false,
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
