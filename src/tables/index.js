"use strict";

const memoize = require("lru-memoize").default(1);

const clientTable = require("./client");
const userTable = require("./user");

module.exports = memoize(sequelize => {
  const Client = clientTable(sequelize);
  const User = userTable(sequelize);

  return {
    clientsTable: Client,
    usersTable: User,
  };
});
