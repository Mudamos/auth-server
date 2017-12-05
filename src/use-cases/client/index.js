"use strict";

const {
  Auth: { generateToken },
  Client: { generateSecret },
} = require("../../models");

module.exports.createClient = ({ clientRepository }) => async ({ grants, name, redirectUris }) => {
  const secret = await generateToken();
  const hashedSecret = await generateSecret(secret);
  const client = await clientRepository.create({
    grants,
    name,
    redirectUris,
    secret: hashedSecret,
  });

  return {
    client,
    secret,
  };
};
