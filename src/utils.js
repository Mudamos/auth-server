"use strict";

const {
  allPass,
  both,
  complement,
  equals,
  is,
  isEmpty,
  isNil,
  not,
  test,
} = require("ramda");

const humps = require("humps");

const isString = is(String);

const isNumber = is(Number);

const isBlank = value => isNil(value) || isEmpty(value) || isBlankString(value);

const isBlankString = allPass([isString, test(/^\s*$/)]);

const isValidNumber = both(isNumber, complement(equals(NaN)));

const isInvalidNumber = complement(isValidNumber);

const isPresent = complement(isBlank);

const rejectIfFalsy = (error = "Not found") => object =>
  object ? object : Promise.reject(isString(error) ? new Error(error) : error);

const buildQueryString = params =>
  Object
    .keys(params)
    .map(k => {
      if (isNil(params[k])) return null;
      if (Array.isArray(params[k])) {
        return params[k]
          .map(val => `${encodeURIComponent(k)}[]=${encodeURIComponent(val)}`)
          .join("&")
      }

      return `${encodeURIComponent(k)}=${encodeURIComponent(params[k])}`
    })
    .filter(value => not(isNil(value)))
    .join("&");

const underscore = humps.decamelize;

const camelizeKeys = humps.camelizeKeys;

module.exports = {
  buildQueryString,
  camelizeKeys,
  isBlank,
  isBlankString,
  isInvalidNumber,
  isNumber,
  isPresent,
  isString,
  isValidNumber,
  rejectIfFalsy,
  underscore,
};
