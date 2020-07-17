const { validationResult } = require("express-validator");
const sendError = require("./../utils/appError");

module.exports.checkIfBodyHasErrors = (req, res, next) => {
  const errors = validationResult(req);

  if (!errors.isEmpty()) {
    return res.status(422).json({
      status: 422,
      errors,
    });
  } else {
    return next();
  }
};
