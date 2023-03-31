const express = require("express");
const router = express.Router();

const User = require("../models/users.models");

router.get("/", (req, res, next) => {
  res.status(500).json({
    message: "hhihihi",
  });
});

router.post("/login", (req, res, next) => {
  res.send("okk");
});

module.exports = router;
