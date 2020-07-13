const jwt = require("jsonwebtoken");
const sendError = require("./../utils/appError");

module.exports = (req, res, next) => {
  const token = req.header("x-auth-token");
  if (!token) {
    return res
      .status(401)
      .json(sendError("No token, authorization denied", 401));
  } else {
    try {
      const decoded = jwt.verify(token, process.env.JWT_SECRET);
      req.user = decoded.id;
      next();
    } catch (error) {
      res.status(401).json(sendError("Token is not valid", 401));
    }
  }
};
