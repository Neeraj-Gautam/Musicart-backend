const mongoose = require("mongoose");

const productSchema = new mongoose.Schema({
  uuid: {
    type: String,
    required: true,
    unique: true,
  },
  brand: {
    type: String,
    required: true,
  },
  modelName: {
    type: String,
    required: true,
  },
  fullName: {
    type: String,
    required: true,
  },
  stars: {
    type: String,
    required: true,
  },
  about: {
    type: String,
    required: true,
  },
  price: {
    type: Number,
    required: true,
  },
  color: {
    type: String,
    required: true,
  },
  headPhoneType: {
    type: String,
    required: true,
  },
});

module.exports = mongoose.model("Product", productSchema);
