"use strict";
import { Model, InferAttributes, InferCreationAttributes } from "sequelize";
module.exports = (sequelize: any, DataTypes: any) => {
  class Prescription extends Model<
    InferAttributes<Prescription>,
    InferCreationAttributes<Prescription>
  > {
    declare prescription_id: number;
    declare desease_id: number;
    declare Name: string;
    declare Dose: number;
    declare Frequency: number;

    static associate(models: any) {
      Prescription.belongsTo(models.Desease, {
        foreignKey: "desease_id",
        as: "desease",
        targetKey: "desease_id",
        onDelete: "CASCADE",
        onUpdate: "CASCADE",
      });
    }
  }
  Prescription.init(
    {
      prescription_id: {
        primaryKey: true,
        autoIncrement: true,
        type: DataTypes.INTEGER,
      },
      desease_id: {
        type: DataTypes.INTEGER,
      },
      Name: {
        allowNull: false,
        type: DataTypes.STRING,
      },
      Dose: {
        allowNull: false,
        type: DataTypes.INTEGER,
      },
      Frequency: {
        allowNull: false,
        defaultValue: 24,
        type: DataTypes.INTEGER,
      },
    },

    {
      sequelize,
      modelName: "Prescription",
      tableName: "prescription",
    }
  );
  return Prescription;
};
