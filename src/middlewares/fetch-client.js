"use strict";

module.exports = ({ clientRepository }) => async (req, res, next) => {
  const {
    client_id: clientId,
  } = req.query;

  if (clientId) {
    try {
      const client = await clientRepository.findById(clientId)
        .catch(e => e.message === "Not found" ? null : Promise.reject(e));

      req.client = client;
    } catch (e) {
      return next(e);
    }
  }

  next();
};
