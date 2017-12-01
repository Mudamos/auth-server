"use strict";

const winston = require("winston");

module.exports = config => new winston.Logger({
  transports: [
    new winston.transports.Console({
      colorize: config("LOG_COLOR_ENABLED"),
      level: config("LOG_LEVEL"),
      timestamp: true,
    }),
  ],
});
