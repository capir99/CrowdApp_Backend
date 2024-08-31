const mongoose = require("mongoose");

const product = mongoose.Schema({
  imag: { type: String, required: true },
  name: { type: String, required: true },
  title: { type: String, required: true },
  location: { type: String, required: true },
  invitation: { type: String },
  details: { type: String },
  helpways: { type: String },
  likes: { type: Number, default: 0 },
  category: { type: String },
});

module.exports = mongoose.model("product", product, "Products");
