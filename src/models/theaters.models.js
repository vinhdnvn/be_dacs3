const mongoose = require("mongoose");

const theatersSchema = mongoose.Schema({
  _id: mongoose.Schema.Types.ObjectId,
  nameTheater: String,
  address: String,
  availableSeats: Boolean,
  movies: [{ type: mongoose.Schema.Types.ObjectId, ref: "Movies" }],
  imageTheater: { data: Buffer, type: String, required: true },
});
module.exports = mongoose.model("Theater", theatersSchema);
