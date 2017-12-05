"use strict";

const bcrypt = require("bcrypt");
const { pickAll } = require("ramda");

module.exports = pickAll([
  "id",
  "createdAt",
  "grants",
  "name",
  "redirectUris",
  "secret",
  "updatedAt",
]);

const generateSecret = (plain, rounds = 10) => bcrypt.hash(plain, rounds);
module.exports.generateSecret = generateSecret;

const isValidSecret = ({ guess, hash }) => bcrypt.compare(guess, hash);
module.exports.isValidSecret = isValidSecret;
