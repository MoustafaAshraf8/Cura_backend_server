"use strict";
import { Model, InferAttributes, InferCreationAttributes } from "sequelize";
module.exports = (sequelize: any, DataTypes: any) => {
  class PatientPhoneNumber extends Model<
    InferAttributes<PatientPhoneNumber>,
    InferCreationAttributes<PatientPhoneNumber>
  > {
    declare patientPhoneNumber_id: number;
    declare PhoneNumber: number;
    static associate(models: any) {
      PatientPhoneNumber.belongsTo(models.Patient, {
        foreignKey: "patient_id",
        as: "patient",
      });
    }
  }
  PatientPhoneNumber.init(
    {
      patientPhoneNumber_id: {
        primaryKey: true,
        autoIncrement: true,
        type: DataTypes.INTEGER,
      },
      PhoneNumber: {
        allowNull: false,
        type: DataTypes.INTEGER,
      },
    },
    {
      sequelize,
      modelName: "PatientPhoneNumber",
      tableName: "patientphonenumber",
    }
  );
  return PatientPhoneNumber;
};
