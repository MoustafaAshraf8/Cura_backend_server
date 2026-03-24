"use strict";
/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable("timeslot", {
      timeslot_id: {
        primaryKey: true,
        autoIncrement: true,
        type: Sequelize.INTEGER,
      },
      schedule_id: {
        references: {
          model: {
            tableName: "schedule",
          },
          key: "schedule_id",
        },
        onDelete: "CASCADE",
        onUpdate: "CASCADE",
        allowNull: false,
        type: Sequelize.INTEGER,
      },
      patient_id: {
        references: {
          model: {
            tableName: "patient",
          },
          key: "patient_id",
        },
        allowNull: true,
        defaultValue: null,
        onDelete: "SET NULL",
        onUpdate: "CASCADE",
        type: Sequelize.INTEGER,
      },
      doctor_id: {
        references: {
          model: {
            tableName: "doctor",
          },
          key: "doctor_id",
        },
        allowNull: false,
        onDelete: "CASCADE",
        onUpdate: "CASCADE",
        type: Sequelize.INTEGER,
      },
      Start: {
        allowNull: false,
        type: Sequelize.TIME,
      },
      End: {
        allowNull: false,
        type: Sequelize.TIME,
      },
      createdAt: {
        allowNull: false,
        type: Sequelize.DATE,
      },
      updatedAt: {
        allowNull: false,
        type: Sequelize.DATE,
      },
    });
  },
  async down(queryInterface, Sequelize) {
    await queryInterface.dropTable("timeslot");
  },
};
