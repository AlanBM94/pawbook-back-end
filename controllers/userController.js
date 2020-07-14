const User = require("./../models/userModel");
const { validationResult } = require("express-validator");
const sendError = require("./../utils/appError");
const factory = require("./handlerFactory");
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

exports.signUp = async (req, res) => {
  const userInfo = req.body;

  const errors = validationResult(req);

  if (!errors.isEmpty()) {
    return res.status(422).json({ errors: errors.array() });
  }

  if (userInfo.password !== userInfo.passwordConfirm) {
    return res.status(400).json(sendError("Passwords are not the same", 400));
  }

  const user = await User.find({ email: userInfo.email });

  if (user.length > 0) {
    return res
      .status(409)
      .json(sendError("User with that email already exists", 409));
  }

  const newUser = await User.create(userInfo);

  createSendToken(newUser, 201, res);
};

exports.logIn = async (req, res) => {
  const errors = validationResult(req);

  if (!errors.isEmpty()) {
    return res.status(422).json({ errors: errors.array() });
  }

  const { email, password } = req.body;

  const user = await User.findOne({ email }).select("+password");

  if (!user || !(await user.correctPassword(password, user.password))) {
    return res.status(401).json(sendError("Incorrect email or password", 401));
  }

  createSendToken(user, 200, res);
};

exports.getUserById = factory.findDocumentById(User);

exports.updateUser = factory.updateDocument(User);

exports.deleteUser = factory.deleteDocument(User);
