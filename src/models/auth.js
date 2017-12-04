"use strict";

const {
  all,
  contains,
  flip,
  isEmpty,
  pipe,
} = require("ramda");

const KNOWN_SCOPES = [
  "read:profile",
  "write:sign_message",
];

const DEFAULT_SCOPES = [
  "read:profile",
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

module.exports.isValidReponseType = isValidReponseType;
module.exports.isValidScope = isValidScope;
module.exports.scopeOrDefault = scopeOrDefault;
