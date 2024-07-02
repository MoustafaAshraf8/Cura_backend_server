"use strict";

const fs = require("fs");
const path = require("path");
/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    var dataArray = JSON.parse(
      fs.readFileSync(
        path.resolve(__dirname, "Speciality_seed_data.json"),
        "utf-8"
      )
    );
    return queryInterface.bulkInsert("speciality", dataArray);
  },

  async down(queryInterface, Sequelize) {
    return queryInterface.bulkDelete("speciality", null, {});
  },
};