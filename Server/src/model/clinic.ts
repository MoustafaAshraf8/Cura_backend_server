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
    declare City: string;
    declare Longtitude: string;
    declare Latitude: string;
    declare Fee: string;
    declare PatientCount: number;
    static associate(models: any) {
      Clinic.belongsTo(models.Doctor, {
        foreignKey: "doctor_id",
        as: "doctor",
        targetKey: "doctor_id",
      });
      Clinic.hasMany(models.Schedule, {
        foreignKey: "clinic_id",
        as: "schedule",
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
      City: {
        allowNull: true,
        defaultValue: null,
        type: DataTypes.STRING,
      },
      Longtitude: {
        allowNull: true,
        defaultValue: null,
        type: DataTypes.STRING,
      },
      Latitude: {
        allowNull: true,
        defaultValue: null,
        type: DataTypes.STRING,
      },
      Fee: {
        allowNull: false,
        defaultValue: 10,
        type: DataTypes.STRING,
      },
      PatientCount: {
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
