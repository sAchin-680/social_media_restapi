const express = require('express');
const {
  registerController,
  currentUserController,
  loginController,
  logoutController,
  updateController,
  deleteController,
} = require('../controllers/authController');

const router = express.Router();

// Register
router.post('/register', registerController);

// Login
router.post('/login', loginController);

// Logout
router.get('/logout', logoutController);

// Get current user
router.get('/refetch', currentUserController);

// Update user
router.put('/update', updateController);

// Delete user
router.delete('/delete', deleteController);

module.exports = router;
