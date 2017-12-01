"use strict";

const cookieSession = require("cookie-session");

module.exports = ({ config }) =>
  cookieSession({
    name: "_authmudserv",
    keys: config("SESSION_SECRET_KEYS").split(","),
    maxAge: 24 * 60 * 60 * 1000, // 24 hours
    sameSite: true,
    httpOnly: true,
    signed: true,
  });
