const { validationResult } = require("express-validator");
const { isAValidObjectId } = require("../utils/validations");
const factory = require("./handlerFactory");
const Animal = require("./../models/animalModel");
const sendError = require("./../utils/appError");

exports.createAnimal = async (req, res) => {
  const animalInfo = req.body;

  const errors = validationResult(req);

  if (!errors.isEmpty()) {
    return res.status(422).json({ errors: errors.array() });
  }

  const animalFoundedByName = await Animal.find({
    name: animalInfo.name,
  });

  const animalFoundedByScientificName = await Animal.find({
    scientificName: animalInfo.scientificName,
  });

  if (
    animalFoundedByName.length > 0 ||
    animalFoundedByScientificName.length > 0
  ) {
    return res
      .status(409)
      .json(
        sendError(
          "Animal already exists, name and scientific name has to be unique",
          409
        )
      );
  }

  console.log(req.user, "This is the user in the request");

  animalInfo.user = req.user;

  const newAnimal = await Animal.create(animalInfo);

  res.status(201).json({
    status: "success",
    data: newAnimal,
  });
};

exports.getAnimalById = factory.findDocumentById(Animal);

exports.updateAnimal = factory.updateDocument(Animal);

exports.deleteAnimal = factory.deleteDocument(Animal);

exports.getAnimalsByEcosystem = async (req, res) => {
  const { ecosystem } = req.params;

  const capitalizedEcosystem = ecosystem[0].toUpperCase() + ecosystem.slice(1);

  const animals = await Animal.find({
    ecosystem: capitalizedEcosystem,
  });

  res.status(200).json({
    status: "success",
    data: animals,
  });
};

exports.getAnimalsByUserId = async (req, res) => {
  const { id } = req.params;

  if (!isAValidObjectId(id)) {
    return res
      .status(400)
      .json(sendError(`${id} is not a valid Object Id`, 400));
  }

  const animals = await Animal.find({
    user: id,
  });

  res.status(200).json({
    status: "success",
    data: animals,
  });
};
