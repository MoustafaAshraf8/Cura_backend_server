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
      // clinic_id: {
      //   references: {
      //     model: {
      //       tableName: "clinic",
      //     },
      //     key: "clinic_id",
      //   },
      //   onDelete: "CASCADE",
      //   onUpdate: "CASCADE",
      //   allowNull: false,
      //   type: Sequelize.INTEGER,
      // },
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
      // Date: {
      //   allowNull: false,
      //   type: Sequelize.DATEONLY,
      // },
      Start: {
        allowNull: false,
        type: Sequelize.TIME,
      },
      End: {
        allowNull: false,
        type: Sequelize.TIME,
      },
      // available: {
      //   allowNull: true,
      //   defaultValue: true,
      //   type: Sequelize.BOOLEAN,
      // },

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
    await queryInterface.dropTable("timeslot");
  },
};
