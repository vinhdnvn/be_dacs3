const mongoose = require("mongoose");

const userSchema = mongoose.Schema({
  email: {
    type: String,
    unique: true,
    require: true,
  },
  name: String,
  password: { type: String, require: true },
  avatarImg: { data: Buffer, contentType: String },
  paymentIformation: { type: mongoose.Schema.Types.ObjectId, ref: "Payment" },
});
module.exports = mongoose.model("User", userSchema);
