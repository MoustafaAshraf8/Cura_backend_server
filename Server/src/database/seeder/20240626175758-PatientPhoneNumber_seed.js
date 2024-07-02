"use strict";

const fs = require("fs");
const path = require("path");
/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    var dataArray = JSON.parse(
      fs.readFileSync(
        path.resolve(__dirname, "PatientPhoneNumber_seed_data.json"),
        "utf-8"
      )
    );

    return queryInterface.bulkInsert("patientphonenumber", dataArray);
  },

  async down(queryInterface, Sequelize) {
    return queryInterface.bulkDelete("patientphonenumber", null, {});
  },
};
