const mongoose = require("mongoose");

const moviesSchema = mongoose.Schema({
	_id: mongoose.Schema.Types.ObjectId,
	nameMovie: { type: String, required: true },
	description: String,
	realease_date: Date,
	duration: Number,
	language: String,
	rating: Number,
	rottenTomatoes: Number,
	ign: Number,
	// image: { data: Buffer, type: String, required: true },
	videoTrailer: { type: String },
	imageMovies: { type: String, required: true },
	// belongToTheater is an array and reference with Theater
	belongToTheater: [{ type: mongoose.Schema.Types.ObjectId, ref: "Theater" }],
	genre: String,
	reviews: [{ type: mongoose.Schema.Types.ObjectId, ref: "Review" }],
});
module.exports = mongoose.model("Movies", moviesSchema);
