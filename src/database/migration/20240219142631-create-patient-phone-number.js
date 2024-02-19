"use strict";
/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable("patientphonenumber", {
      patientPhoneNumber_id: {
        primaryKey: true,
        autoIncrement: true,
        type: Sequelize.INTEGER,
      },

      patient_id: {
        references: {
          model: {
            tableName: "patient",
          },
          key: "patient_id",
        },
        // primaryKey: true,
        type: Sequelize.INTEGER,
      },

      PhoneNumber: {
        allowNull: false,
        // primaryKey: true,
        type: Sequelize.INTEGER,
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
    await queryInterface.dropTable("patientphonenumber");
  },
};
