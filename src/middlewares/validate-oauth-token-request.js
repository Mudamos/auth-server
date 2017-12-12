"use strict";

const {
  contains,
  equals,
} = require("ramda");

const moment = require("moment");

const {
  different,
} = require("../utils");

const {
  isValidGrantType,
  isValidScope,
} = require("../models/auth");

const isAuthorizationCode = equals("authorization_code");
const isPasswordCredentials = equals("password");
const isRefreshToken = equals("refresh_token");

const badRequest = res => ({ error, error_description }) =>
  res.status(400).json({
    error,
    error_description,
  });

module.exports = ({ accessTokenRepository, authorizationCodeRepository, loginUser }) => async (req, res, next) => {
  const errorResponse = badRequest(res);
  const {
    grant_type: grantType,
  } = req.body;

  req.oauth = {
    // All grant types here will generate a refreshToken
    includeRefreshToken: true,
  };

  const { client } = req;

  if (!isValidGrantType(grantType)) {
    return errorResponse({
      error: "unsupported_grant_type",
      error_description: "Grant type is unsupported",
    });
  }

  if (!contains(grantType, client.grants)) {
    return errorResponse({
      error: "unauthorized_client",
      error_description: "Unauthorized grant type",
    });
  }

  req.oauth.grantType = grantType;

  if (isAuthorizationCode(grantType)) {
    const { code, redirect_uri: redirectUri } = req.body;

    if (!code) {
      return errorResponse({
        error: "invalid_request",
        error_description: "Missing code",
      });
    }

    try {
      const authCode = await authorizationCodeRepository.findByCode(code);

      if (authCode.client.id !== client.id) {
        return errorResponse({
          error: "invalid_request",
          error_description: "Invalid client",
        });
      }

      const now = moment();
      if (now.isAfter(authCode.expiresAt)) {
        return errorResponse({
          error: "invalid_request",
          error_description: "Expired code",
        });
      }

      if (different(redirectUri, authCode.redirectUri)) {
        return errorResponse({
          error: "invalid_request",
          error_description: "Invalid redirect uri",
        });
      }

      req.oauth.authorizationCodeId = authCode.id;
      req.oauth.userId = authCode.user.id;
      req.oauth.scope = authCode.scopes.join(" ");
    } catch (e) {
      if (e.message === "Not found") {
        return errorResponse({
          error: "invalid_request",
          error_description: "Invalid code",
        });
      }

      return next(e);
    }
  } else if (isPasswordCredentials(grantType)) {
    const { username, password , scope } = req.body;

    try {
      const user = await loginUser({ email: username, password });
      req.oauth.userId = user.id;

    } catch(e) {
      if (e.message === "Not found") {
        return errorResponse({
          error: "invalid_request",
          error_description: "User authentication failed",
        });
      }

      return next(e);
    }

    if (!isValidScope(scope)) {
      return errorResponse({
        error: "invalid_scope",
        error_description: "Invalid scope",
      });
    }

    req.oauth.scope = scope;
  } else if (isRefreshToken(grantType)) {
    // Won't care about the scope sent
    // https://tools.ietf.org/html/rfc6749.html#section-6
    const { refresh_token: refreshToken } = req.body;

    if (!refreshToken) {
      return errorResponse({
        error: "invalid_request",
        error_description: "Invalid refresh token",
      });
    }

    try {
      const previousAccessToken = await accessTokenRepository.findByClientIdAndRefreshToken({ clientId: client.id, refreshToken });

      const now = moment();
      if (now.isAfter(previousAccessToken.refreshTokenExpiresAt)) {
        return errorResponse({
          error: "invalid_request",
          error_description: "Expired refresh token",
        });
      }

      req.oauth.previousAccessTokenId = previousAccessToken.id;
      req.oauth.userId = previousAccessToken.userId;
      req.oauth.scope = previousAccessToken.scopes.join(" ");
    } catch(e) {
      if (e.message === "Not found") {
        return errorResponse({
          error: "invalid_request",
          error_description: "Invalid refresh token",
        });
      }

      return next(e);
    }
  }

  next();
};
