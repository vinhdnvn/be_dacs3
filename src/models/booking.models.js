const mongoose = require("mongoose");

const bookingSchema = mongoose.Schema({
  theater: { type: mongoose.Schema.Types.ObjectId, ref: "Theater" },
  showtimes: Date,
  seatNumbers: String,
  payment: { type: mongoose.Schema.Types.ObjectId, ref: "Payment" },
});
module.exports = mongoose.model("Booking", bookingSchema);
