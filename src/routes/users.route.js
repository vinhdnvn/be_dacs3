const express = require("express");
const router = express.Router();
const mongoose = require("mongoose");

const User = require("../models/users.models");
const Movie = require("../models/movies.models");
const Review = require("../models/reviews.models");

// controller
const userController = require("../controllers/user.controllers");

// create a delete route for delete user
router.delete("/:userId", userController.deleteUser);
// create a get route for get user by id
router.get("/:userId", (req, res, next) => {
	const id = req.params.userId;
	// check if id is exist in database or not by using findById method from mongoose model User
	if (id) {
		User.findById(id)
			.then((result) => {
				res.status(200).json({
					message: "User found",
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

// create a put route for update user by id
router.put("/:userId", (req, res, next) => {
	const id = req.params.userId;
	const { email, password } = req.body;
	// check if id is exist in database or not by using findById method from mongoose model User
	if (id) {
		User.findByIdAndUpdate(id)
			.then((result) => {
				result.email = email;
				result.password = password;
				result
					.save()
					.then((result) => {
						res.status(200).json({
							message: "User updated",
							result: result,
						});
					})
					.catch((err) => {
						res.status(500).json({
							error: err,
						});
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

// create route for get all users
router.get("/", (req, res, next) => {
	User.find()
		.then((result) => {
			res.status(200).json({
				message: "Users found",
				result: result,
			});
		})
		.catch((err) => {
			res.status(500).json({
				error: err,
			});
		});
});

// create route for post review to movie by user id and save moviedId to field belongToMovies in Movie model and save reviewId to field comments in User model using try catch
router.post("/:userId/review", async (req, res, next) => {
	try {
		const userId = req.params.userId;
		const { movieId, comment, rating } = req.body;
		const movie = await Movie.findById(movieId);
		const user = await User.findById(userId);
		// check movie and user is exist or not
		if (!movie || !user) {
			res.status(404).json({
				message: "Movie or User not found",
			});
		} else {
			// create review object
			const review = new Review({
				_id: new mongoose.Types.ObjectId(),
				comment: comment,
				rating: rating,
				belongToMovie: movieId,
				belongToUser: userId,
			});
			await review.save().then((result) => {
				res.status(200).json({
					message: "Review created",
					result: result,
				});
			});
			// console.log(movie.reviews);
			// save review object to Movie model
			movie.reviews.push(review);
			movie.save();
			// save review object to User model
			user.comment.push(review);
			user.save();
		}
	} catch (error) {
		console.log(error);
		res.status(500).json({
			error: error,
		});
	}
});

// create delete route for delete review by user id and pull review id from array reviews in  Movies model (NOTE DONE YET 4.6.2023)
router.delete("/:userId/review/:reviewId", (req, res, next) => {
	const userId = req.params.userId;
	const reviewId = req.params.reviewId;
	const { movieId } = req.body;
	const user = User.findById(userId);
	const review = Review.findById(reviewId);
	const movie = Movie.findById(movieId);

	if (!user || !review) {
		res.status(404).json({
			message: "User or Review not found",
		});
	} else {
		Review.findByIdAndDelete(reviewId)
			.then((result) => {
				res.status(200).json({
					message: "Review deleted",
					result: result,
				});
				movie.reviews.pull(reviewId);
				movie.save();
				user.comment.pull(reviewId);
				user.save();
			})
			.catch((err) => {
				res.status(500).json({
					error: err,
				});
			});
	}
});

module.exports = router;
