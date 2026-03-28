"use strict";
import { Model, InferAttributes, InferCreationAttributes } from "sequelize";
module.exports = (sequelize: any, DataTypes: any) => {
  class Surgery extends Model<
    InferAttributes<Surgery>,
    InferCreationAttributes<Surgery>
  > {
    declare surgery_id: number;
    declare emr_id: number;
    declare Name: string;
    static associate(models: any) {
      Surgery.belongsTo(models.EMR, {
        foreignKey: "surgery_id",
        as: "emr",
        targetKey: "emr_id",
        onDelete: "CASCADE",
        onUpdate: "CASCADE",
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
      emr_id: {
        allowNull: false,
        type: DataTypes.INTEGER,
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
