const express = require("express");
const router = express.Router();
const mongoose = require("mongoose");

const User = require("../models/users.models");
const Movie = require("../models/movies.models");
const Review = require("../models/reviews.models");

exports.deleteUser = (req, res, next) => {
	const id = req.params.userId;
	// check if id is exist in database or not by using findById method from mongoose model User
	if (id) {
		User.findByIdAndDelete(id)
			.then((result) => {
				res.status(200).json({
					message: "User deleted",
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
};

// create a get route for get  users by id
exports.getUserById = (req, res, next) => {
	(req, res, next) => {
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
	};
};
