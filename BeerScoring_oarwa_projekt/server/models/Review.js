const mongoose = require('mongoose');

const reviewSchema = new mongoose.Schema({
  beerId: { type: mongoose.Schema.Types.ObjectId, ref: 'Beer', required: true },
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  rating: { type: Number, required: true },
  title: { type: String, required: true },
  comment: { type: String, required: true }
});

module.exports = mongoose.model('Review', reviewSchema);
