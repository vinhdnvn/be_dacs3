// create an api for movies route
// import express and router
const express = require("express");
const router = express.Router();
const mongoose = require("mongoose");

// import multer
const multer = require("multer");
const path = require("path");

// import movie model
const Movie = require("../models/movies.models");
const Theater = require("../models/theaters.models");
const Review = require("../models/reviews.models");
const { move } = require("fs-extra");

// config multer to upload single file image
const storage = multer.diskStorage({
	destination: (req, file, cb) => {
		cb(null, path.join(__dirname, "/uploads/"));
	},
	filename: (req, file, cb) => {
		const filename = file.originalname.toLocaleLowerCase().split(" ").join("-");
		cb(null, Date.now() + "-" + filename);
	},
});

// validate that only image files  are uploaded
const fileFilter = (req, file, cb) => {
	if (
		file.mimetype === "image/jpeg" ||
		file.mimetype === "image/png" ||
		file.mimetype === "image/jpg"
	) {
		cb(null, true);
	} else {
		cb(null, false);
	}
};

const upload = multer({ storage, fileFilter });

// create get route for load a index view
router.get("/testUploadFile", (req, res, next) => {
	res.render("index");
});

// create route for upload file
router.post("/upload", upload.single("image"), (req, res, next) => {
	const file = req.file;
	if (!file) {
		const error = new Error("Please upload a file");
		error.httpStatusCode = 400;
		return next(error);
	}
	res.send(file);
});

// create a post route for create new movie
router.post("/", upload.single("image"), async (req, res, next) => {
	const movie = await new Movie({
		_id: new mongoose.Types.ObjectId(),
		nameMovie: req.body.nameMovie,
		description: req.body.description,
		language: req.body.language,
		rating: req.body.rating,
		rottenTomatoes: req.body.rottenTomatoes,
		ign: req.body.ign,
		// image: req.file.path,
		imageMovies: req.body.imageMovies,
		genre: req.body.genre,
	});

	movie.save().then((result) => {
		res.status(201).json({
			result: result,
		});
		//  console log image file path
		// console.log(req.file.path);
	});
});

// create a get route for get all movies
router.get("/", async (req, res, next) => {
	try {
		const movies = await Movie.find();
		res.send(movies);
	} catch (error) {
		console.log(error);
		res.status(500).json({
			error: error,
		});
	}
});

// // create a get route for get movie by id reference with theater
router.get("/:movieId", async (req, res, next) => {
	// const theaterId = req.params.theaterId;
	try {
		const movieId = req.params.movieId;
		const movie = await Movie.findOne({ _id: movieId });
		if (!movie) {
			res.status(404).json({
				message: "Movie not found",
			});
		} else {
			res.status(200).json({
				message: "Movie found",
				result: movie,
			});
		}
	} catch (error) {
		console.log(error);
		res.status(500).json({
			error: error,
		});
	}
});

// create a delete route for delete movie
router.delete("/:movieId", (req, res, next) => {
	const id = req.params.movieId;
	// check if id is exist in database or not by using findById method from mongoose model User
	if (id) {
		Movie.findByIdAndDelete(id)
			.then((result) => {
				res.status(200).json({
					message: "Movie deleted",
					result: result,
				});
			})
			.catch((err) => {
				res.status(500).json({
					error: err,
				});
			});
	} else {
		res.status(404).json({
			message: "No valid entry found for provided ID",
		});
	}
});

//create a get route for get all review of movie, the movie is belong to 1 theater
router.get("/:theaterId/:movieId/reviews", async (req, res, next) => {
	try {
		const theaterId = req.params.theaterId;
		const movieId = req.params.movieId;
		const movie = await Movie.findOne({
			_id: movieId,
			belongToTheater: theaterId,
		});
		const theater = await Theater.findOne({ _id: theaterId });
		if (!movie || !theater) {
			res.status(404).json({
				message: "Movie or Theater not found",
			});
		} else {
			// console.log(movieId);
			const review = await Review.find({ belongToMovie: movieId });
			res.status(200).json(review);
		}
	} catch (error) {
		console.log(error);
		res.status(500).json({
			error: error,
		});
	}
});

// export the router
module.exports = router;
