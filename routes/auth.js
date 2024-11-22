const express = require('express');
const User = require('../models/User');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

const router = express.Router();

// Register
router.post('/register', async (req, res) => {
  try {
    const { userName, email, password, fullName, bio } = req.body;

    if (!userName || !email || !password) {
      return res.status(400).json('All fields are required');
    }

    const existingUser = await User.findOne({
      $or: [{ userName }, { email }, { fullName }, { bio }],
    });

    if (existingUser) {
      return res.status(400).json('User already exists');
    }

    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    const newUser = new User({
      userName,
      email,
      fullName,
      bio,
      password: hashedPassword,
    });
    const savedUser = await newUser.save();

    return res.status(201).json(savedUser);
  } catch (error) {
    if (error.name === 'ValidationError') {
      return res.status(400).json({ message: error.message });
    }

    res.status(500).json({ message: 'Server error' });
  }
});

// Login
router.post('/login', async (req, res) => {
  try {
    const user = req.body.email
      ? await User.findOne({ email: req.body.email })
      : await User.findOne({ username: req.body.username });

    if (!user) {
      return res.status(404).json('User not found');
    }

    const match = await bcrypt.compare(req.body.password, user.password);
    if (!match) {
      return res.status(401).json('Wrong Credentials');
    }

    const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, {
      expiresIn: '24h',
    });
    // console.log(token);

    const { password, ...data } = user.toObject();

    res.cookie('token', token, { httpOnly: true }).status(200).json(data);
  } catch (error) {
    console.error(error.message);
    res.status(500).json('Server error');
  }
});

// Logout
router.get('/logout', async (req, res) => {
  try {
    res
      .clearCookie('token', { sameSite: 'none', secure: true })
      .status(200)
      .json('Logged out');
  } catch (error) {
    console.error(error.message);
    res.status(500).json('Server error');
  }
});

// Get current user
router.get('/refetch', async (req, res) => {
  const token = req.cookies.token;

  jwt.verify(token, process.env.JWT_SECRET, async (err, data) => {
    // console.log(data);
    if (err) {
      return res.status(404).json('Unauthorized');
    }

    try {
      const id = data.id;

      const user = await User.findByOne({ _id: id });
      //   if (!user) {
      //     return res.status(404).json('User not found');
      //   }

      res.status(200).json(user);
    } catch (error) {
      console.error(error.message);
      res.status(500).json('Server error');
    }
  });
});

// Update user
router.put('/update', async (req, res) => {
  const token = req.cookies.token;

  jwt.verify(token, process.env.JWT_SECRET, async (err, data) => {
    if (err) {
      return res.status(401).json('Unauthorized');
    }

    try {
      const { userName, email, fullName, bio } = req.body;
      const userId = data.id;

      const updatedUser = await User.findByIdAndUpdate(
        userId,
        { userName, email, fullName, bio },
        { new: true }
      );

      if (!updatedUser) {
        return res.status(404).json('User not found');
      }

      res.status(200).json(updatedUser);
    } catch (error) {
      console.error(error.message);
      res.status(500).json('Server error');
    }
  });
});

// Delete user
router.delete('/delete', async (req, res) => {
  const token = req.cookies.token;

  jwt.verify(token, process.env.JWT_SECRET, async (err, data) => {
    if (err) {
      return res.status(404).json('Unauthorized');
    }

    try {
      const userId = data.id;
      const deletedUser = await User.findByIdAndDelete(userId);

      if (!deletedUser) {
        return res.status(404).json('User not found');
      }

      res.status(200).json('User deleted successfully');
    } catch (error) {
      console.error(error.message);
      res.status(500).json('Server error');
    }
  });
});

module.exports = router;
