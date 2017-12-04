"use strict";

const tables = require("../tables");
const { AuthorizationCode } = require("../models");
const { deserializeClient } = require("./client");
const { deserializeUser } = require("./user");

const { rejectIfFalsy } = require("../utils");

const deserializeAuthorizationCode = code => AuthorizationCode({
  id: code.id ? String(code.id) : null,
  client: code.client ? deserializeClient(code.client) : null,
  user: code.user ? deserializeUser(code.user) : null,
  code: code.code,
  createdAt: code.createdAt,
  expiresAt: code.expiresAt,
  redirectUri: code.redirectUri,
  scopes: code.scopes,
  updatedAt: code.updatedAt,
});

const create = ({ authorizationCodesTable }) => ({
  client,
  user,
  code,
  expiresAt,
  redirectUri,
  scopes,
  transaction,
}) =>
  authorizationCodesTable
    .create({
      clientId: client.id,
      userId: user.id,
      code,
      expiresAt,
      redirectUri,
      scopes,
    }, { transaction })
    .then(deserializeAuthorizationCode)
    .then(code => ({ ...code, client, user }));

const findById = ({ authorizationCodesTable, clientsTable, usersTable }) => id =>
  authorizationCodesTable
    .findOne({
      where: { id },
      include: [
        { model: clientsTable },
        { model: usersTable },
      ],
    })
    .then(rejectIfFalsy())
    .then(deserializeAuthorizationCode);

const hasAllowed = ({ authorizationCodesTable }) => ({ clientId, scopes, userId }) => {
  const { Op } = authorizationCodesTable.sequelize;

  return authorizationCodesTable
    .findOne({
      where: {
        clientId,
        userId,
        scopes: {
          [Op.contains]: scopes,
        },
      },
    })
    .then(authCode => !!authCode);
};

module.exports = sequelize => {
  return {
    create: create(tables(sequelize)),
    findById: findById(tables(sequelize)),
    hasAllowed: hasAllowed(tables(sequelize)),
  };
};
