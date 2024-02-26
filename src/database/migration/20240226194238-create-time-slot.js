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
      clinic_id: {
        references: {
          model: {
            tableName: "clinic",
          },
          key: "clinic_id",
        },
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
        type: Sequelize.INTEGER,
      },
      time: {
        allowNull: false,
        type: Sequelize.DATE,
      },
      available: {
        defaultValue: true,
        type: Sequelize.BOOLEAN,
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
