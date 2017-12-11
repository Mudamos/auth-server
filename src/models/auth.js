"use strict";

const {
  all,
  contains,
  flip,
  isEmpty,
  pipe,
} = require("ramda");

const crypto = require("crypto");
const { promisify } = require("util");
const randomBytes = promisify(crypto.randomBytes);

const KNOWN_SCOPES = [
  "read:profile",
  "write:sign_message",
];

const DEFAULT_SCOPES = [
  "read:profile",
];

const GRANT_TYPES = [
  "authorization_code",
  "password",
  "refresh_token",
];

const parseScope = scope => {
  if (Array.isArray(scope)) return scope;

  return scope
    ? scope.split(" ")
    : [];
};

const scopeOrDefault = scope => {
  const givenScopes = parseScope(scope);

  return isEmpty(givenScopes)
    ? DEFAULT_SCOPES
    : givenScopes;
};

const isValidScope = scope =>
  pipe(
    parseScope,
    all(flip(contains)(KNOWN_SCOPES)),
  )(scope);

const isValidReponseType = flip(contains)(["code", "token"]);

const isValidGrantType = flip(contains)(GRANT_TYPES);

const generateToken = () =>
  randomBytes(256).then(buffer => crypto.createHash("sha256").update(buffer).digest("hex"));

module.exports = {
  isValidGrantType,
  isValidReponseType,
  isValidScope,
  generateToken,
  scopeOrDefault,
};
