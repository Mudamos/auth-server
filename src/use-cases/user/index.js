"use strict";

const {
  any,
} = require("ramda");

const {
  isBlank,
} = require("../../utils");

const {
  User: { generatePassword },
} = require("../../models");

module.exports.createUser = ({ userRepository }) => async ({ email, name, password }) => {
  // TODO: better validations, eg. password length
  // TODO: better validation model
  if (any(isBlank, [email, name, password])) throw new Error("Invalid attributes");

  if (await userRepository.existsByEmail(email)) throw new Error("User exists already");

  const hashedPassword = await generatePassword(password);
  const user = await userRepository.create({ email, name, password: hashedPassword });

  return user;
};
