"use strict";
import { Model, InferAttributes, InferCreationAttributes } from "sequelize";
import { Hasher } from "../utility/Hasher";
import { JWT } from "../utility/JWT";

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

      Patient.hasMany(models.PatientPhoneNumber, {
        foreignKey: "patient_id",
        as: "patientphonenumber",
      });

      Patient.hasMany(models.TimeSlot, {
        foreignKey: "patient_id",
        as: "timeslot",
      });
    }
  }
  Patient.init(
    {
      patient_id: {
        primaryKey: true,
        autoIncrement: true,
        type: DataTypes.INTEGER,
      },
      FirstName: {
        type: DataTypes.STRING,
      },
      LastName: {
        type: DataTypes.STRING,
      },
      Email: {
        allowNull: false,
        unique: true,
        //   validate: {
        //     isEmail: true,
        //   },
        type: DataTypes.STRING,
      },
      Password: {
        allowNull: false,
        async set(value: string) {
          // Storing passwords in plaintext in the database is terrible.
          // Hashing the value with an appropriate cryptographic hash function is better.
          //  const hashed = await Hasher.hashPassword(value);
          //  console.log(hashed);
          this.setDataValue("Password", value);
        },
        type: DataTypes.STRING,
      },
      Gender: {
        defaultValue: "male",
        type: DataTypes.STRING,
      },
      DOB: {
        allowNull: true,
        defaultValue: null,
        type: DataTypes.DATE,
      },
    },
    {
      // hooks: {
      //   afterCreate: async (record, options) => {
      //     delete record.dataValues.Password;
      //   },
      // },
      sequelize,
      timestamps: false,
      modelName: "Patient",
      tableName: "patient",
    }
  );

  Patient.beforeCreate(async (patient) => {
    patient.Password = await Hasher.hashPassword(patient.Password);
  });

  return Patient;
};
