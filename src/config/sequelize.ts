import { Sequelize } from "sequelize-typescript";

export const sequelize = new Sequelize({
  dialect: "mysql",
  host: "sql11.freesqldatabase.com",
  port: 3306,
  username: "sql11657210",
  password: process.env.DB_PASSWORD,
  database: "sql11657210",
  models: [__dirname + "/../models"],
});
