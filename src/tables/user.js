"use strict";

const Sequelize = require("sequelize");

module.exports = sequelize =>
  sequelize.define("user", {
    id: {
      type: Sequelize.INTEGER,
      autoIncrement: true,
      primaryKey: true,
    },
    email: {
      type: Sequelize.STRING,
    },
    name: {
      type: Sequelize.STRING,
    },
    password: {
      type: Sequelize.STRING,
    },
  }, {
    tableName: "users",
    timestamps: true,
  });
