"use strict";

module.exports = {
  up: (queryInterface, Sequelize) =>
    queryInterface.createTable("authorization_codes", {
      id: {
        type: Sequelize.INTEGER,
        primaryKey: true,
        autoIncrement: true,
      },
      clientId: {
        type: Sequelize.INTEGER,
        references:  {
          model: "clients",
          key: "id",
        },
        allowNull: false,
        onDelete: "CASCADE",
      },
      userId: {
        type: Sequelize.INTEGER,
        references: {
          model: "users",
          key: "id",
        },
        allowNull: false,
        onDelete: "CASCADE",
      },
      code: {
        type: Sequelize.STRING,
        allowNull: false,
        unique: true,
      },
      createdAt: Sequelize.DATE,
      expiresAt: {
        type: Sequelize.DATE,
        allowNull: false,
      },
      redirectUri: {
        type: Sequelize.STRING,
        allowNull: false,
      },
      scopes: {
        type: Sequelize.ARRAY(Sequelize.STRING),
        allowNull: false,
      },
      updatedAt: Sequelize.DATE,
    }),

  down: (queryInterface, Sequelize) =>
    queryInterface.dropTable("authorization_codes"),
};
