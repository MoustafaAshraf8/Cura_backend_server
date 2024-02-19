"use strict";

const { DataTypes } = require("sequelize");

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable("patient", {
      patient_id: {
        primaryKey: true,
        autoIncrement: true,
        allowNull: false,
        //   onDelete: "cascade",
        //   onUpdate: "cascade",
        type: Sequelize.INTEGER,
      },
      FirstName: {
        type: Sequelize.STRING,
      },
      LastName: {
        type: Sequelize.STRING,
      },
      Email: {
        type: Sequelize.STRING,
        // unique: true,
        allowNull: false,
        //   validate: {
        //     isEmail: true,
        //   },
      },
      Password: {
        type: Sequelize.STRING,
      },
      Gender: {
        allowNull: false,
        defaultValue: "male",
        type: DataTypes.ENUM({
          values: ["male", "female"],
        }),
      },
      DOB: {
        allowNull: true,
        default: null,
        type: DataTypes.DATE,
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
    await queryInterface.dropTable("patient");
  },
};
