"use strict";

const tables = require("../tables");
const { Client } = require("../models");

const { rejectIfFalsy } = require("../utils");

const deserializeClient = client => Client({
  id: client.id ? String(client.id) : null,
  createdAt: client.createdAt,
  grants: client.grants,
  name: client.name,
  redirectUris: client.redirectUris,
  secret: client.secret,
  updatedAt: client.updatedAt,
});

const create = ({ clientsTable }) => ({
  grants,
  name,
  redirectUris,
  secret,
  transaction,
}) =>
  clientsTable
    .create({
      grants,
      name,
      redirectUris,
      secret,
    }, { transaction })
    .then(deserializeClient);

const findById = ({ clientsTable }) => id =>
  clientsTable
    .findById(id)
    .then(rejectIfFalsy())
    .then(deserializeClient);

const findByIdAndSecret = ({ clientsTable }) => ({ id, secret }) =>
  clientsTable
    .findOne({ where: { id, secret }})
    .then(rejectIfFalsy())
    .then(deserializeClient);

module.exports = sequelize => {
  return {
    create: create(tables(sequelize)),
    findById: findById(tables(sequelize)),
    findByIdAndSecret: findByIdAndSecret(tables(sequelize)),
  };
};

module.exports.deserializeClient = deserializeClient;
