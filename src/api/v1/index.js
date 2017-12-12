"use strict";

const express = require("express");
const moment = require("moment");

const {
  scopeOrDefault,
} = require("../../models/auth");

const {
  buildURL,
  dropNilValues,
} = require("../../utils");

module.exports = ({
  authenticateClient,
  authorizeClient,
  authorizationCodeRepository,
  createAccessToken,
  csrf,
  ensureGrantDecisionWasNotTampered,
  ensureUserLoggedIn,
  fetchClient,
  sessionMiddleware,
  validateOAuthAuthorizationRequest,
  validateOAuthTokenRequest,
}) => {
  const app = express.Router();

  const generateAuthorizationToken = (req, res, next) => {
    const { client, user } = req;
    const { redirectUri, scope, state } = req.oauth;

    authorizeClient({
      client,
      user,
      redirectUri: redirectUri.href,
      scope,
      state,
    })
      .then(authCode => buildURL(redirectUri, { code: authCode.code, state }).href)
      .then(uri => res.redirect(uri))
      .catch(next);
  };

  app.get(
    "/authorize",
    sessionMiddleware,
    csrf,
    fetchClient,
    validateOAuthAuthorizationRequest,
    ensureUserLoggedIn,
    (req, res, next) => {
      const { client, user } = req;
      const { scope } = req.oauth;
      const scopes = scopeOrDefault(scope);

      authorizationCodeRepository
        .hasAllowed({ clientId: client.id, userId: user.id, scopes })
        .then(allowed => {
          if (allowed) {
            generateAuthorizationToken(req, res, next);
          } else {
            // So we can validate if request was tampered after
            req.session.authorizationGrant = req.oauth;

            res.render("auth/decision", {
              client,
              scopes,
              user,
              csrfToken: req.csrfToken(),
            });
          }
        })
        .catch(next);
    }
  );

  app.post(
    "/authorize",
    sessionMiddleware,
    ensureUserLoggedIn,
    csrf,
    fetchClient,
    validateOAuthAuthorizationRequest,
    ensureGrantDecisionWasNotTampered,
    (req, res, next) => {
      const { redirectUri } = req.oauth;
      const { decision } = req.body;
      const allowed = decision === "allow";

      if (!allowed) {
        return res.redirect(buildURL(redirectUri, {
          error: "access_denied",
          error_description: "User denied access",
        }));
      }

      generateAuthorizationToken(req, res, next);
    }
  );

  app.post(
    "/token",
    authenticateClient,
    validateOAuthTokenRequest,
    (req, res, next) => {
      const { client } = req;
      const {
        authorizationCodeId,
        userId,
        scope,
        includeRefreshToken,
        previousAccessTokenId,
      } = req.oauth;

      const clientId = client.id;

      createAccessToken({
        clientId,
        userId,
        scope,
        includeRefreshToken,
        authorizationCodeId,
        previousAccessTokenId,
      })
        .then(accessToken => {
          const expiresIn = moment(accessToken.tokenExpiresAt).diff(moment(), "seconds");

          res.set("Cache-Control", "no-store");
          res.set("Pragma", "no-cache");

          res.json(dropNilValues({
            access_token: accessToken.token,
            expires_in: expiresIn,
            refresh_token: accessToken.refreshToken,
            scope: accessToken.scopes.join(" "),
            token_type: "Bearer",
          }));
        })
        .catch(next);
    }
  );

  return app;
};
