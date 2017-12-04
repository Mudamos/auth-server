"use strict";

const {
  contains,
  flip,
} = require("ramda");

const { buildURL } = require("../utils");

const {
  isValidReponseType,
  isValidScope,
} = require("../models/auth");

const parseUri = uri => {
  if (!uri) throw new Error("Invalid uri");
  return buildURL(uri);
};

const renderErrorResponse = res => attrs => res.render("auth/error", attrs);

const redirectWithResponse = res => (url, attrs = {}) =>
  res.redirect(buildURL(url, attrs).href);

module.exports = () => async (req, res, next) => {
  const renderError = renderErrorResponse(res);
  const redirect = redirectWithResponse(res);

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
    return redirect(parsedUri, {
      error: "invalid_request",
      error_description: "Invalid redirect uri",
    });
  }

  if (!isValidReponseType(responseType)) {
    return redirect(parsedUri, {
      error: "unsupported_response_type",
      error_description: "Unsupported response type",
    });
  }

  if (!contains(responseType, client.grants)) {
    return redirect(parsedUri, {
      error: "unauthorized_client",
      error_description: "Client is not authorized to request an authorization using this method",
    });
  }

  if (!isValidScope(scope)) {
    return redirect(parsedUri, {
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
