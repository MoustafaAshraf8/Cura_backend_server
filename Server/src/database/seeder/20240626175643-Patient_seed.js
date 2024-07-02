"use strict";

const fs = require("fs");
const path = require("path");
const dotenv = require("dotenv");
const dataArray = require("./Patient_seed_data");
/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    var dataArray = JSON.parse(
      fs.readFileSync(
        path.resolve(__dirname, "Patient_seed_data.json"),
        "utf-8"
      )
    );
    return queryInterface.bulkInsert("patient", dataArray);
  },

  async down(queryInterface, Sequelize) {
    return queryInterface.bulkDelete("patient", null, {});
  },
};
