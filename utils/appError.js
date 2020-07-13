const sendError = (message, statusCode) => {
  return {
    error: {
      statusCode,
      status: "fail",
      message,
    },
  };
};

module.exports = sendError;
