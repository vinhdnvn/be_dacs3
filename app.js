const express = require("express");
const app = express();
const mongoose = require("mongoose");
const cors = require("cors");
const bodyParser = require("body-parser");
app.use(cors());
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
// parse application/json
app.use(bodyParser.json());
// ========================uppload=======================
// parse application/x-www-form-urlencoded
app.use(bodyParser.urlencoded({ extended: true }));

// swagger setup
const swaggerUi = require("swagger-ui-express");
const swaggerDocument = require("./swagger.json");
app.use("/api-docs", swaggerUi.serve, swaggerUi.setup(swaggerDocument));
// =======================

require("dotenv").config();

mongoose.connect("mongodb+srv://user:120203@dacs3.bpf6hma.mongodb.net/test");
mongoose.connection.on("connected", () => {
  console.log("connected");
});

// middleware

app.set("view engine", "ejs");
app.set("views", "./src/views");

// upload file
app.use("/uploads", express.static("uploads"));
app.get("/upload", (req, res) => {
  res.render("index");
});

// login view
app.use("/loginTest", (req, res) => {
  res.render("login");
});
app.use("/register", (req, res) => {
  res.render("register");
});

app.use(express.static(__dirname + "/public"));

// ================================

app.get("/", (req, res) => {
  console.log(req.body);
  res.send("Djt con ba gia nha may");
});

// import authRoutes
const authRoutes = require("./src/routes/authRoutes.route");
// use authRoutes
app.use("/auth", authRoutes);
// import moviesRoutes
const moviesRoutes = require("./src/routes/movies.route");
// use moviesRoutes
app.use("/movies", moviesRoutes);

const userRoutes = require("./src/routes/users.route");
app.use("/user", userRoutes);

const theaterRoutes = require("./src/routes/theaters.route");
app.use("/theater", theaterRoutes);

const reviewRoutes = require("./src/routes/reviews.route");
app.use("/review", reviewRoutes);

const paymentRoutes = require("./src/routes/payment.route");
app.use("/payment", paymentRoutes);

const bookingRoutes = require("./src/routes/booking.route");
app.use("/booking", bookingRoutes);

app.listen(process.env.PORT, () => {
  console.log(`Example app listening on port ` + process.env.PORT);
});
