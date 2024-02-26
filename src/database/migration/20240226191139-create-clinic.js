"use strict";
/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable("clinic", {
      clinic_id: {
        primaryKey: true,
        autoIncrement: true,
        type: Sequelize.INTEGER,
      },
      doctor_id: {
        references: {
          model: {
            tableName: "doctor",
          },
          key: "doctor_id",
        },
        type: Sequelize.INTEGER,
      },
      Name: {
        allowNull: false,
        type: Sequelize.STRING,
      },
      Address: {
        allowNull: true,
        defaultValue: null,
        type: Sequelize.STRING,
      },
      Fee: {
        allowNull: false,
        defaultValue: 10,
        type: Sequelize.INTEGER,
      },
      Rating: {
        allowNull: false,
        defaultValue: 0,
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
    await queryInterface.dropTable("clinic");
  },
};
