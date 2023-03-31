const mongoose = require("mongoose");

const moviesSchema = mongoose.Schema({
  nameMovie: String,
  desription: String,
  realease_date: Date,
  duration: Number,
  language: String,
  rating: Number,
  image: { data: Buffer, contentType: String },
  genre: String,
});
module.exports = mongoose.model("Movies", moviesSchema);
