const User = require('../models/User');
const { CustomError } = require('../middlewares/error');
const Post = require('../models/Posts');

const createPostController = async (req, res, next) => {
  const { userID, caption } = req.body;

  try {
    const user = await User.findById(userID);
    if (!user) {
      throw new CustomError('User not found', 404);
    }

    const newPost = new Post({
      user: userID,
      caption,
    });

    await newPost.save();
    user.posts.push(newPost._id);
    await user.save();

    res.status(201).json({
      message: 'Post created successfully',
      post: newPost,
    });
  } catch (error) {
    next(error);
  }
};

module.exports = { createPostController };
