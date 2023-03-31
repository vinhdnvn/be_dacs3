const mongoose = require("mongoose");

const theatersSchema = mongoose.Schema({
  nameTheater: String,
  address: String,
  availableSeats: Boolean,
});
module.exports = mongoose.model("Theater", theatersSchema);
