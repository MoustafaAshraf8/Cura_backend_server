"use strict";
import { Model, InferAttributes, InferCreationAttributes } from "sequelize";

module.exports = (sequelize: any, DataTypes: any) => {
  class Patient extends Model<
    InferAttributes<Patient>,
    InferCreationAttributes<Patient>
  > {
    declare patient_id: number;
    declare FirstName: string;
    declare LastName: string;
    declare Email: string;
    declare Password: string;
    declare Gender: string;
    declare DOB: Date;

    static associate(models: any) {
      Patient.hasOne(models.EMR, {
        foreignKey: "patient_id",
        as: "emr",
      });

      Patient.hasOne(models.PatientPhoneNumber, {
        foreignKey: "patient_id",
        as: "patientphonenumber",
      });
    }
  }
  Patient.init(
    {
      patient_id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true,
      },
      FirstName: {
        type: DataTypes.STRING,
      },
      LastName: {
        type: DataTypes.STRING,
      },
      Email: {
        type: DataTypes.STRING,
        allowNull: false,
        unique: true,
        //   validate: {
        //     isEmail: true,
        //   },
      },
      Password: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      Gender: {
        defaultValue: "male",
        type: DataTypes.STRING,
      },
      DOB: {
        allowNull: true,
        defaultValue: null,
        type: DataTypes.STRING,
      },
    },
    {
      sequelize,
      modelName: "Patient",
      tableName: "patient",
    }
  );
  return Patient;
};
