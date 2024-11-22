const express = require('express');
const {
  getUserController,
  updateUserController,
} = require('../controllers/UserController');
const router = express.Router();

// GET USER
router.get('/:userID', getUserController);

// UPDATE USER
router.put('/update/:userID', updateUserController);

module.exports = router;
