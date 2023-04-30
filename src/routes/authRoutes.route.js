// create an api route for authentication user
// import express and router
const express = require("express");
const router = express.Router();
const mongoose = require("mongoose");
const jwt = require("jsonwebtoken");
const { requireAuth, checkUser } = require("../middleware/authMiddleware");
const User = require("../models/users.models");

// create a post route for sign up
router.post("/signup", (req, res, next) => {
  console.log(req.body);
  const { email, password } = req.body;
  // create a new user by using const
  const newUser = new User({
    _id: new mongoose.Types.ObjectId(),
    email: email,
    password: password,
  });
  // save the new user
  newUser.save();
  res.json({ success: true, msg: "User registered" });
});

// create a post route for login and get data in User database
router.post("/login", async (req, res, next) => {
  const { email, password } = req.body;
  // check if email is exist in database or not by using findOne method from mongoose model User

  try {
    const user = await User.login(email, password);
    const token = createToken(user._id);
    res.cookie("jwt", token, { httpOnly: true, maxAge: maxAge * 1000 });
    // render sucess from view folder
    res.status(200).json({ user: user._id, message: "Login success" });
  } catch (error) {
    res.status(500).json({
      message: "Login failed",
    });
  }
});

router.post("/login/testView", async (req, res, next) => {
  const { email, password } = req.body;
  try {
    const user = await User.login(email, password);
    const token = createToken(user._id);
    res.cookie("jwt", token, { httpOnly: true, maxAge: maxAge * 1000 });
    // render sucess from view folder
    res.render("sucess");
  } catch (error) {
    res.status(500).json({
      message: "Login failed",
    });
  }
});

// jwt authentication
const maxAge = 3 * 24 * 60 * 60;
const createToken = (id) => {
  return jwt.sign({ id }, "secret", {
    expiresIn: maxAge,
  });
};

// create a get route to render sucess view
router.get("/sucess", requireAuth, checkUser, (req, res, next) => {
  res.render("sucess");
});

// export the router
module.exports = router;
