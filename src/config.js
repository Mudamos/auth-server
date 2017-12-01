"use strict";

const {
  complement,
  is,
  isNil,
  find,
  test,
} = require("ramda");

const isNotNil = complement(isNil);
const isBoolean = test(/^true|false$/i);
const isString = is(String);

const config = config => name => {
  if (name in config) {
    const option = config[name];

    return isString(option) && isBoolean(option)
      ? test(/^true$/i, option)
      : option;
  }

  return null;
};

const defaultConfig = {
  DB_MULTIPLE_STATEMENTS_ENABLED: false,
  LOG_COLOR_ENABLED: true,
  LOG_LEVEL: "debug",
  DB_LOGGING: false,
  DB_PORT: 5432,
};

module.exports = (configuration = {}) => name => {
  /* Priority:
   * - Injection
   * - Env var
   * - Default config
   */
  const value = find(isNotNil, [
    config(configuration),
    config(process.env),
    config(defaultConfig),
  ].map(config => config(name)));

  if (isNotNil(value)) {
    return value;
  } else {
    throw new Error(`Env var ${name} not defined`);
  }
};
