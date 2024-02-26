"use strict";
import { Model, InferAttributes, InferCreationAttributes } from "sequelize";
module.exports = (sequelize: any, DataTypes: any) => {
  class TimeSlot extends Model<
    InferAttributes<TimeSlot>,
    InferCreationAttributes<TimeSlot>
  > {
    declare timeslot_id: number;
    declare clinic_id: number;
    declare patient_id: number;
    declare time: Date;
    declare available: boolean;
    static associate(models: any) {
      // define association here
    }
  }
  TimeSlot.init(
    {
      timeslot_id: {
        primaryKey: true,
        autoIncrement: true,
        type: DataTypes.INTEGER,
      },
      clinic_id: {
        allowNull: false,
        type: DataTypes.INTEGER,
      },
      patient_id: {
        allowNull: false,
        type: DataTypes.INTEGER,
      },
      time: {
        allowNull: false,
        type: DataTypes.DATE,
      },
      available: {
        defaultValue: true,
        type: DataTypes.BOOLEAN,
      },
    },
    {
      sequelize,
      modelName: "TimeSlot",
      tableName: "timeslot",
    }
  );
  return TimeSlot;
};
