"use strict";
import { Model, InferAttributes, InferCreationAttributes } from "sequelize";
module.exports = (sequelize: any, DataTypes: any) => {
  class TimeSlot extends Model<
    InferAttributes<TimeSlot>,
    InferCreationAttributes<TimeSlot>
  > {
    declare timeslot_id: number;
    declare schedule_id: number;
    declare patient_id: number | null;
    // Date: 'YYYY-MM-DD'
    // Start/End: 'hh:mm:ss'
    //  declare Date: Date;
    declare Start: string;
    declare End: string;
    static associate(models: any) {
      // TimeSlot.belongsTo(models.Clinic, {
      //   foreignKey: "clinic_id",
      //   as: "clinic",
      //   targetKey: "clinic_id",
      // });

      TimeSlot.belongsTo(models.Schedule, {
        foreignKey: "schedule_id",
        as: "schedule",
        targetKey: "schedule_id",
        onDelete: "CASCADE",
        onUpdate: "CASCADE",
      });

      TimeSlot.belongsTo(models.Patient, {
        foreignKey: "patient_id",
        as: "patient",
        targetKey: "patient_id",
        onDelete: "SET NULL",
        onUpdate: "CASCADE",
      });
    }
  }
  TimeSlot.init(
    {
      timeslot_id: {
        primaryKey: true,
        autoIncrement: true,
        type: DataTypes.INTEGER,
      },
      schedule_id: {
        allowNull: false,
        type: DataTypes.INTEGER,
      },
      patient_id: {
        allowNull: true,
        defaultValue: null,
        type: DataTypes.INTEGER,
      },
      // Date: {
      //   allowNull: false,
      //   type: DataTypes.DATEONLY,
      // },
      Start: {
        allowNull: false,
        type: DataTypes.TIME,
      },
      End: {
        allowNull: false,
        type: DataTypes.TIME,
      },
    },
    {
      sequelize,
      timestamps: false,
      modelName: "TimeSlot",
      tableName: "timeslot",
    }
  );
  return TimeSlot;
};
