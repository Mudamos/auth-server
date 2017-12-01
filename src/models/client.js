"use strict";

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
