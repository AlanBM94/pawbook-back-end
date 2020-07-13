const { validationResult } = require("express-validator");
const { isAValidObjectId } = require("../utils/validations");
const Animal = require("./../models/animalModel");
const sendError = require("./../utils/appError");

exports.createAnimal = async (req, res) => {
  const animalInfo = req.body;

  const errors = validationResult(req);

  if (!errors.isEmpty()) {
    return res.status(422).json({ errors: errors.array() });
  }

  const animal = await Animal.find({ name: animalInfo.name });

  if (animal.length > 0) {
    return res.status(409).json(sendError("Animal already exists", 409));
  }

  animalInfo.user = req.user;

  const newAnimal = await Animal.create(animalInfo);

  res.status(201).json({
    status: "success",
    data: newAnimal,
  });
};

exports.getAnimalById = async (req, res, next) => {
  const { id } = req.params;

  if (!isAValidObjectId(id)) {
    return res
      .status(400)
      .json(sendError(`${id} is not a valid ObjectId`, 400));
  }

  const animal = await Animal.findById(id);

  if (!animal) {
    res.status(404).json(sendError("Animal not found with that id", 404));
  }

  res.status(200).json({
    status: "success",
    data: animal,
  });
};

exports.updateAnimal = async (req, res) => {
  const { id } = req.params;

  const errors = validationResult(req);

  if (!errors.isEmpty()) {
    return res.status(422).json({ errors: errors.array() });
  }

  if (!isAValidObjectId(id)) {
    return res
      .status(400)
      .json(sendError(`${id} is not a valid ObjectId`, 400));
  }

  const animalInfo = req.body;

  const animal = await Animal.findByIdAndUpdate(id, animalInfo, {
    new: true,
    runValidators: true,
  });

  if (!animal) {
    return res
      .status(404)
      .json(sendError("Animal not found with that id", 404));
  }

  res.status(200).json({
    status: "success",
    data: animal,
  });
};

exports.deleteAnimal = async (req, res) => {
  const { id } = req.params;

  if (!isAValidObjectId(id)) {
    return res
      .status(400)
      .json(sendError(`${id} is not a valid ObjectId`, 400));
  }

  const animal = await Animal.findByIdAndDelete(id);

  if (!animal) {
    return res
      .status(404)
      .json(sendError("Animal not found with that id", 404));
  }

  res.status(200).json({
    status: "success",
    data: null,
  });
};

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
