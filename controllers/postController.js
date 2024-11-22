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
    const updatedPost = await Post.findByIdAndUpdate(
      postId,
      { caption },
      { new: true }
    );
    // postToUpdate.caption = caption || postToUpdate.caption;

    await postToUpdate.save();
    res.status(200).json({
      message: 'Post updated successfully',
      post: updatedPost,
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

    const blocked = Array.isArray(user.blocked)
      ? user.blocked.map((id) => id.toString())
      : [];

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

const getUserPostsController = async (req, res, next) => {
  const { userId } = req.params;
  try {
    const user = await User.findById(userId).populate('posts');
    if (!user) {
      throw new CustomError('User not found', 404);
    }

    const userPosts = await Post.find({ user: userId });

    res.status(200).json({
      message: 'All posts',
      posts: userPosts, // Corrected response
    });
  } catch (error) {
    next(error);
  }
};

const deletePostController = async (req, res, next) => {
  const { postId } = req.params;
  try {
    const postToDelete = await Post.findById(postId);

    if (!postToDelete) {
      throw new CustomError('Post not found', 404);
    }
    const user = await User.findById(postToDelete.user);

    if (!user) {
      throw new CustomError('User not found', 404);
    }
    user.posts = user.posts.filter(
      (postId) => postId !== postToDelete._id.toString()
    );

    await user.save();
    await postToDelete.deleteOne();

    res.status(200).json({ message: 'Post deleted successfully' });
  } catch (error) {
    next(error);
  }
};
module.exports = {
  createPostController,
  createPostWithImagesController,
  updatePostController,
  getAllPostsController,
  getUserPostsController,
  deletePostController,
};
