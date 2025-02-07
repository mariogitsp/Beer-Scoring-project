const mongoose = require('mongoose');

const beerSchema = new mongoose.Schema({
  name: { type: String, required: true },
  description: { type: String, required: true },
  image: { type: String, required: true },
  avgRating: { type: Number, default: 0 }
});

module.exports = mongoose.model('Beer', beerSchema);
