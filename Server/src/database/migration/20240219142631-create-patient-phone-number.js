"use strict";
/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable("patientphonenumber", {
      patient_id: {
        field: "patient_id",
        references: {
          model: {
            tableName: "patient",
          },
          key: "patient_id",
        },
        onDelete: "CASCADE",
        onUpdate: "CASCADE",
        allowNull: false,
        primaryKey: true,
        type: Sequelize.INTEGER,
      },
      PhoneNumber: {
        field: "PhoneNumber",
        allowNull: false,
        primaryKey: true,
        type: Sequelize.INTEGER,
      },
      // createdAt: {
      //   allowNull: false,
      //   type: Sequelize.DATE,
      // },
      // updatedAt: {
      //   allowNull: false,
      //   type: Sequelize.DATE,
      // },
    });
  },
  async down(queryInterface, Sequelize) {
    await queryInterface.dropTable("patientphonenumber");
  },
};
