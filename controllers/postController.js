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

const generateFileUrl = (filename) => {
  return process.env.URL + `/uploads/${filename}`;
};

const createPostWithImagesController = async (req, res, next) => {
  const { userID } = req.params;
  const { caption } = req.body;

  try {
    const user = await User.findById(userID);
    if (!user) {
      throw new CustomError('User not found', 404);
    }

    const imageUrl = req.files.map((file) => generateFileUrl(file.filename));

    const newPost = new Post({
      user: userID,
      caption,
      images: imageUrl,
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

const updatePostController = async (req, res, next) => {
  const { postId } = req.params;
  const { caption } = req.body;
  try {
    const postToUpdate = await Post.findById(postId);

    if (!postToUpdate) {
      throw new CustomError('Post not found', 404);
    }
    postToUpdate.caption = caption || postToUpdate.caption;

    await postToUpdate.save();
    res.status(200).json({
      message: 'Post updated successfully',
      post: postToUpdate,
    });
  } catch (error) {
    next(error);
  }
};

const getAllPostsController = async (req, res, next) => {
    const { userId } = req.params;
    try {
      const user = await User.findById(userId).populate('posts');
      if (!user) {
        throw new CustomError('User not found', 404);
      }
  
      const blocked = Array.isArray(user.blocked) ? user.blocked.map((id) => id.toString()) : [];
  
      const allPosts = await Post.find({ user: { $nin: blocked } }).populate(
        'user',
        'username fullName profilePicture'
      );
  
      res.status(200).json({
        message: 'All posts',
        posts: allPosts, // Corrected response
      });
    } catch (error) {
      next(error);
    }
  };
  

module.exports = {
  createPostController,
  createPostWithImagesController,
  updatePostController,
  getAllPostsController,
};
