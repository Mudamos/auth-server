"use strict";

module.exports = {
  up: (queryInterface, _Sequelize) => Promise.all([
    queryInterface.addIndex("access_tokens", {
      fields: ["token"],
    }),
    queryInterface.addIndex("access_tokens", {
      fields: ["refreshToken"],
    }),
    queryInterface.addIndex("access_tokens", {
      fields: ["clientId", "refreshToken"],
    }),
  ]),

  down: (queryInterface, _Sequelize) => Promise.all([
    queryInterface.removeIndex("access_tokens", ["token"]),
    queryInterface.removeIndex("access_tokens", ["refreshToken"]),
    queryInterface.removeIndex("access_tokens", ["clientId", "refreshToken"]),
  ]),
};
