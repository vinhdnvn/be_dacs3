const mongoose = require("mongoose");

const reviewSchema = mongoose.Schema({
  comment: String,
  rating: Number,
});
module.exports = mongoose.model("Review", reviewSchema);
