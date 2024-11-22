const express = require('express');
const router = express.Router();
const upload = require('../middlewares/upload');
const {
  createPostController,
  createPostWithImagesController,
  updatePostController,
  getAllPostsController,
  getUserPostsController,
} = require('../controllers/postController');

// CREATE POST
router.post('/create', createPostController);

// CREATE POST WITH IMAGES
router.post(
  '/create-with-images',
  upload.array('images', 5),
  createPostWithImagesController
);

// UPDATE POST
router.put('/update/:postId', updatePostController);

// GET ALL POSTS
router.get('/all/:userId', getAllPostsController);

//  GET USER POSTS
router.get('/user/:userId', getUserPostsController);

module.exports = router;
