"use strict";

const Sequelize = require("sequelize");

module.exports = sequelize =>
  sequelize.define("accessToken", {
    id: {
      type: Sequelize.INTEGER,
      autoIncrement: true,
      primaryKey: true,
    },
    clientId: {
      type: Sequelize.INTEGER,
    },
    userId: {
      type: Sequelize.INTEGER,
    },
    refreshToken: {
      type: Sequelize.STRING,
    },
    refreshTokenExpiresAt:  {
      type: Sequelize.DATE,
    },
    scopes: {
      type: Sequelize.ARRAY(Sequelize.STRING),
    },
    token: {
      type: Sequelize.STRING,
    },
    tokenExpiresAt:  {
      type: Sequelize.DATE,
    },
  }, {
    tableName: "access_tokens",
    timestamps: true,
  });
