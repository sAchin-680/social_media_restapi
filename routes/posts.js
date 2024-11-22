const express = require('express');
const router = express.Router();
const upload = require('../middlewares/upload');
const {
  createPostController,
  createPostWithImagesController,
} = require('../controllers/postController');

// CREATE POST
router.post('/create', createPostController);

// CREATE POST WITH IMAGES
router.post(
  '/create-with-images',
  upload.array('images', 5),
  createPostWithImagesController
);

module.exports = router;
