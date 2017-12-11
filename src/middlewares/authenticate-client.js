"use strict";

const basicAuth = require("basic-auth");

const {
  isValidSecret,
} = require("../models/client");

const unauthorizedResponse = res => () => {
  res.set("WWW-Authenticate", 'Basic realm="Protected resource", charset="UTF-8"');
  res.status(401).json({
    error: "invalid_client",
    error_description: "Invalid client",
  });
};

module.exports = ({ clientRepository }) => async (req, res, next) => {
  const unauthorized = unauthorizedResponse(res);
  const credentials = basicAuth.parse(req.get("Authorization"));

  if (!credentials) return unauthorized();

  try {
    const client = await clientRepository.findById(credentials.name)
      .catch(e => e.message === "Not found" ? null : Promise.reject(e));

    if (!client) {
      return unauthorized();
    }

    const isValid = await isValidSecret({ guess: credentials.pass, hash: client.secret });
    if (!isValid) return unauthorized();

    req.client = client;
  } catch (e) {
    return next(e);
  }

  next();
};
