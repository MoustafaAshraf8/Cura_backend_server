"use strict";
import { Model, InferAttributes, InferCreationAttributes } from "sequelize";
module.exports = (sequelize: any, DataTypes: any) => {
  class Doctor extends Model<
    InferAttributes<Doctor>,
    InferCreationAttributes<Doctor>
  > {
    declare doctor_id: number;
    declare FirstName: string;
    declare LastName: string;
    declare Email: string;
    declare Password: string;
    declare Gender: string;
    declare DOB: Date;
    declare speciality_id: number;
    declare Rating: number;
    declare Experience: number;
    declare Approved: boolean;
    static associate(models: any) {
      Doctor.hasOne(models.Clinic, {
        foreignKey: "doctor_id",
        as: "clinic",
      });

      Doctor.belongsTo(models.Speciality, {
        foreignKey: "speciality_id",
        as: "speciality",
        targetKey: "speciality_id",
        onDelete: "CASCADE",
        onUpdate: "CASCADE",
      });
    }
  }
  Doctor.init(
    {
      doctor_id: {
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
        type: DataTypes.STRING,
      },
      Rating: {
        type: DataTypes.INTEGER,
        allowNull: false,
        defaultValue: 0,
      },
      Experience: {
        type: DataTypes.INTEGER,
        allowNull: false,
        defaultValue: 0,
      },
      speciality_id: {
        allowNull: false,
        type: DataTypes.INTEGER,
      },
      Approved: {
        defaultValue: false,
        type: DataTypes.BOOLEAN,
      },
    },
    {
      sequelize,
      timestamps: false,
      modelName: "Doctor",
      tableName: "doctor",
    }
  );
  return Doctor;
};
