const mongoose = require("mongoose");

const user = mongoose.Schema({
  name: { type: String, required: true },
  surname: { type: String, required: false },
  date_creation: { type: Date, required: false },
  email: { type: String, required: true },
  phone: { type: String, required: false },
  state: { type: Number, default: 1 },
  rol: { type: String, required: false },
  password: { type: String, required: true },
  confirmationCode: { type: String, required: false },
  isConfirmed: { type: Boolean, default: false },
});

module.exports = mongoose.model("user", user, "User");
