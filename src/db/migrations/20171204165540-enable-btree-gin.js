"use strict";

module.exports = {
  up: (queryInterface, _Sequelize) =>
    queryInterface.sequelize.query("CREATE EXTENSION btree_gin"),

  down: (queryInterface, _Sequelize) =>
    queryInterface.sequelize.query("DROP EXTENSION btree_gin"),
};
