const User = require("./../models/userModel");
const jwt = require("jsonwebtoken");

const signToken = (id) => {
  return jwt.sign({ id }, process.env.JWT_SECRET, {
    expiresIn: process.env.JWT_EXPIRES_IN,
  });
};

const createSendToken = (user, statusCode, res) => {
  const token = signToken(user._id);

  user.password = undefined;

  res.status(statusCode).json({
    status: "success",
    data: {
      user,
      token,
    },
  });
};

exports.createUser = async (req, res) => {
  const userInfo = req.body;

  if (userInfo.password !== userInfo.passwordConfirm) {
    return res.status(400).json({
      status: "fail",
      data: "Passwords are not the same",
    });
  }

  const user = await User.find({ email: userInfo.email });

  if (user.length > 0) {
    return res.status(400).json({
      status: "fail",
      data: "User with that email already exists",
    });
  }

  const newUser = await User.create(userInfo);

  createSendToken(newUser, 200, res);
};
