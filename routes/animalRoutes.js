const express = require("express");
const router = express.Router();
const { animalValidations } = require("../utils/validations");
const animalController = require("./../controllers/animalController");
const auth = require("./../middlewares/auth");
const validation = require("./../middlewares/validateBody");
const fileUpload = require("./../middlewares/fileUpload");

router.post(
  "/",
  auth,
  fileUpload.single("image"),
  animalValidations,
  validation.checkIfBodyHasErrors,
  animalController.createAnimal
);

router.get("/:id", animalController.getAnimalById);

router.patch(
  "/:id",
  auth,
  fileUpload.single("image"),
  animalValidations,
  validation.checkIfBodyHasErrors,
  animalController.updateAnimal
);

router.delete("/:id", auth, animalController.deleteAnimal);

router.get("/ecosystem/:ecosystem", animalController.getAnimalsByEcosystem);

router.get("/user/:id", auth, animalController.getAnimalsByUserId);

module.exports = router;
