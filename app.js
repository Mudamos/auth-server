"use strict";

const express = require("express");
const path = require("path");
const favicon = require("serve-favicon");
const bodyParser = require("body-parser");
const sassMiddleware = require("node-sass-middleware");

const config = require("./src/config")();
const db = require("./src/db")(config);
const {
  AccessTokenRepository,
  AuthorizationCodeRepository,
  ClientRepository,
  UserRepository,
} = require("./src/repositories");

const accessTokenRepository = AccessTokenRepository(db);
const authorizationCodeRepository = AuthorizationCodeRepository(db);
const userRepository = UserRepository(db);
const clientRepository = ClientRepository(db);

const {
  addLogger,
  authenticateClient,
  csrf,
  ensureGrantDecisionWasNotTampered,
  ensureUserLoggedIn,
  fetchClient,
  requestId,
  requestLogger,
  session,
  validateOAuthAuthorizationRequest,
  validateOAuthTokenRequest,
} = require("./src/middlewares");

const {
  log,
} = require("./src/services");
const logger = log(config);

const {
  authorizeClient,
  createAccessToken,
  loginUser,
} = require("./src/use-cases");

const sessionMiddleware = session({ config });

const routes = require("./src/web/routes");
const api = require("./src/api");

const app = express();
app.disable("x-powered-by");

// view engine setup
app.set("views", path.join(__dirname, "src/web/views"));
app.set("view engine", "pug");

app.use(favicon(path.join(__dirname, "public", "favicon.ico")));
app.use(addLogger({ logger }));
app.use(requestId());
app.use(requestLogger());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(sassMiddleware({
  src: path.join(__dirname, "public"),
  dest: path.join(__dirname, "public"),
  indentedSyntax: true, // true = .sass and false = .scss
  sourceMap: true,
}));
app.use(express.static(path.join(__dirname, "public")));

app.get("/", (_req, res) => res.redirect("/auth/login"));
app.use("/auth", routes.auth({
  ensureUserLoggedIn: ensureUserLoggedIn({ userRepository }),
  loginUser: loginUser({ userRepository }),
  sessionMiddleware,
}));

app.use("/api/v1", api.v1({
  authenticateClient: authenticateClient({ clientRepository }),
  authorizeClient: authorizeClient({ authorizationCodeRepository, config }),
  authorizationCodeRepository,
  createAccessToken: createAccessToken({ accessTokenRepository, authorizationCodeRepository, config }),
  csrf: csrf(),
  ensureGrantDecisionWasNotTampered: ensureGrantDecisionWasNotTampered({ logger }),
  ensureUserLoggedIn: ensureUserLoggedIn({ userRepository }),
  fetchClient: fetchClient({ clientRepository }),
  sessionMiddleware,
  validateOAuthAuthorizationRequest: validateOAuthAuthorizationRequest(),
  validateOAuthTokenRequest: validateOAuthTokenRequest({
    accessTokenRepository,
    authorizationCodeRepository,
    loginUser: loginUser({ userRepository }),
  }),
}));

// catch 404 and forward to error handler
app.use(function(req, res, next) {
  const err = new Error("Not Found");
  err.status = 404;
  next(err);
});

// error handler
app.use(function(err, req, res, _next) {
  // TODO: better error handling
  const status = err.status
    || (err.message === "Not found" ? 404 : null)
    || (err.code === "EBADCSRFTOKEN" ? 403 : null)
    || 500;

  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get("env") === "development" ? err : {};

  // render the error page
  res.status(status);
  res.render("error");
});

module.exports = app;
