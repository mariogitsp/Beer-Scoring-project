const express = require('express');
const Review = require('../models/Review');
const auth = require('../middleware/auth');
const router = express.Router();

router.get('/', async (req, res) => {
  try {
    const reviews = await Review.find().populate('beerId').populate('userId');
    res.json(reviews);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

//sve recenzije jedne pive
router.get('/beer/:id', async (req, res) => {
  console.log(req.params.id);
  const reviews = await Review.find({beerId: req.params.id}).populate('userId');
  res.json(reviews);
});

router.post('/add', auth, async (req, res) => {
  console.log("Usa si u add review");

  const { beerId, rating, comment } = req.body;
  const userId = req.user;

  console.log("Request body:", req.body);
  

  try{
    const postojeciReview = await Review.findOne({beerId, userId});
    if(postojeciReview){
      return res.status(400).json({ message: 'Već si ocijenio ovu pivu'});
    }
    const review = new Review({
    beerId: beerId,
    userId: req.user,
    rating: rating,
    comment: comment
    });
    const noviReview = await review.save();
    res.status(201).json(noviReview);
  }
  catch(err){
    res.status(400).json({ message: err.message});
  }
});

router.put('/:id', auth, async (req, res) => {
  const { rating, comment } = req.body;
  console.log("Id: ", req.params.id);
  try{
    const azuriraniReview = await Review.findByIdAndUpdate(
      req.params.id,
      { rating, comment },
      { new: true }
    );

    if(!azuriraniReview){
      return res.status(404).json({ message: 'Review nije pronađen'});
    }

    res.json(azuriraniReview);
  }
  catch(err){
    res.status(400).json({ message: err.message});
  }
});

router.delete('/:id', auth, async(req, res) => {
  try{
    const review = await Review.findById(req.params.id);
    if(!review){
      return res.status(404).json({ message: 'Review nije pronađen'});
    }

    console.log("Req", req);
    console.log("Req.user.role", req.user.role);
    const isAdmin = req.user.role ==='admin';
    const isAuthor = review.userId.toString() === req.user.id;

    if(!isAdmin && !isAuthor){
      return res.status(403).json({ message: 'Nisi autoriziran za brisanje reviewa'});
    }
    await Review.findByIdAndDelete(req.params.id);
    res.json({ message: 'Review izbrisan'});
  }
  catch(err){
    res.status(400).json({ message: err.message});
  }
});

module.exports = router;
