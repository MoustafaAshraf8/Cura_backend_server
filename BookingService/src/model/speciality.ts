"use strict";
import { Model, InferAttributes, InferCreationAttributes } from "sequelize";
module.exports = (sequelize: any, DataTypes: any) => {
  class Speciality extends Model<
    InferAttributes<Speciality>,
    InferCreationAttributes<Speciality>
  > {
    declare speciality_id: number;
    declare Name: string;
    static associate(models: any) {
      Speciality.hasMany(models.Doctor, {
        foreignKey: "speciality_id",
        as: "doctor",
      });
    }
  }
  Speciality.init(
    {
      speciality_id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: DataTypes.INTEGER,
      },
      Name: {
        allowNull: false,
        type: DataTypes.STRING,
      },
    },
    {
      sequelize,
      timestamps: false,
      modelName: "Speciality",
      tableName: "speciality",
    }
  );
  return Speciality;
};
