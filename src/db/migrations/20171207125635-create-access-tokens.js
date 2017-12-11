"use strict";

module.exports = {
  up: (queryInterface, Sequelize) =>
    queryInterface.createTable("access_tokens", {
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
      createdAt: Sequelize.DATE,
      refreshToken: {
        type: Sequelize.STRING,
        unique: true,
      },
      refreshTokenExpiresAt: {
        type: Sequelize.DATE,
      },
      scopes: {
        type: Sequelize.ARRAY(Sequelize.STRING),
        allowNull: false,
      },
      token: {
        type: Sequelize.STRING,
        allowNull: false,
        unique: true,
      },
      tokenExpiresAt: {
        type: Sequelize.DATE,
        allowNull: false,
      },
      updatedAt: Sequelize.DATE,
    }),

  down: (queryInterface, _Sequelize) =>
    queryInterface.dropTable("access_tokens"),
};
