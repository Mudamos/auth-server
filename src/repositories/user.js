"use strict";

const tables = require("../tables");
const { User } = require("../models");

const { rejectIfFalsy } = require("../utils");

const {
  always,
} = require("ramda");

const deserializeUser = user => User({
  id: user.id ? String(user.id) : null,
  createdAt: user.createdAt,
  email: user.email,
  name: user.name,
  password: user.password,
  updatedAt: user.updatedAt,
});

const create = ({ usersTable }) => ({
  email,
  name,
  password,
  transaction,
}) =>
  usersTable
    .create({
      email,
      name,
      password,
    }, { transaction })
    .then(deserializeUser);

const findById = ({ usersTable }) => id =>
  usersTable
    .findById(id)
    .then(rejectIfFalsy())
    .then(deserializeUser);

const findByEmail = ({ usersTable }) => email =>
  usersTable
    .findOne({ where: { email }})
    .then(rejectIfFalsy())
    .then(deserializeUser);

const existsByEmail = tables => email =>
  findByEmail(tables)(email)
    .then(always(true))
    .catch(e => e.message === "Not found" ? false : Promise.reject(e));

module.exports = sequelize => {
  return {
    create: create(tables(sequelize)),
    findById: findById(tables(sequelize)),
    findByEmail: findByEmail(tables(sequelize)),
    existsByEmail: existsByEmail(tables(sequelize)),
  };
};
