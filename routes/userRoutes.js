const express = require("express");
const userController = require("./../controllers/userController");
const {
  signUpValidations,
  logInValidations,
  changePasswordValidations,
  updateUserValidations,
} = require("./../utils/validations");
const validation = require("./../middlewares/validateBody");

const auth = require("./../middlewares/auth");

const router = express.Router();

router.post(
  "/signup",
  signUpValidations,
  validation.checkIfBodyHasErrors,
  userController.signUp
);

router.post(
  "/signin",
  logInValidations,
  validation.checkIfBodyHasErrors,
  userController.logIn
);

router.get("/:id", auth, userController.getUserById);

router.patch(
  "/changepassword",
  auth,
  changePasswordValidations,
  validation.checkIfBodyHasErrors,
  userController.updatePassword
);

router.patch(
  "/:id",
  auth,
  updateUserValidations,
  validation.checkIfBodyHasErrors,
  userController.updateUser
);

router.delete("/:id", auth, userController.deleteUser);

module.exports = router;
