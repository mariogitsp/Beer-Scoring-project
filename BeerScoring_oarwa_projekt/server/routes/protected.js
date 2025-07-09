const express = require('express');
const auth = require('../middleware/auth');

const router = express.Router();

//bila je greska jer je za prvi parametar pisalo /private pa bih trebao u postmanu napisati /api/private/private
router.get('/', auth, (req, res) => {
  res.json({ msg: 'You have accessed a protected route!', userId: req.user });
});

module.exports = router;
