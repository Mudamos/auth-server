"use strict";

const bcrypt = require("bcrypt");
const { pickAll } = require("ramda");

module.exports = pickAll([
  "id",
  "createdAt",
  "email",
  "name",
  "password",
  "updatedAt",
]);

const generatePassword = (plain, rounds = 10) => bcrypt.hash(plain, rounds);
module.exports.generatePassword = generatePassword;

const isValidPassword = ({ guess, hash }) => bcrypt.compare(guess, hash);
module.exports.isValidPassword = isValidPassword;
