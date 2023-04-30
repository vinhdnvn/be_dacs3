const express = require("express");
const router = express.Router();
const mongoose = require("mongoose");

const Payment = require("../models/payment.models");
const User = require("../models/users.models");

// create a get all payment route
router.get("/", (req, res, next) => {
  Payment.find()
    .then((result) => {
      res.status(200).json({
        message: "Payments found",
        result: result,
      });
    })
    .catch((err) => {
      res.status(500).json({
        error: err,
      });
    });
});

// create a delete route for delete payment by id with reference to User Id

router.delete("/:userId/:paymentId", async (req, res, next) => {
  const userId = req.params.userId;
  const paymentId = req.params.paymentId;
  const user = await User.findById(userId);
  const payment = await Payment.findById(paymentId);
  try {
    if (!user || !payment) {
      return res.status(404).json({
        message: "User or Payment not found",
      });
    } else {
      Payment.deleteOne({ _id: paymentId }).then((result) => {
        user.paymentInformation.pull(paymentId);
        user.save();
        res.status(200).json({
          message: "Payment deleted",
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

// get payment by Id with populate User Id
router.get("/:userId/:paymentId", (req, res, next) => {
  const userId = req.params.userId;
  const paymentId = req.params.paymentId;
  // check userId is exist in database or not by using findOne
  User.findById(userId).then((user) => {
    if (!user) {
      res.status(404).json({
        message: "User not found",
      });
    } else {
      Payment.findById(paymentId)
        .populate("paymentBelong", "email")
        .then((result) => {
          res.status(200).json({
            message: "Payment found",
            result: result,
          });
        });
    }
  });
});

// post a payment for booking with reference to User Id
router.post("/:userId", async (req, res, next) => {
  const userId = req.params.userId;
  const user = await User.findById(userId);
  try {
    if (!user) {
      return res.status(404).json({
        message: "User not found",
      });
    } else {
      const payment = new Payment({
        _id: new mongoose.Types.ObjectId(),
        paymentName: req.body.paymentName,
        description: req.body.description,
        gateway: req.body.gateway,
        paymentBelong: userId,
      });
      // save payment to database
      const result = await payment.save();
      // add payment to paymentInformation field in User model
      user.paymentInformation.push(payment);
      await user.save();
      res.status(201).json({
        message: "Payment created",
        result: result,
      });
    }
  } catch (error) {}
});

// export module
module.exports = router;
