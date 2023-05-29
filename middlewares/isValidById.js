const { HttpError } = require("../helpers");
const { isValidObjectId } = require("mongoose");

const isValidById = (req, res, next) => {
  const { contactId } = req.params;
  if (!isValidObjectId(contactId)) {
    next(HttpError(400, `${contactId} not found`));
  }
  next();
};

module.exports = isValidById;
