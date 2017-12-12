"use strict";

const {
  always,
} = require("ramda");

const tables = require("../tables");
const { AccessToken } = require("../models");

const { rejectIfFalsy } = require("../utils");

const deserializeAccessToken = token => AccessToken({
  id: token.id ? String(token.id) : null,
  clientId: token.clientId ? String(token.clientId) : null,
  userId: token.userId ? String(token.userId) : null,
  createdAt: token.createdAt,
  refreshToken: token.refreshToken,
  refreshTokenExpiresAt: token.refreshTokenExpiresAt,
  scopes: token.scopes,
  token: token.token,
  tokenExpiresAt: token.tokenExpiresAt,
  updatedAt: token.updatedAt,
});

const create = ({ accessTokensTable }) => ({
  clientId,
  userId,
  refreshToken,
  refreshTokenExpiresAt,
  scopes,
  token,
  tokenExpiresAt,
  transaction,
}) =>
  accessTokensTable
    .create({
      clientId,
      userId,
      refreshToken,
      refreshTokenExpiresAt,
      scopes,
      token,
      tokenExpiresAt,
    }, { transaction })
    .then(deserializeAccessToken);

const findById = ({ accessTokensTable }) => id =>
  accessTokensTable
    .findById(id)
    .then(rejectIfFalsy())
    .then(deserializeAccessToken);

const findByToken = ({ accessTokensTable }) => token =>
  accessTokensTable
    .findOne({
      where: { token },
    })
    .then(rejectIfFalsy())
    .then(deserializeAccessToken);

const findByRefreshToken = ({ accessTokensTable }) => refreshToken =>
  accessTokensTable
    .findOne({
      where: { refreshToken },
    })
    .then(rejectIfFalsy())
    .then(deserializeAccessToken);

const findByClientIdAndRefreshToken = ({ accessTokensTable }) => ({ clientId, refreshToken }) =>
  accessTokensTable
    .findOne({
      where: { clientId, refreshToken },
    })
    .then(rejectIfFalsy())
    .then(deserializeAccessToken);

const removeById = ({ accessTokensTable }) => (id, { transaction } = {}) =>
  accessTokensTable
    .destroy({
      where: { id },
      transaction,
    })
    .then(always(true));

module.exports = sequelize => {
  return {
    create: create(tables(sequelize)),
    findById: findById(tables(sequelize)),
    findByRefreshToken: findByRefreshToken(tables(sequelize)),
    findByClientIdAndRefreshToken: findByClientIdAndRefreshToken(tables(sequelize)),
    findByToken: findByToken(tables(sequelize)),
    removeById: removeById(tables(sequelize)),
    transaction: (...args) => sequelize.transaction(...args),
  };
};
