"use strict";

module.exports = config => ({
  dialect: "postgres",
  host: config("DB_HOST"),
  username: config("DB_USER"),
  password: config("DB_PASS"),
  port: config("DB_PORT"),
  database: config("DB_NAME"),
  migrationStorageTableName: "sequelize_meta",
  operatorsAliases: false,
  pool: {
    min: parseInt(config("DB_POOL_MIN_CONNECTIONS"), 10),
    max: parseInt(config("DB_POOL_MAX_CONNECTIONS"), 10),
  },
  dialectOptions: {
    client_encoding: "utf8", // https://github.com/brianc/node-postgres/blob/master/lib/connection-parameters.js#L60
  },
  // eslint-disable-next-line no-console
  logging: config("DB_LOGGING") ? console.log : false,
});
