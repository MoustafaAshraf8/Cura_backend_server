"use strict";

const fs = require("fs");
const path = require("path");
const Sequelize = require("sequelize");
// const process = require('process');
const basename = path.basename(__filename);
const env = process.env.NODE_ENV || "development";
const config = require(__dirname + "/../database/config/config.js")[env];
const db: any = {};

// create connection instance
let sequelize: any;
const options = {
  define: {
    freezeTableName: true,
    // timestamps: false,
  },
};
if (config.use_env_variable) {
  sequelize = new Sequelize(process.env[config.use_env_variable], {
    ...config,
    ...options,
  });
} else {
  sequelize = new Sequelize(config.database, config.username, config.password, {
    ...config,
    ...options,
  });
}

// read models
fs.readdirSync(__dirname)
  .filter((file: any) => {
    return (
      file.indexOf(".") !== 0 &&
      file !== basename &&
      file.slice(-3) === ".ts" &&
      file.indexOf(".test.js") === -1
    );
  })
  .forEach((file: any) => {
    const model = require(path.join(__dirname, file))(
      sequelize,
      Sequelize.DataTypes
    );
    db[model.name] = model;
  });

// fs.readdirSync(__dirname).forEach((dir: any) => {
//   if (dir.slice(-3) !== ".ts") {
//     console.log(dir);
//     fs.readdirSync(__dirname + dir).filter((file: any) => {
//       return (
//         file.indexOf(".") !== 0 &&
//         file !== basename &&
//         file.slice(-3) === ".ts" &&
//         file.indexOf(".test.js") === -1
//       );
//     });
//   }
//   return;
//   // .forEach((file: any) => {
//   //    const model = require(path.join(__dirname, file))(
//   //      sequelize,
//   //      Sequelize.DataTypes
//   //    );
//   //    db[model.name] = model;
//   //  });
// });

Object.keys(db).forEach((modelName) => {
  if (db[modelName].associate) {
    db[modelName].associate(db);
  }
});

db.sequelize = sequelize;
db.Sequelize = Sequelize;

export default db;
