const mongoose = require("mongoose");

const AnimalSchema = mongoose.Schema({
  name: {
    type: String,
    required: [true, "Animal must have a name"],
    unique: true,
    trim: true,
  },
  scientificName: {
    type: String,
    required: [true, "Animal must have a scientific name"],
    unique: true,
    trim: true,
  },
  location: {
    type: String,
    required: [true, "Animal must have a location"],
    trim: true,
  },
  weight: {
    type: Number,
    required: [true, "Animal must have a weight in kilograms"],
  },
  size: {
    type: Object,
    required: [true, "Animal must have a size"],
  },
  species: {
    type: String,
    required: [true, "Animal must have a species"],
    trim: true,
  },
  type: {
    type: String,
    required: [true, "Animal must have a type"],
    trim: true,
  },
  averageLifeTime: {
    type: Number,
    required: [true, "Animal must have an average life time"],
  },
  ecosystem: {
    type: String,
    required: [true, "Animal must have an ecosystem"],
  },
  description: {
    type: String,
    required: [true, "Animal must have a description"],
  },
  numberOfSpecimensInFreedom: {
    type: Number,
    required: [true, "Animal must have an number of specimens in freedom"],
  },
  diet: {
    type: String,
    required: [true, "Animal must have a diet"],
  },
  association: {
    type: String,
  },
  picture: {
    type: String,
    required: [true, "Animal must have a picture"],
  },
});

const Animal = mongoose.model("Animal", AnimalSchema);

module.exports = Animal;
