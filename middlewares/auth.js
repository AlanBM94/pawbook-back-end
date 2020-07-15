const jwt = require("jsonwebtoken");
const sendError = require("./../utils/appError");
const User = require("./../models/userModel");
// If the token's User does not belong to a user in the database sendError

module.exports = async (req, res, next) => {
  const token = req.header("x-auth-token");
  if (!token) {
    return res
      .status(401)
      .json(sendError("No token, authorization denied", 401));
  } else {
    try {
      const decoded = jwt.verify(token, process.env.JWT_SECRET);
      const user = await User.find({ _id: decoded.id });

      if (user.length === 0) {
        return res.status(401).json(sendError("Token is not valid", 401));
      }
      req.user = decoded.id;
      next();
    } catch (error) {
      res.status(401).json(sendError("Token is not valid", 401));
    }
  }
};
