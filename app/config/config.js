/**
 * created by femibams on 13/09/2019
 */
require("dotenv").config();

const appName = "Workmobile";

const config = {
  appName,
  server: {
    url: process.env.APP_URL,
    port: process.env.PORT
  },
  mail: {
    send_grid: process.env.SENDGRID_API_KEY
  },
  nodemailer: {
    username: process.env.NODEMAILER_USERNAME,
    password: process.env.NODEMAILER_PASSWORD,
    host: "smtp.gmail.com",
    port: 465,
    secure: true
  },
  baseUrl: process.env.BASE_URL,
  mongo: {
    salt_value: 10,
    connection: {
      host: process.env.MONGODB_HOST,
      username: process.env.MONGODB_USER,
      password: process.env.MONGODB_PASSWORD,
      port: process.env.MONGODB_PORT,
      dbProd: process.env.MONGODB_DATABASE_NAME
    },
    collections: {
      users: "users",
      userscdp: "userscdp"
    },
    queryLimit: process.env.MONGODB_QUERY_LIMIT,
    questionLimit: process.env.QUESTION_LIMIT
  },

  mongoErrorCode: {
    duplicateId: 11000
  },
  logging: {
    level: process.env.LOG_LEVEL || "info",
    console: process.env.LOG_ENABLE_CONSOLE === "true"
  }
};

module.exports = config;
