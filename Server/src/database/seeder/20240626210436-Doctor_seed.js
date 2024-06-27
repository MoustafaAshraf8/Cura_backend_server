"use strict";

const fs = require("fs");
const path = require("path");
/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    const b64toBlob = (b64Data, contentType = "", sliceSize = 512) => {
      const byteCharacters = atob(b64Data);
      const byteArrays = [];

      for (
        let offset = 0;
        offset < byteCharacters.length;
        offset += sliceSize
      ) {
        const slice = byteCharacters.slice(offset, offset + sliceSize);

        const byteNumbers = new Array(slice.length);
        for (let i = 0; i < slice.length; i++) {
          byteNumbers[i] = slice.charCodeAt(i);
        }

        const byteArray = new Uint8Array(byteNumbers);
        byteArrays.push(byteArray);
      }

      const blob = new Blob(byteArrays, { type: contentType });
      return blob;
    };

    var dataArray = JSON.parse(
      fs.readFileSync(path.resolve(__dirname, "Doctor_seed_data.json"), "utf-8")
    );

    var male_doctor_array = JSON.parse(
      fs.readFileSync(
        path.resolve(__dirname, "male_doctor_image.json"),
        "utf-8"
      )
    );

    var female_doctor_array = JSON.parse(
      fs.readFileSync(
        path.resolve(__dirname, "female_doctor_image.json"),
        "utf-8"
      )
    );
    //  dataArray = dataArray.map(async (e, index) => {
    //    if (e.Gender == "male") {
    //      const blob = b64toBlob(male_doctor_array[index % 2].image);
    //      e.Image = blob;
    //    } else {
    //      const blob = b64toBlob(female_doctor_array[index % 2].image);
    //      e.Image = blob;
    //    }
    //    return e;
    //  });
    return queryInterface.bulkInsert("Doctor", dataArray);
  },

  async down(queryInterface, Sequelize) {
    return queryInterface.bulkDelete("Doctor", null, {});
  },
};
