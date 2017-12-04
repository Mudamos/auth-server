"use strict";

const memoize = require("lru-memoize").default(1);

const authorizationCodeTable = require("./authorization-code");
const clientTable = require("./client");
const userTable = require("./user");

module.exports = memoize(sequelize => {
  const Client = clientTable(sequelize);
  const User = userTable(sequelize);
  const AuthorizationCode = authorizationCodeTable({
    sequelize,
    Client,
    User,
  });

  return {
    authorizationCodesTable: AuthorizationCode,
    clientsTable: Client,
    usersTable: User,
  };
});
