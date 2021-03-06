const express = require("express");
const app = express();
const cors = require("cors");
const helmet = require("helmet");
const xss = require("xss-clean");
const mongooseSanatize = require("express-mongo-sanitize");
const bodyParser = require("body-parser");
const animalRouter = require("./routes/animalRoutes");
const userRouter = require("./routes/userRoutes");
const sendError = require("./utils/appError");
const globalErrorHandler = require("./controllers/errorController");

app.use(bodyParser.urlencoded({ extended: true }));

app.use(helmet());

app.use(mongooseSanatize());

app.use(xss());

app.use(cors());

app.use(bodyParser.json());

app.use("/api/v1/animals", animalRouter);
app.use("/api/v1/users", userRouter);

app.all("*", (req, res) => {
  res
    .status(404)
    .json(sendError(`${req.originalUrl} is not an existing route`, 404));
});

app.use(globalErrorHandler);

module.exports = app;
