"use strict";

const csrf = require("csurf");

module.exports = () => csrf({
  cookie: false,
});
