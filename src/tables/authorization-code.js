"use strict";

const Sequelize = require("sequelize");

module.exports = ({ sequelize, Client, User }) => {
  const AuthorizationCode = sequelize.define("authorizationCode", {
    id: {
      type: Sequelize.INTEGER,
      autoIncrement: true,
      primaryKey: true,
    },
    clientId: {
      type: Sequelize.INTEGER,
      references: {
        model: Client,
        key: "id",
      },
    },
    userId: {
      type: Sequelize.INTEGER,
      references: {
        model: User,
        key: "id",
      },
    },
    code: {
      type: Sequelize.STRING,
    },
    expiresAt:  {
      type: Sequelize.DATE,
    },
    redirectUri: {
      type: Sequelize.STRING,
    },
    scopes: {
      type: Sequelize.ARRAY(Sequelize.STRING),
    },
  }, {
    tableName: "authorization_codes",
    timestamps: true,
  });

  AuthorizationCode.belongsTo(Client);
  AuthorizationCode.belongsTo(User);

  return AuthorizationCode;
};
