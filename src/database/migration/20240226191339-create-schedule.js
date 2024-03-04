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
        defaultValue: 1,
        type: Sequelize.ENUM("1", "2", "3", "4", "5", "6", "7"),
      },
      Start: {
        allowNull: false,
        type: Sequelize.TIME,
      },
      End: {
        allowNull: false,
        type: Sequelize.TIME,
      },
    });
  },
  async down(queryInterface, Sequelize) {
    await queryInterface.dropTable("schedule");
  },
};
