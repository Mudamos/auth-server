"use strict";

module.exports = {
  up: (queryInterface, _Sequelize) => Promise.all([
    queryInterface.addIndex("authorization_codes", {
      fields: ["scopes"],
      using: "gin",
    }),
    queryInterface.addIndex("authorization_codes", {
      fields: ["clientId", "userId"],
    }),
    queryInterface.addIndex("authorization_codes", {
      fields: ["code"],
    }),
    queryInterface.addIndex("authorization_codes", {
      fields: ["clientId", "scopes", "userId"],
      using: "gin",
    }),
  ]),

  down: (queryInterface, _Sequelize) => Promise.all([
    queryInterface.removeIndex("authorization_codes", ["scopes"]),
    queryInterface.removeIndex("authorization_codes", ["clientId", "userId"]),
    queryInterface.removeIndex("authorization_codes", ["code"]),
    queryInterface.removeIndex("authorization_codes", ["clientId", "scopes", "userId"]),
  ]),
};
