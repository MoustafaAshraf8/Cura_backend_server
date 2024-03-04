"use strict";
import { Model, InferAttributes, InferCreationAttributes } from "sequelize";
module.exports = (sequelize: any, DataTypes: any) => {
  class Schedule extends Model<
    InferAttributes<Schedule>,
    InferCreationAttributes<Schedule>
  > {
    declare schedule_id: number;
    declare clinic_id: number;
    declare Day: Enumerator<[1, 2, 3, 4, 5, 6, 7]>;
    declare Start: string;
    declare End: string;
    static associate(models: any) {
      // define association here
    }
  }
  Schedule.init(
    {
      schedule_id: {
        allowNull: true,
        autoIncrement: true,
        primaryKey: true,
        type: DataTypes.INTEGER,
      },
      clinic_id: {
        references: {
          model: {
            tableName: "clinic",
          },
          key: "clinic_id",
        },
        onDelete: "CASCADE",
        onUpdate: "CASCADE",
        type: DataTypes.INTEGER,
      },
      Day: {
        allowNull: true,
        defaultValue: 1,
        type: DataTypes.ENUM({
          values: [1, 2, 3, 4, 5, 6, 7],
        }),
      },
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
      tableName: "schedule",
      modelName: "Schedule",
    }
  );
  return Schedule;
};
