"use strict";

const { mergeAll } = require("ramda");

module.exports = mergeAll([
  require("./auth"),
  require("./user"),
]);
