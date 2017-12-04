"use strict";

const { pickAll } = require("ramda");

module.exports = pickAll([
  "id",
  "client",
  "user",
  "code",
  "createdAt",
  "expiresAt",
  "redirectUri",
  "scopes",
  "updatedAt",
]);
