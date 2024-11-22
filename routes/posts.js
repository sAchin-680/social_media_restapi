const express = require('express');
const router = express.Router();
const upload = require('../middlewares/upload');
const { createPostController } = require('../controllers/postController');

// CREATE POST
router.post('/create', createPostController);

module.exports = router;
