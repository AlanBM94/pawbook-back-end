const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");

const UserSchema = mongoose.Schema({
  user: {
    type: String,
    required: [true, "Please provide a user"],
    trim: true,
  },
  email: {
    type: String,
    unique: true,
    required: [true, "Please provide an email"],
  },
  password: {
    type: String,
    required: [true, "Please provide a password"],
    minlength: 8,
    maxlength: 20,
    select: false,
  },
  passwordConfirm: {
    type: String,
    required: [true, "Please confirm your password"],
  },
});

UserSchema.pre("save", async function (next) {
  this.password = await bcrypt.hash(this.password, 12);
  this.passwordConfirm = undefined;

  next();
});

UserSchema.methods.correctPassword = async function (
  candidatePassword,
  userPassword
) {
  return await bcrypt.compare(candidatePassword, userPassword);
};

const User = mongoose.model("User", UserSchema);

module.exports = User;
