const sendError = require("./../utils/appError");

const makeDuplicateError = (err) => {
  const value = err.errmsg.match(/(["'])(\\?.)*?\1/)[0];
  const statusCode = 409;
  const errorMessage = `${value} is a duplicate field`;
  return { statusCode, errorMessage };
};

const makeCastError = (err) => {
  const statusCode = 400;
  const errorMessage = `Invalid ${err.path}: ${err.value}`;
  return { statusCode, errorMessage };
};

const makeValidationError = (err) => {
  const errors = Object.values(err.errors).map((el) => el.message);
  const statusCode = 400;
  const errorMessage = `Invalid input data. ${errors.join(". ")}`;
  return { statusCode, errorMessage };
};

module.exports = (err, req, res, next) => {
  let error;

  if (err.message === "Invalid myme type") {
    error = { statusCode: 400, errorMessage: err.message };
  } else if (err.message.includes("E11000 duplicate key")) {
    error = makeDuplicateError(err);
  } else if (err.message.includes("Cast to ObjectId failed for value")) {
    error = makeCastError(err);
  } else if ((err.name = "ValidationError")) {
    error = makeValidationError(err);
  }

  res
    .status(error.statusCode)
    .json(sendError(error.errorMessage, error.statusCode));
};
