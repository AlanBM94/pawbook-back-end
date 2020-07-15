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

exports.signUp = async (req, res) => {
  const userInfo = req.body;

  if (userInfo.password !== userInfo.passwordConfirm) {
    return res.status(400).json(sendError("Passwords are not the same", 400));
  }

  if (userInfo.password.length <= 7 || userInfo.passwordConfirm.length <= 7) {
    return res
      .status(400)
      .json(sendError("Password has to be at least 8 characters", 400));
  }

  try {
    const user = await User.find({ email: userInfo.email });

    if (user.length > 0) {
      return res
        .status(409)
        .json(sendError("User with that email already exists", 409));
    }

    const newUser = await User.create(userInfo);

    createSendToken(newUser, 201, res);
  } catch (error) {
    res
      .status(500)
      .json(sendError("Server error, please try later again", 500));
  }
};

exports.logIn = async (req, res) => {
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
    res
      .status(500)
      .json(sendError("Server error, please try later again", 500));
  }
};

exports.updatePassword = async (req, res) => {
  try {
    const user = await User.findById(req.user).select("+password");

    if (
      !(await user.correctPassword(req.body.passwordCurrent, user.password))
    ) {
      return res
        .status(401)
        .json(sendError("Current password is not correct", 401));
    }

    if (req.body.password !== req.body.passwordConfirm) {
      return res.status(401).json(sendError("Passwords are not the same", 401));
    }

    if (req.body.password.length <= 7 || req.body.passwordConfirm.length <= 7) {
      return res
        .status(400)
        .json(sendError("Password has to be at least 8 characters", 400));
    }

    user.password = req.body.password;
    user.passwordConfirm = req.body.passwordConfirm;

    await user.save();

    res.status(200);

    createSendToken(user, 200, res);
  } catch (error) {
    console.log("this is the error", error);
    res
      .status(500)
      .json(sendError("Server error, please try later again", 500));
  }
};

exports.getUserById = factory.findDocumentById(User);

exports.updateUser = factory.updateDocument(User);

exports.deleteUser = factory.deleteDocument(User);
