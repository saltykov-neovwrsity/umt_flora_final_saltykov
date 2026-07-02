import { Sequelize } from "sequelize";
import dotenv from "dotenv";

dotenv.config();

const {
  DATABASE_URL,
  DB_HOST = "localhost",
  DB_PORT = 5432,
  DB_NAME = "flora",
  DB_USER = "postgres",
  DB_PASSWORD = "postgres",
  NODE_ENV
} = process.env;

let sequelize;

if (DATABASE_URL) {
  sequelize = new Sequelize(DATABASE_URL, {
    dialect: "postgres",
    dialectOptions: {
      ssl: {
        rejectUnauthorized: false
      }
    },
    logging: false
  });
} else {
  console.log("No DATABASE_URL provided. Falling back to local SQLite database...");
  sequelize = new Sequelize({
    dialect: "sqlite",
    storage: "./dev.sqlite",
    logging: false
  });
}

export default sequelize;
