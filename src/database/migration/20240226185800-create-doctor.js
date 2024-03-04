"use strict";
/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable("doctor", {
      doctor_id: {
        field: "doctor_id",
        primaryKey: true,
        autoIncrement: true,
        allowNull: false,
        type: Sequelize.INTEGER,
      },
      FirstName: {
        field: "FirstName",
        type: Sequelize.STRING,
      },
      LastName: {
        field: "LastName",
        type: Sequelize.STRING,
      },
      Email: {
        field: "Email",
        type: Sequelize.STRING,
        // unique: true,
        allowNull: false,
        //   validate: {
        //     isEmail: true,
        //   },
      },
      Password: {
        field: "Password",
        type: Sequelize.STRING,
      },
      Gender: {
        field: "Gender",
        allowNull: false,
        defaultValue: "male",
        type: Sequelize.ENUM({
          values: ["male", "female"],
        }),
      },
      DOB: {
        field: "DOB",
        allowNull: true,
        default: null,
        type: Sequelize.DATE,
      },
      speciality_id: {
        references: {
          model: {
            tableName: "speciality",
          },
          key: "speciality_id",
        },
        onDelete: "CASCADE",
        onUpdate: "CASCADE",
        allowNull: false,
        type: Sequelize.INTEGER,
      },
      Approved: {
        defaultValue: false,
        type: Sequelize.BOOLEAN,
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
    await queryInterface.dropTable("doctor");
  },
};
