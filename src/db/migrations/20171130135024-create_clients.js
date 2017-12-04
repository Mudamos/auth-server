"use strict";

module.exports = {
  up: (queryInterface, Sequelize) =>
    queryInterface.createTable("clients", {
      id: {
        type: Sequelize.INTEGER,
        primaryKey: true,
        autoIncrement: true,
      },
      createdAt: Sequelize.DATE,
      grants: {
        type: Sequelize.ARRAY(Sequelize.STRING),
        allowNull: false,
      },
      name: {
        type: Sequelize.STRING,
        allowNull: false,
      },
      redirectUris: {
        type: Sequelize.ARRAY(Sequelize.STRING),
        allowNull: false,
      },
      secret: {
        type: Sequelize.STRING,
        allowNull: false,
      },
      updatedAt: Sequelize.DATE,
    }),

  down: (queryInterface, _Sequelize) =>
    queryInterface.dropTable("clients"),
};
