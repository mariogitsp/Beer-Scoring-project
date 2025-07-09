const express = require('express');
const Beer = require('../models/Beer');
const router = express.Router();
const auth = require('../middleware/auth');
const Review = require('../models/Review');
const mongoose = require('mongoose');
const isAdmin = require('../middleware/isAdmin');

router.get('/', async (req, res) => {
  console.log("Uzimanje pivi:");
  try {
    const beers = await Beer.find();
    res.json(beers);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

router.post('/add',auth, isAdmin, async (req, res) => {
  const beer = new Beer({
    name: req.body.name,
    description: req.body.description,
    image: req.body.image,
    avgRating: req.body.avgRating
  });

  try {
    const newBeer = await beer.save();
    res.status(201).json(newBeer);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});

router.get('/average/:beerId', async (req, res) => {
  try {
    const beerId = req.params.beerId;

    const result = await Review.aggregate([
      { $match: { beerId: new mongoose.Types.ObjectId(beerId) } },
      {
        $group: {
          _id: '$beerId',
          averageRating: { $avg: '$rating' },
          totalReviews: { $sum: 1 }
        }
      }
    ]);

    if (result.length === 0) {
      return res.json({ averageRating: 0, totalReviews: 0 });
    }

    const { averageRating, totalReviews } = result[0];
    res.json({ averageRating: averageRating.toFixed(2), totalReviews });
  } catch (error) {
    res.status(500).json({ error: 'Server error while calculating average rating.' });
  }
});

router.delete('/delete/:id', auth, isAdmin, async (req, res) => {
  try {
    const deletedBeer = await Beer.findByIdAndDelete(req.params.id);

    if (!deletedBeer) {
      return res.status(404).json({ message: 'Beer not found' });
    }

    res.json({ message: 'Beer deleted successfully', beer: deletedBeer });
  } catch (err) {
    res.status(500).json({ message: 'Server error', error: err.message });
  }
});

module.exports = router;
