const express = require('express');
const Beer = require('../models/Beer');
const router = express.Router();

router.get('/', async (req, res) => {
  try {
    const beers = await Beer.find();
    res.json(beers);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

router.post('/', async (req, res) => {
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

module.exports = router;
