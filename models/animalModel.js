const mongoose = require("mongoose");

const AnimalSchema = mongoose.Schema({
  name: {
    type: String,
    required: [true, "Animal must have a name"],
    unique: true,
    trim: true,
  },
});
