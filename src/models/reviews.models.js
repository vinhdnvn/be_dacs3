const mongoose = require("mongoose");

const reviewSchema = mongoose.Schema({
  _id: mongoose.Schema.Types.ObjectId,
  comment: String,
  rating: Number,
  belongToUser: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
  belongMovies: { type: mongoose.Schema.Types.ObjectId, ref: "Movies" },
});
module.exports = mongoose.model("Review", reviewSchema);
