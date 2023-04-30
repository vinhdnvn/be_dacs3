const mongoose = require("mongoose");

const bookingSchema = mongoose.Schema({
	_id: mongoose.Schema.Types.ObjectId,
	// theater: { type: mongoose.Schema.Types.ObjectId, ref: "Theater" },
	// t nghĩ là theater độc lập với movie, nên không cần ref
	// theater: String,
	// movie là sẽ có thông tin theater rồi
	movie: String,
	showtimes: String,
	seatNumbers: String,
	theaterShow: String,
	// price field
	price: Number,
	// payment: { type: mongoose.Schema.Types.ObjectId, ref: "Payment" },
	belongUser: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
});
module.exports = mongoose.model("Booking", bookingSchema);
