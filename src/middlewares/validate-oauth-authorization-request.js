"use strict";

const {
  contains,
  flip,
} = require("ramda");

const { URL } = require("url");

const {
  isValidReponseType,
  isValidScope,
} = require("../models/auth");

const parseUri = uri => {
  if (!uri) throw new Error("Invalid uri");
  return new URL(uri);
};

const renderErrorResponse = res => attrs => res.render("auth/error", attrs);

module.exports = () => async (req, res, next) => {
  const renderError = renderErrorResponse(res);

  const {
    client_id: clientId,
    redirect_uri: redirectUri,
    response_type: responseType,
    scope,
    state,
  } = req.query;

  const { client } = req;

  if (!clientId) {
    return renderError({
      error: "invalid_request",
      error_description: "No client supplied",
    });
  }

  if (!isValidReponseType(responseType)) {
    return renderError({
      error: "unsupported_response_type",
      error_description: "Unsupported response type",
    });
  }

  let parsedUri;

  try {
    parsedUri = await parseUri(redirectUri);
  } catch (e) {
    return renderError({
      error: "invalid_request",
      error_description: "Invalid redirect uri",
    });
  }

  if (!client) {
    return renderError({
      error: "access_denied",
      error_description: "Client unavailable",
    });
  }

  const isValidUri = flip(contains)(client.redirectUris);
  if (!isValidUri(parsedUri.href)) {
    return renderError({
      error: "invalid_request",
      error_description: "Invalid redirect uri",
    });
  }

  if (!contains(responseType, client.grants)) {
    return renderError({
      error: "unauthorized_client",
      error_description: "Client is not authorized to request an authorization using this method",
    });
  }

  if (!isValidScope(scope)) {
    return renderError({
      error: "invalid_scope",
      error_description: "Invalid scope",
    });
  }

  req.oauth = {
    clientId,
    redirectUri: parsedUri,
    responseType,
    scope,
    state,
  };

  next();
};
