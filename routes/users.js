const express = require('express');
const upload = require('../middlewares/upload');
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
  uploadProfilePictureController,
  uploadCoverProfilePictureController   ,
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

// UPDATE PROFILE PICTURE
router.put(
  '/update-profile-picture/:userID',
  upload.single('profilePicture'),
  uploadProfilePictureController
);

// COVER PICTURE
router.put(
  '/update-cover-picture/:userID',
  upload.single('profilePicture'),
  uploadCoverProfilePictureController
);

module.exports = router;
