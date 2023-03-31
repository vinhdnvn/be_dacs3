const express = require("express");
const app = express();
const mongoose = require("mongoose");
require("dotenv").config();

// models
const User = require("./src/models/users.models");
const Theater = require("./src/models/theaters.models");
const Booking = require("./src/models/booking.models");
const Payment = require("./src/models/payment.models");
const Review = require("./src/models/reviews.models");
const Movie = require("./src/models/movies.models");

const bodyParser = require("body-parser");

mongoose.connect("mongodb+srv://user:120203@dacs3.bpf6hma.mongodb.net/test");
mongoose.connection.on("connected", () => {
  console.log("connected");
});

app.use(bodyParser.json());

app.get("/", (req, res) => {
  console.log(req.body);
  res.send("Djt con ba gia nha may");
});

const userRoutes = require("./src/routes/users.route");

// define
app.use((req, res, next) => {
  res.header("Access-Control-Allow-Origin", "*");
  res.header(
    "Access-Control-Allow-Headers",
    "Origin, X-Requested-With, Content-Type, Accept, Authorization"
  );
  if (req.method === "OPTIONS") {
    res.header("Access-Control-Allow-Methods", "PUT,POST,PATCH,DELETE,GET");
    return res.status(200).json({});
  }
  next();
});

app.use("/user", userRoutes);

app.listen(process.env.PORT, () => {
  console.log(`Example app listening on port ` + process.env.PORT);
});
