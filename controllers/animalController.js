const { isAValidObjectId } = require("../utils/validations");
const factory = require("./handlerFactory");
const Animal = require("./../models/animalModel");
const sendError = require("./../utils/appError");

exports.createAnimal = async (req, res) => {
  const animalInfo = req.body;

  try {
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
            "Document already exists, name and scientific name has to be unique",
            409
          )
        );
    }

    animalInfo.user = req.user;

    const newAnimal = await Animal.create(animalInfo);

    res.status(201).json({
      status: "success",
      data: newAnimal,
    });
  } catch (error) {
    res
      .status(500)
      .json(sendError("Server error, please try later again", 500));
  }
};

exports.getAnimalById = factory.findDocumentById(Animal);

exports.updateAnimal = factory.updateDocument(Animal);

exports.deleteAnimal = factory.deleteDocument(Animal);

exports.getAnimalsByEcosystem = async (req, res) => {
  const { ecosystem } = req.params;

  const capitalizedEcosystem = ecosystem[0].toUpperCase() + ecosystem.slice(1);

  try {
    const animals = await Animal.find({
      ecosystem: capitalizedEcosystem,
    });

    res.status(200).json({
      status: "success",
      data: animals,
    });
  } catch (error) {
    res
      .status(500)
      .json(sendError("Server error, please try later again", 500));
  }
};

exports.getAnimalsByUserId = async (req, res) => {
  const { id } = req.params;

  if (!isAValidObjectId(id)) {
    return res
      .status(400)
      .json(sendError(`${id} is not a valid Object Id`, 400));
  }

  try {
    const animals = await Animal.find({
      user: id,
    });

    res.status(200).json({
      status: "success",
      data: animals,
    });
  } catch (error) {
    res
      .status(500)
      .json(sendError("Server error, please try later again", 500));
  }
};
