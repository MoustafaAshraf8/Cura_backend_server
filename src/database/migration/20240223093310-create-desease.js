"use strict";
/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable("desease", {
      desease_id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER,
      },
      Diagnose: {
        allowNull: false,
        type: Sequelize.STRING,
      },
      // prescription_id:{
      //    references: {
      //       model: {
      //         tableName: "prescription",
      //       },
      //       key: "patient_id",
      //     },
      // }
      Note: {
        allowNull: false,
        type: Sequelize.STRING,
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
    await queryInterface.dropTable("desease");
  },
};
