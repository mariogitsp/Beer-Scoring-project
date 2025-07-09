const express = require('express');
const User = require('../models/User');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
require('dotenv').config();

const router = express.Router();

router.post('/register', async (req, res) => {
  const { username, email, password } = req.body;
  
  try {
    let user = await User.findOne({ email });
    if (user) return res.status(400).json({ msg: 'User already exists' });

    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    user = new User({ username, email, password});
    await user.save();

    const payload ={
      userId: user._id,
      role: user.role
    };
    console.log("role: ", user.role);
    const token = jwt.sign(payload, "SeCr3tK3y", {});

    res.status(201).json({ 
        message: 'User created',
        token,
        user: {id: user._id, username, email}
      });
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});

router.post('/login', async (req, res) => {
  console.log("Login route hit");
  const { email, password } = req.body;
  

  try {
    const user = await User.findOne({ email });
    if (!user) return res.status(400).json({ message: 'User not found' });

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) return res.status(400).json({ message: 'Invalid credentials' });

    const token = jwt.sign({ userId: user._id, role: user.role}, 'SeCr3tK3y');
    console.log("Role is: ", user.role);
    res.json({ 
      token,
      message: "User logged in"
     });
  } catch (err) {
    console.error("Error in /login route: ", err);
    res.status(500).json({ message: err.message });
  }
});

module.exports = router;
