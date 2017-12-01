"use strict";

const Sequelize = require("sequelize");
const options = require("./options");
const { log } = require("../services");

let singleton;

module.exports = config => {
  if (singleton) return singleton;

  const logger = log(config);

  if (config("NODE_ENV") === "development") {
    logger.info("[PID %d] Creating a db pool", process.pid);
  }

  singleton = new Sequelize(options(config));
  return singleton;
};

