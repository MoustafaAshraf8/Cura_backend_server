"use strict";
import { Model, InferAttributes, InferCreationAttributes } from "sequelize";
module.exports = (sequelize: any, DataTypes: any) => {
  class Desease extends Model<
    InferAttributes<Desease>,
    InferCreationAttributes<Desease>
  > {
    declare desease_id: number;
    declare emr_id: number;
    declare Diagnose: string;
    declare Note: string;
    static associate(models: any) {
      Desease.hasMany(models.Prescription, {
        foreignKey: "desease_id",
        as: "prescription",
      });
      Desease.belongsTo(models.EMR, {
        foreignKey: "desease_id",
        as: "emr",
        targetKey: "emr_id",
        onDelete: "CASCADE",
        onUpdate: "CASCADE",
      });
    }
  }
  Desease.init(
    {
      desease_id: {
        primaryKey: true,
        autoIncrement: true,
        type: DataTypes.INTEGER,
      },
      emr_id: {
        allowNull: false,
        type: DataTypes.INTEGER,
      },
      Diagnose: {
        allowNull: false,
        type: DataTypes.STRING,
      },
      Note: {
        allowNull: false,
        type: DataTypes.STRING,
      },
    },
    {
      sequelize,
      modelName: "Desease",
      tableName: "desease",
    }
  );
  return Desease;
};
