const mongoose = require("mongoose");

const paymentSchema = new mongoose.Schema({
  transactionId: { type: String, required: false },
  dateTime: { type: Date, required: false },
  amount: { type: Number, required: false },
  currency: { type: String, required: false },

  donor: {
    userId: { type: Number, required: false },
    name: { type: String, required: false },
    email: { type: String, required: false },
  },

  beneficiary: {
    beneficiaryId: { type: String, required: false },
    name: { type: String, required: false },
  },

  paymentMethod: {
    type: { type: String, required: false },
    lastFourDigits: { type: String, required: false },
  },

  supportNanna:{
    supportAmount: { type: Number, required: false },
  },
  
});

module.exports = mongoose.model("Payment", paymentSchema, "Payments");
