const bcrypt = require("bcrypt");
const mongoose = require("mongoose");

const userSchema = mongoose.Schema({
  _id: mongoose.Schema.Types.ObjectId,
  email: {
    type: String,
    unique: true,
    require: true,
    // create a match for email valid
    match:
      /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/,
  },
  name: String,
  dateOfBirth: Date,
  // create a phone with string type and match phone valid
  phone: {
    type: Number,
    match: /^[\+]?[(]?[0-9]{3}[)]?[-\s\.]?[0-9]{3}[-\s\.]?[0-9]{4,6}$/im,
  },
  password: {
    type: String,
    require: [true, "You must enter the password"],
    minLength: [6, "Minium password length is 6 characters"],
  },
  avatarImg: { data: Buffer, contentType: String },
  bookingInformation: [
    { type: mongoose.Schema.Types.ObjectId, ref: "Booking" },
  ],
  paymentInformation: [
    { type: mongoose.Schema.Types.ObjectId, ref: "Payment" },
  ],
  comment: [{ type: mongoose.Schema.Types.ObjectId, ref: "Review" }],
});

// create a function to hash password
userSchema.pre("save", function (next) {
  const user = this;
  if (user.isModified("password")) {
    bcrypt.hash(user.password, 10, (err, hash) => {
      if (err) {
        return next(err);
      }
      user.password = hash;
      next();
    });
  } else {
    next();
  }
});

userSchema.statics.login = async function (email, password) {
  const user = await this.findOne({ email });
  if (user) {
    const auth = await bcrypt.compare(password, user.password);
    if (auth) {
      return user;
    }
    throw Error("incorrect password");
  } else {
    throw Error("incorrect email");
  }
};

module.exports = mongoose.model("User", userSchema);
