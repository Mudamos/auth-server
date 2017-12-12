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
  throw new Error("Not found");
};

module.exports.authorizeClient = ({ authorizationCodeRepository, config }) => async ({ client, user, redirectUri, scope }) => {
  const autorizationCodeExpirationDuration = config("AUTHORIZATION_CODE_EXPIRATION_DURATION_IN_MINUTES");
  const code = await generateToken();
  const expiresAt = moment().add(autorizationCodeExpirationDuration, "minutes").toDate();
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

module.exports.createAccessToken = ({ accessTokenRepository, authorizationCodeRepository, config }) => async ({
  authorizationCodeId,
  clientId,
  userId,
  scope,
  previousAccessTokenId,
  includeRefreshToken = false,
}) => {
  const tokenExpirationDuration = config("ACCESS_TOKEN_EXPIRATION_DURATION_IN_DAYS");
  const refreshTokenExpirationDuration = config("REFRESH_TOKEN_EXPIRATION_DURATION_IN_DAYS");

  const tokenExpiresAt = moment().add(tokenExpirationDuration, "days").toDate();
  const refreshTokenExpiresAt = moment().add(refreshTokenExpirationDuration, "days").toDate();
  const scopes = scopeOrDefault(scope);

  const [token, refreshToken] = await Promise.all([generateToken(), generateToken()]);

  return accessTokenRepository.transaction(async transaction => {
    const attrs = { clientId, userId, scopes, token, tokenExpiresAt, transaction };

    const accessToken = includeRefreshToken
      ? await accessTokenRepository.create({ ...attrs, refreshToken, refreshTokenExpiresAt })
      : await accessTokenRepository.create(attrs);

    if (authorizationCodeId) {
      await authorizationCodeRepository.removeById(authorizationCodeId, { transaction });
    }

    if (previousAccessTokenId) {
      await accessTokenRepository.removeById(previousAccessTokenId, { transaction });
    }

    return accessToken;
  });
};
