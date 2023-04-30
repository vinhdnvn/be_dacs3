const express = require("express");
const router = express.Router();
const mongoose = require("mongoose");
const Review = require("../models/reviews.models");
const User = require("../models/users.models");
const Movie = require("../models/movies.models");
const Theater = require("../models/theaters.models");

// create a post route for create new review to 1 movie by 1 User, that movie belong to 1 theater
router.post("/:userId/:theaterId/:movieId", async (req, res, next) => {
  try {
    const userId = req.params.userId;
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
      // post a new review
      const review = new Review({
        _id: new mongoose.Types.ObjectId(),
        belongToUser: userId,
        belongMovie: movieId,
        comment: req.body.comment,
        rating: req.body.rating,
      });
      const result = await review.save();
      res.status(201).json({
        message: "Review created",
        result: result,
      });
    }
  } catch (error) {
    console.log(error);
    res.status(500).json({
      error: error,
    });
  }
});

// create a get route for get single review by Id with reference to userId and movieId
router.get("/:userId/:reviewId", (req, res, next) => {
  const userId = req.params.userId;
  const reviewId = req.params.reviewId;
  User.findById(userId).then((result) => {
    if (!result) {
      return res.status(404).json({
        message: "User not found",
      });
    } else {
      Review.findById(req.params.reviewId)
        .populate("belongToUser", "email")
        .populate("belongMovies", "nameMovie")
        .then((result) => {
          if (!result) {
            return res.status(404).json({
              message: "Review not found",
            });
          } else {
            res.status(200).json({
              message: "Review found",
              result: result,
            });
          }
        });
    }
  });
});

// create a delete route for delete single review by Id
// router.delete("/:userId/:reviewId", (req, res, next) => {
//   const userId = req.params.userId;
//   const reviewId = req.params.reviewId;
//   // check userId is exist in database or not then delete review
//   User.findById(userId).then((user) => {
//     if (!user) {
//       return res.status(404).json({
//         message: "User not found",
//       });
//     } else {
//       // check reviewId is exist in database or not then delete review
//       Review.findById(reviewId).then((review) => {
//         if (!review) {
//           return res.status(404).json({
//             message: "Review not found",
//           });
//         } else {
//           // delete review
//           Review.findByIdAndDelete(reviewId).then((result) => {
//             res.status(200).json({
//               message: "Review deleted",
//               result: result,
//             });
//           });
//         }
//       });
//     }
//   });
// });

// // get all review by movieId
// router.get("/movie/:movieId", (req, res, next) => {
//              const movieId = req.params.movieId;
//              Movie.findById(movieId).then((movie) => {
//                 if(!movie)
//                 {
//                   return res.status(404).json({
//                     message:"Movie not found"
//                   });
//                 }
//                 else{
//                   Review.find
//                 }
//              });
// });
// get all review
router.get("/", (req, res, next) => {
  Review.find()

    .populate("belongMovies")
    .populate("belongToUser")
    .then((result) => {
      res.status(200).json({
        message: "All review found",
        result: result,
      });
    });
});

// export router
module.exports = router;
