import { DataTypes } from "sequelize";
import sequelize from "./index.js";

const Bouquet = sequelize.define(
  "Bouquet",
  {
    id: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true
    },
    title: {
      type: DataTypes.STRING,
      allowNull: false
    },
    description: {
      type: DataTypes.TEXT,
      allowNull: false
    },
    price: {
      type: DataTypes.FLOAT,
      allowNull: false
    },
    photoURL: {
      type: DataTypes.STRING,
      allowNull: false
    },
    favorite: {
      type: DataTypes.BOOLEAN,
      defaultValue: false,
      allowNull: false
    }
  },
  {
    tableName: "bouquets",
    timestamps: true
  }
);

export default Bouquet;
