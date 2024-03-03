"use strict";
import { Model, InferAttributes, InferCreationAttributes } from "sequelize";
module.exports = (sequelize: any, DataTypes: any) => {
  class PatientPhoneNumber extends Model<
    InferAttributes<PatientPhoneNumber>,
    InferCreationAttributes<PatientPhoneNumber>
  > {
    // declare patientPhoneNumber_id: number;
    declare patient_id: number;
    declare PhoneNumber: number;
    static associate(models: any) {
      PatientPhoneNumber.belongsTo(models.Patient, {
        foreignKey: "patient_id",
        as: "patient",
        targetKey: "patient_id",
        onDelete: "CASCADE",
        onUpdate: "CASCADE",
      });
    }
  }
  PatientPhoneNumber.init(
    {
      // patientPhoneNumber_id: {
      //   primaryKey: true,
      //   autoIncrement: true,
      //   type: DataTypes.INTEGER,
      // },
      patient_id: {
        primaryKey: true,
        type: DataTypes.INTEGER,
      },
      PhoneNumber: {
        primaryKey: true,
        allowNull: false,
        type: DataTypes.INTEGER,
      },
    },
    {
      sequelize,
      timestamps: false,
      modelName: "PatientPhoneNumber",
      tableName: "patientphonenumber",
    }
  );
  return PatientPhoneNumber;
};
