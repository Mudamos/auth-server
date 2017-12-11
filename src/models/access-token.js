"use strict";

const { pickAll } = require("ramda");

module.exports = pickAll([
  "id",
  "clientId",
  "userId",
  "createdAt",
  "refreshToken",
  "refreshTokenExpiresAt",
  "scopes",
  "token",
  "tokenExpiresAt",
  "updatedAt",
]);
