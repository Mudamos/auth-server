"use strict";

const moment = require("moment");

const {
  Auth: { generateToken, scopeOrDefault },
  User: { isValidPassword },
} = require("../../models");

module.exports.loginUser = ({ userRepository }) => async ({ email, password }) => {
  email = email || "";
  password = password || "";

  const user = await userRepository.findByEmail(email);

  if (await isValidPassword({ guess: password, hash: user.password })) {
    return user;
  }

  // TODO: better error handling and validation
  throw "Failed";
};

module.exports.authorizeClient = ({ authorizationCodeRepository, config }) => async ({ client, user, redirectUri, scope }) => {
  const autorizationCodeExpirationTime = config("AUTHORIZATION_CODE_EXPIRATION_TIME_IN_MINUTES");
  const code = await generateToken();
  const expiresAt = moment().add(autorizationCodeExpirationTime, "minutes").utc().toDate();
  const scopes = scopeOrDefault(scope);

  const authCode = await authorizationCodeRepository.create({
    client,
    code,
    expiresAt,
    redirectUri,
    scopes,
    user,
  });

  return authCode;
};
