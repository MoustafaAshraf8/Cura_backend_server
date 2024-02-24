"use strict";
/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable("emr", {
      emr_id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER,
      },
      patient_id: {
        references: {
          model: {
            tableName: "patient",
          },
          key: "patient_id",
        },
        primaryKey: true,
        onDelete: "cascade",
        onUpdate: "cascade",
        type: Sequelize.INTEGER,
      },
      desease_id: {
        references: {
          model: {
            tableName: "desease",
          },
          key: "desease_id",
        },
        primaryKey: true,
        onDelete: "cascade",
        onUpdate: "cascade",
        type: Sequelize.INTEGER,
      },
      surgery_id: {
        references: {
          model: {
            tableName: "surgery",
          },
          key: "surgery_id",
        },
        primaryKey: true,
        onDelete: "cascade",
        onUpdate: "cascade",
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
    await queryInterface.dropTable("emr");
  },
};
