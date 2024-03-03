"use strict";
import { Model, InferAttributes, InferCreationAttributes } from "sequelize";
module.exports = (sequelize: any, DataTypes: any) => {
  class Clinic extends Model<
    InferAttributes<Clinic>,
    InferCreationAttributes<Clinic>
  > {
    declare clinic_id: number;
    declare doctor_id: number;
    declare Name: string;
    declare Address: string;
    declare Fee: number;
    declare Rating: number;
    static associate(models: any) {
      Clinic.belongsTo(models.Doctor, {
        foreignKey: "doctor_id",
        as: "doctor",
        targetKey: "doctor_id",
      });
    }
  }
  Clinic.init(
    {
      clinic_id: {
        primaryKey: true,
        autoIncrement: true,
        type: DataTypes.INTEGER,
      },
      doctor_id: {
        allowNull: false,
        type: DataTypes.INTEGER,
      },
      Name: {
        allowNull: false,
        type: DataTypes.STRING,
      },
      Address: {
        allowNull: true,
        defaultValue: null,
        type: DataTypes.STRING,
      },
      Fee: {
        allowNull: false,
        defaultValue: 10,
        type: DataTypes.INTEGER,
      },
      Rating: {
        allowNull: false,
        defaultValue: 0,
        type: DataTypes.INTEGER,
      },
    },
    {
      sequelize,
      timestamps: false,
      modelName: "Clinic",
      tableName: "clinic",
    }
  );
  return Clinic;
};
