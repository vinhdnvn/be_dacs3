const mongoose = require("mongoose");

const paymentSchema = mongoose.Schema({
  _id: mongoose.Schema.Types.ObjectId,
  paymentName: String,
  description: String,
  gateway: String,
  // paymentFor: {
  //   type: String,
  //   // make reference to the booking model
  //   ref: "Booking",
  // },
  paymentBelong: {
    type: String,
    ref: "User",
  },
});

module.exports = mongoose.model("Payment", paymentSchema);
