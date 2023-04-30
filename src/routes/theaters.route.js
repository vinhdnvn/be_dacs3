// create a theaters route
const express = require("express");
const router = express.Router();
const mongoose = require("mongoose");
const Theater = require("../models/theaters.models");
const Movie = require("../models/movies.models");
const multer = require("multer");
const path = require("path");

// create a post route for create new theater
router.post("/", (req, res, next) => {
  console.log(req.body);
  const { nameTheater, address, availableSeats } = req.body;
  const theater = new Theater({
    _id: new mongoose.Types.ObjectId(),
    nameTheater: nameTheater,
    address: address,
    availableSeats: availableSeats,
  });
  theater
    .save()
    .then((result) => {
      res.status(201).json({
        message: "Theater created",
        result: result,
      });
    })
    .catch((err) => {
      res.status(500).json({
        error: err,
      });
    });
});

// create post route for add movie to theater
router.post("/:theaterId", async (req, res, next) => {
  try {
    const id = req.params.theaterId;
    const { movieId } = req.body;
    const movie = await Movie.findById(movieId);
    const theater = await Theater.findById(id);
    if (!theater || !movie) {
      res.status(404).json({
        message: "Theater or Movie not found",
      });
    } else {
      // add id to movie.belongToTheater and save to database
      movie.belongToTheater.push(id);
      await movie.save();
      theater.movies.push(movieId);
      const result = await theater.save();
      res.status(200).json({
        message: "Movie added to theater",
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

// create a delete route for delete movie from theater
router.delete("/:theaterId", async (req, res, next) => {
  try {
    const id = req.params.theaterId;
    const { movieId } = req.body;
    const movie = await Movie.findById(movieId);
    const theater = await Theater.findById(id);
    if (!theater || !movie) {
      res.status(404).json({
        message: "Theater or Movie not found",
      });
    } else {
      movie.belongToTheater.pull(id);
      theater.movies.pull(movieId);
      const result = await theater.save();
      res.status(200).json({
        message: "Movie deleted from theater",
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

// create a get route for get all theaters
router.get("/", (req, res, next) => {
  Theater.find()
    .then((result) => {
      res.status(200).json({
        message: "Theaters found",
        result: result,
      });
    })
    .catch((err) => {
      res.status(500).json({
        error: err,
      });
    });
});

// create a get route for get theater by id
router.get("/:theaterId", (req, res, next) => {
  const id = req.params.theaterId;
  // check if id is exist in database or not by using findById method from mongoose model User
  if (id) {
    Theater.findById(id)
      .then((result) => {
        res.status(200).json({
          message: "Theater found",
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
      message: "Theater not found",
    });
  }
});

// create a put route for update theater by id
router.put("/:theaterId", (req, res, next) => {
  const id = req.params.theaterId;
  const { nameTheater, address, availableSeats } = req.body;
  // check if id is exist in database or not by using findById method from mongoose model User
  if (id) {
    Theater.findById(id)
      .then((result) => {
        result.nameTheater = nameTheater;
        result.address = address;
        result.availableSeats = availableSeats;
        result
          .save()
          .then((result) => {
            res.status(200).json({
              message: "Theater updated",
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
      message: "Theater not found",
    });
  }
});

// create a delete route for delete theater by id
router.delete("/:theaterId", (req, res, next) => {
  const id = req.params.theaterId;
  // check if id is exist in database or not by using findById method from mongoose model Theater
  if (id) {
    Theater.findByIdAndDelete(id)
      .then((result) => {
        res.status(200).json({
          message: "Theater deleted",
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
      message: "Theater not found",
    });
  }
});

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

// create route for upload file image to theater
router.post(
  "/upload/test",
  upload.single("imageTheater"),
  async (req, res, next) => {
    const { nameTheater, address, availableSeats } = req.body;
    const file = req.file;

    try {
      const theater = new Theater({
        _id: new mongoose.Types.ObjectId(),
        nameTheater: nameTheater,
        address: address,
        availableSeats: availableSeats,
        imageTheater: file.path,
      });

      const result = await theater.save();
      res.status(200).json({
        message: "Theater created and upload image sucess",
        result: result,
      });
      // console log imageTheater file path
      console.log(file.path);
    } catch (error) {
      console.log(error);
      res.status(500).json({
        error: error,
      });
    }
  }
);

// export router
module.exports = router;
