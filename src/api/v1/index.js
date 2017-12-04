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
  csrf,
  ensureGrantDecisionWasNotTampered,
  ensureUserLoggedIn,
  fetchClient,
  sessionMiddleware,
  validateOAuthAuthorizationRequest,
}) => {
  const app = express.Router();

  app.get(
    "/authorize",
    sessionMiddleware,
    csrf,
    fetchClient,
    validateOAuthAuthorizationRequest,
    ensureUserLoggedIn,
    (req, res) => {
      const { client, user } = req;
      const { scope } = req.oauth;

      // TODO: implement this allowed flow
      const hasAllowedBefore = false;
      if (hasAllowedBefore) {
        res.send("allowed before");
      } else {
        // So we can validate if request was tampered after
        req.session.authorizationGrant = req.oauth;

        res.render("auth/decision", {
          client,
          scopes: scopeOrDefault(scope),
          user,
          csrfToken: req.csrfToken(),
        });
      }
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
      const { client, user } = req;
      const { redirectUri, scope, state } = req.oauth;
      const { decision } = req.body;
      const allowed = decision === "allow";

      if (!allowed) {
        return res.redirect(buildURL(redirectUri, {
          error: "access_denied",
          error_description: "User denied access",
        }));
      }

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
    }
  );

  return app;
};
