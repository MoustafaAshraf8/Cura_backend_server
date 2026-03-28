import mongoose from "mongoose";
import { EMR } from "../mongo/model/EMR";
("use strict");

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
    Array(dataArray).map(async (element, index) => {
      const emr = await EMR.create({
        patient_id: index,
      });
    });
    return queryInterface.bulkInsert("patient", dataArray);
  },

  async down(queryInterface, Sequelize) {
    return queryInterface.bulkDelete("patient", null, {});
  },
};
