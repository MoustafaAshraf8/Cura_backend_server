require("dotenv").config();
module.exports = {
  development: {
    username: process.env.DATABASE_DEV_USERNAME,
    password: process.env.DATABASE_DEV_PASSWORD,
    database: process.env.DATABASE_DEV_DATABASE,
    host: process.env.DATABASE_DEV_HOST,
    port: process.env.DATABASE_DEV_PORT,
    dialect: process.env.DATABASE_DEV_DIALECT,
  },
  test: {
    username: process.env.DATABASE_PROD_USERNAME,
    password: process.env.DATABASE_PROD_PASSWORD,
    database: process.env.DATABASE_PROD_DATABASE,
    host: process.env.DATABASE_PROD_HOST,
    dialect: process.env.DATABASE_PROD_DIALECT,
  },
  production: {
    username: process.env.DATABASE_TEST_USERNAME,
    password: process.env.DATABASE_TEST_PASSWORD,
    database: process.env.DATABASE_TEST_DATABASE,
    host: process.env.DATABASE_TEST_HOST,
    dialect: process.env.DATABASE_TEST_DIALECT,
  },
};
