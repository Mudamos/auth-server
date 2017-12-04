"use strict";

const express = require("express");

const {
  scopeOrDefault,
} = require("../../models/auth");

const {
  buildURL,
} = require("../../utils");

module.exports = ({
  authorizeClient,
  authorizationCodeRepository,
  csrf,
  ensureGrantDecisionWasNotTampered,
  ensureUserLoggedIn,
  fetchClient,
  sessionMiddleware,
  validateOAuthAuthorizationRequest,
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

  return app;
};
