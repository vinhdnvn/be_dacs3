const express = require("express");
const router = express.Router();
const mongoose = require("mongoose");
// import booking model
const Booking = require("../models/booking.models");
const Payment = require("../models/payment.models");
const User = require("../models/users.models");
// create route for get all booking
router.get("/", (req, res, next) => {
  Booking.find()
    .then((result) => {
      res.status(200).json({
        message: "Booking found",
        result: result,
      });
    })
    .catch((err) => {
      res.status(500).json({
        error: err,
      });
    });
});

// create route post for create booking with reference to userId and add to database bookingInofrmatin field in User model
router.post("/:userId", async (req, res, next) => {
  const userId = req.params.userId;
  const user = await User.findById(userId);

  try {
    if (!user) {
      return res.status(404).json({
        message: "User not found",
      });
    } else {
      const booking = new Booking({
        _id: new mongoose.Types.ObjectId(),
        movie: req.body.movie,
        // showtimes: req.body.showtimes,
        seatNumbers: req.body.seatNumbers,
        price: req.body.price,
        belongUser: userId,
      });
      // save booking to database
      const result = await booking.save();
      // add booking to bookingInformation field in User model
      user.bookingInformation.push(booking);
      await user.save();
      res.status(201).json({
        message: "Booking created",
        result: result,
      });
    }
  } catch (error) {
    res.status(500).json({
      error: error,
    });
  }
});

// create route for get single booking with reference to userId
router.get("/:userId/:bookingId", (req, res, next) => {
  const userId = req.params.userId;
  const bookingId = req.params.bookingId;
  // check userId is exist in database or not then get booking
  User.findById(userId).then((user) => {
    if (!user) {
      return res.status(404).json({
        message: "User not found",
      });
    } else {
      // check bookingId is exist in database or not then get booking
      Booking.findById(bookingId)
        .populate("belongUser", "email")
        .then((booking) => {
          if (!booking) {
            return res.status(404).json({
              message: "Booking not found",
            });
          } else {
            res.status(200).json({
              message: "Booking found",
              result: booking,
            });
          }
        });
    }
  });
});

// create route delete for delete single booking with reference to userId
router.delete("/:userId/:bookingId", async (req, res, next) => {
  const userId = req.params.userId;
  const bookingId = req.params.bookingId;
  // check userId is exist in database or not then get booking
  const user = await User.findById(userId);
  const booking = await Booking.findById(bookingId);
  try {
    if (!user || !booking) {
      return res.status(404).json({
        message: "User or Booking not found",
      });
    } else {
      // remove booking in database and booking in bookingInformation field in User model
      Booking.deleteOne({ _id: bookingId }).then((result) => {
        user.bookingInformation.pull(bookingId);
        user.save();
        res.status(200).json({
          message: "Booking deleted",
          result: result,
        });
      });
    }
  } catch (error) {
    console.log(error);
    res.status(500).json({
      error: error,
    });
  }
});

// export module
module.exports = router;
