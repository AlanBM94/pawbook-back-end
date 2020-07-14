const express = require("express");
const userController = require("./../controllers/userController");
const {
  signUpValidations,
  logInValidations,
  updatePasswordValidations,
  updateUserValidations,
} = require("./../utils/validations");
const auth = require("./../middlewares/auth");

const router = express.Router();

router.get("/:id", auth, signUpValidations, userController.getUserById);

router.patch("/:id", auth, updateUserValidations, userController.updateUser);

router.delete("/:id", auth, updateUserValidations, userController.deleteUser);

router.post("/signup", signUpValidations, userController.signUp);

router.post("/signin", logInValidations, userController.logIn);

module.exports = router;
