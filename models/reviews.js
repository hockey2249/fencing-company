const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const ReviewsSchema = new Schema({
  	firstName: String,
  	lastName: String,
  	review: String,
  	score: Number,
  	date: Date,
  	approved: Boolean
});

const Review = mongoose.model('Review', ReviewsSchema);

module.exports = Review;