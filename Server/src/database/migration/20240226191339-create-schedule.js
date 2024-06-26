"use strict";
/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable("schedule", {
      schedule_id: {
        allowNull: true,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER,
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
        type: Sequelize.INTEGER,
      },
      Day: {
        allowNull: true,
        defaultValue: "saturday",
        type: Sequelize.ENUM(
          "saturday",
          "sunday",
          "monday",
          "tuesday",
          "wednesday",
          "thursday",
          "friday"
        ),
      },
      Date: {
        allowNull: false,
        type: Sequelize.DATEONLY,
      },
    });
  },
  async down(queryInterface, Sequelize) {
    await queryInterface.dropTable("schedule");
  },
};
