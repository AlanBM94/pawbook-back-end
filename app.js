const express = require("express");
const app = express();
const bodyParser = require("body-parser");
const animalRouter = require("./routes/animalRoutes");
const userRouter = require("./routes/userRoutes");
const sendError = require("./utils/appError");

// TODO: upload image

app.use(bodyParser.urlencoded({ extended: true }));

app.use(bodyParser.json());

app.use("/api/v1/animals", animalRouter);
app.use("/api/v1/users", userRouter);

app.use("*", (req, res) => {
  res
    .status(404)
    .json(sendError(`${req.originalUrl} is not an existing route`, 404));
});

module.exports = app;
