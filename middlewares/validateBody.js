const { validationResult } = require("express-validator");
const sendError = require("./../utils/appError");

module.exports.checkIfBodyHasErrors = (req, res, next) => {
  const errors = validationResult(req);

  if (!errors.isEmpty()) {
    return res
      .status(422)
      .json(sendError("Invalid inputs passed, please check your data.", 422));
  } else {
    return next();
  }
};
