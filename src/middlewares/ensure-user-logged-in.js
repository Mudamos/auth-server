"use strict";

const {
  isPresent,
} = require("../utils");

module.exports = ({ userRepository }) => async (req, res, next) => {
  const { userId } = req.session || {};

  if (isPresent(userId)) {
    try {
      const user = await userRepository.findById(userId)
        .catch(e => e.message === "Not found" ? null : Promise.reject(e));

      if (user) {
        req.user = user;
        return next();
      }
    } catch (e) {
      return next(e);
    }
  }

  req.session.returnTo = req.originalUrl;
  return res.redirect("/auth/login");
};
