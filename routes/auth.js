const express = require('express');
const User = require('../models/User');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

const router = express.Router();

// Register
router.post('/register', async (req, res) => {
  try {
    const { username, email, password } = req.body;
    const existingUser = await User.findOne({ $or: [{ username }, { email }] });

    if (existingUser) {
      return res.status(400).json('User already exists');
    }

    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hashSync(password, salt);

    const newUser = new User({ ...req.body, password: hashedPassword });
    const savedUser = await newUser.save();

    return res.status(201).json(savedUser);
  } catch (error) {
    console.error(error.message);
    res.status(500).json('Server error');
  }
});

// Login
router.post('/login', async (req, res) => {
  try {
    let user;

    if (req.body.email) {
      user = await User.findOne({ email: req.body.email });
    } else {
      user = await User.findOne({ username: req.body.username });
    }

    if (!user) {
      res.status(404).json('User not found');
    }

    const match = await bcrypt.compare(req.body.password, user.password);

    if (!match) {
      res.status(401).json('Wrong Credentials');
      const { password, ...data } = user.doc;
      const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, {
        expiresIn: '24h',
        res.cookie('token', token).status(200).json(data),
      });

      res.status(200).json(user);
    }
  } catch (error) {
    console.error(error.message);
    res.status(500).json('Server error');
  }
});

// Logout

// Get current user

// Update user

// Delete user

module.exports = router;
