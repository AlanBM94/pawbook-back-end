const { isAValidObjectId } = require("../utils/validations");
const factory = require("./handlerFactory");
const Animal = require("./../models/animalModel");
const sendError = require("./../utils/appError");

exports.createAnimal = async (req, res, next) => {
  try {
    const animalInfo = req.body;

    animalInfo.user = req.user;

    if (req.file) {
      animalInfo.image = req.file.path;
    } else {
      return res.status(400).json(sendError("Image has to be a file", 400));
    }

    const newAnimal = await Animal.create(animalInfo);

    res.status(201).json({
      status: "success",
      data: newAnimal,
    });
  } catch (error) {
    console.log("this is the error", error);
    next(error);
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

exports.getAnimalsByUserId = async (req, res, next) => {
  const { id } = req.params;

  try {
    const animals = await Animal.find({
      user: id,
    });

    res.status(200).json({
      status: "success",
      data: animals,
    });
  } catch (error) {
    next(error);
  }
};
