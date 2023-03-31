const mongoose = require("mongoose");

const paymentSchema = mongoose.Schema({
  paymentName: String,
  description: String,
  gateway: String,
});

module.exports = mongoose.model("Payment", paymentSchema);
