const express = require('express');
const {
  getUserController,
  updateUserController,
  followUserController,
  unfollowUserController,
  blockUserController,
  unblockUserController,
  getBlockedUsersController,
  deleteUserController,
  searchUsersController,
} = require('../controllers/UserController');

const router = express.Router();

// GET USER
router.get('/:userID', getUserController);

// UPDATE USER
router.put('/update/:userID', updateUserController);

// FOLLOW USER
router.post('/follow/:userID', followUserController);

// UNFOLLOW USER
router.post('/unfollow/:userID', unfollowUserController);

// BLOCK USER
router.post('/block/:userID', blockUserController);

// UNBLOCK USER
router.post('/unblock/:userID', unblockUserController);

// GET BLOCKED USERS
router.get('/blocked-users', getBlockedUsersController);

// DELETE USER
router.delete('/:userID', deleteUserController);

// SEARCH USERS
router.get('/search/:query', searchUsersController);

module.exports = router;
