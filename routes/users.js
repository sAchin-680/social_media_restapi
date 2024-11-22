const express = require('express');
const {
  getUserController,
  updateUserController,
  followUserController,
} = require('../controllers/UserController');
const router = express.Router();

// GET USER
router.get('/:userID', getUserController);

// UPDATE USER
router.put('/update/:userID', updateUserController);

// FOLLOW USER
router.post('/follow/:userID', followUserController);
module.exports = router;
