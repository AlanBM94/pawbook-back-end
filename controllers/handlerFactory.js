const sendError = require("./../utils/appError");
const Animal = require("./../models/animalModel");

exports.findDocumentById = (Model) => async (req, res, next) => {
  const { id } = req.params;

  try {
    const document = await Model.findById(id);

    if (!document) {
      return res
        .status(404)
        .json(sendError("Document not found with that id", 404));
    }

    res.status(200).json({
      status: "success",
      data: document,
    });
  } catch (error) {
    next(error);
  }
};

exports.updateDocument = (Model) => async (req, res, next) => {
  const { id } = req.params;

  const documentInfo = req.body;

  try {
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
  } catch (error) {
    next(error);
  }
};

const deleteAllAnimalsFromUser = async (userId) => {
  try {
    await Animal.remove({ user: userId });
  } catch (error) {
    res
      .status(500)
      .json(sendError("Server error, please try later again", 500));
  }
};

exports.deleteDocument = (Model) => async (req, res, next) => {
  const { id } = req.params;

  try {
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
  } catch (error) {
    next(error);
  }
};
