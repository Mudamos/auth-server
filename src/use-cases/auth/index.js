"use strict";

const {
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
  throw "Failed"
};
