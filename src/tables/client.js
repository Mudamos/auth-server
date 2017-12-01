"use strict";

const Sequelize = require("sequelize");

module.exports = sequelize =>
  sequelize.define("client", {
    id: {
      type: Sequelize.INTEGER,
      autoIncrement: true,
      primaryKey: true,
    },
    grants: {
      type: Sequelize.ARRAY(Sequelize.STRING),
    },
    name: {
      type: Sequelize.STRING,
    },
    redirectUris: {
      type: Sequelize.ARRAY(Sequelize.STRING),
    },
    secret: {
      type: Sequelize.STRING,
    },
  }, {
    tableName: "clients",
    timestamps: true,
  });
