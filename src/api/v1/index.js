"use strict";

const express = require("express");

const {
  scopeOrDefault,
} = require("../../models/auth");

module.exports = ({
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
    (req, res) => {
      // TODO: everything is validated
      //console.log("query", req.query);
      //console.log("body", req.body);
      res.send("weeeeeeeeeeeeeeee");
    }
  );

  return app;
};
