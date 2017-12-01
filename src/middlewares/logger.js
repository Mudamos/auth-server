"use strict";

module.exports = ({ logger = console } = {}) => (req, res, next) => {
  req.logger = logger;
  next();
};
