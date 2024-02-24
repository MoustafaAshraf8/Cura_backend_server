"use strict";
import { Model, InferAttributes, InferCreationAttributes } from "sequelize";
module.exports = (sequelize: any, DataTypes: any) => {
  class Surgery extends Model<
    InferAttributes<Surgery>,
    InferCreationAttributes<Surgery>
  > {
    declare surgery_id: number;
    declare Name: string;
    static associate(models: any) {
      Surgery.hasOne(models.EMR, {
        foreignKey: "surgery_id",
        as: "emr",
      });
    }
  }

  Surgery.init(
    {
      surgery_id: {
        primaryKey: true,
        autoIncrement: true,
        type: DataTypes.STRING,
      },
      Name: {
        allowNull: false,
        type: DataTypes.STRING,
      },
    },
    {
      sequelize,
      modelName: "Surgery",
      tableName: "surgery",
    }
  );
  return Surgery;
};
