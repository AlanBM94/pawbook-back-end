const { isAValidObjectId } = require("../utils/validations");
const sendError = require("./../utils/appError");
const { validationResult } = require("express-validator");
const Animal = require("./../models/animalModel");

exports.findDocumentById = (Model) => async (req, res) => {
  const { id } = req.params;

  if (!isAValidObjectId(id)) {
    return res
      .status(400)
      .json(sendError(`${id} is not a valid ObjectId`, 400));
  }

  const document = await Model.findById(id);

  if (!document) {
    res.status(404).json(sendError("Document not found with that id", 404));
  }

  res.status(200).json({
    status: "success",
    data: document,
  });
};

exports.updateDocument = (Model) => async (req, res) => {
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

  const documentInfo = req.body;

  const document = await Model.findByIdAndUpdate(id, documentInfo, {
    new: true,
    runValidators: true,
  });

  if (!document) {
    return res
      .status(404)
      .json(sendError("Document not found with that id", 404));
  }

  res.status(200).json({
    status: "success",
    data: document,
  });
};

const deleteAllAnimalsFromUser = async (userId) => {
  await Animal.remove({ user: userId });
};

exports.deleteDocument = (Model) => async (req, res) => {
  const { id } = req.params;

  if (!isAValidObjectId(id)) {
    return res
      .status(400)
      .json(sendError(`${id} is not a valid ObjectId`, 400));
  }

  const document = await Model.findByIdAndDelete(id);

  if (!document) {
    return res
      .status(404)
      .json(sendError("Document not found with that id", 404));
  }

  const resource = req.originalUrl.split("/")[
    req.originalUrl.split("/").length - 2
  ];

  if (resource === "users") deleteAllAnimalsFromUser(id);

  res.status(200).json({
    status: "success",
    data: null,
  });
};
