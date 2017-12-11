"use strict";

const memoize = require("lru-memoize").default(1);

const accessTokenTable = require("./access-token");
const authorizationCodeTable = require("./authorization-code");
const clientTable = require("./client");
const userTable = require("./user");

module.exports = memoize(sequelize => {
  const AccessToken = accessTokenTable(sequelize);
  const Client = clientTable(sequelize);
  const User = userTable(sequelize);
  const AuthorizationCode = authorizationCodeTable({
    sequelize,
    Client,
    User,
  });

  return {
    accessTokensTable: AccessToken,
    authorizationCodesTable: AuthorizationCode,
    clientsTable: Client,
    usersTable: User,
  };
});
