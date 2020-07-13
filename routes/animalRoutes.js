const express = require("express");
const router = express.Router();
const { animalValidations } = require("../utils/validations");
const animalController = require("./../controllers/animalController");
const auth = require("./../middlewares/auth");

router.post("/", auth, animalValidations, animalController.createAnimal);

router.get("/:id", animalController.getAnimalById);

router.patch("/:id", auth, animalValidations, animalController.updateAnimal);

router.delete("/:id", auth, animalController.deleteAnimal);

router.get("/ecosystem/:ecosystem", animalController.getAnimalsByEcosystem);

router.get("/user/:id", auth, animalController.getAnimalsByUserId);

module.exports = router;
