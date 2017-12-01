"use strict";

const { equals, pickAll, pipe } = require("ramda");
const { camelizeKeys, underscore } = require("../utils");

const attrs = [
  "clientId",
  "redirectUri",
  "responseType",
  "scope",
  "state",
];

const attrsFromSession = pickAll(attrs);
const attrsFromQuery = pipe(pickAll(attrs.map(underscore)), camelizeKeys);

module.exports = () => (req, res, next) => {
  const { logger } = req;
  const requestParams = attrsFromQuery(req.query);
  const sessionParams = attrsFromSession(req.session.authorizationGrant);

  if (!equals(requestParams, sessionParams)) {
    logger.error(
      "Session vs query authorization grant params does not match.",
      "Session",
      sessionParams,
      "Query string",
      requestParams,
    );

    // TODO: better error model
    const error = new Error("Unauthorized");
    error.status = 403;
    return next(error);
  }

  next();
};
