"use strict";

const express = require("express");

module.exports = ({
  ensureUserLoggedIn,
  loginUser,
  sessionMiddleware,
}) => {
  const app = express.Router();

  app.use(sessionMiddleware);

  app.get("/login", (_req, res) => {
    res.render("auth/login");
  });

  app.post("/login", (req, res) => {
    const { email, password } = req.body;
    const shouldRedirect = !!req.session.returnTo;

    loginUser({ email, password })
      .then(user => {
        req.session.userId = user.id;

        // User is following a oauth grant
        if (shouldRedirect) {
          const { returnTo } = req.session;
          req.session.returnTo = null;
          res.redirect(returnTo);
        } else {
          res.redirect("success");
        }
      })
      .catch(e => {
        res.render("auth/login", {
          email,
          password,
          // TODO: Better validation
          error: e,
        });
      });
  });

  app.get("/success", ensureUserLoggedIn, (_req, res) => res.send("Logado com sucesso"));

  return app;
};
