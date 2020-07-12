const express = require("express");
const router = express.Router();
const { animalValidations } = require("./../utils");
const animalController = require("./../controllers/animalController");

router.post("/", animalValidations, animalController.createAnimal);

router.get("/:id", animalController.getAnimalsById);

router.patch("/:id", animalValidations, animalController.updateAnimal);

router.delete("/:id", animalController.deleteAnimal);

router.get("/ecosystem/:ecosystem", animalController.getAnimalsByEcosystem);

module.exports = router;
