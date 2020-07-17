const User = require("./../models/userModel");
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

exports.signUp = async (req, res, next) => {
  const userInfo = req.body;

  if (userInfo.password !== userInfo.passwordConfirm) {
    return res.status(400).json(sendError("Passwords are not the same", 400));
  }

  try {
    const newUser = await User.create(userInfo);

    createSendToken(newUser, 201, res);
  } catch (error) {
    next(error);
  }
};

exports.logIn = async (req, res, next) => {
  const { email, password } = req.body;

  try {
    const user = await User.findOne({ email }).select("+password");

    if (!user || !(await user.correctPassword(password, user.password))) {
      return res
        .status(401)
        .json(sendError("Incorrect email or password", 401));
    }

    createSendToken(user, 200, res);
  } catch (error) {
    next(error);
  }
};

exports.updatePassword = async (req, res, next) => {
  try {
    const user = await User.findById(req.user).select("+password");

    if (
      !(await user.correctPassword(req.body.passwordCurrent, user.password))
    ) {
      return res
        .status(401)
        .json(sendError("Current password is not correct", 401));
    }

    user.password = req.body.password;
    user.passwordConfirm = req.body.passwordConfirm;

    await user.save();

    res.status(200);

    createSendToken(user, 200, res);
  } catch (error) {
    next(error);
  }
};

exports.getUserById = factory.findDocumentById(User);

exports.updateUser = factory.updateDocument(User);

exports.deleteUser = factory.deleteDocument(User);
