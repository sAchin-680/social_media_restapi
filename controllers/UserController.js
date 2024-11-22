const User = require('../models/User');
const posts = require('../models/Posts');
const Comment = require('../models/Comment');
const Story = require('../models/Story');

const getUserController = async (req, res, next) => {
  const { userID } = req.params;

  try {
    const user = await User.findById(userID);

    if (!user) {
      throw new Error('User not found', 404);
    }

    const { password, ...rest } = user._doc;
    res.status(200).json(rest);
  } catch (error) {
    next(error);
  }
};

const updateUserController = async (req, res, next) => {
  const { userID } = req.params;
  const updateData = req.body;

  try {
    const userToUpdate = await User.findById(userID);

    if (!userToUpdate) {
      throw new CustomError('User not found', 404);
    }

    Object.assign(userToUpdate, updateData);
    await userToUpdate.save();

    res.status(200).json({ message: 'User updated', user: userToUpdate });
  } catch (error) {
    next(error);
  }
};

const followUserController = async (req, res, next) => {
  const { userID } = req.params;
  const { _ID } = req.body;

  try {
    if (userID === _ID) {
      throw new CustomError('You cannot follow yourself', 500);
    }

    const userToFollow = await User.findById(userID);
    const loggedInUser = await User.findById(_ID);

    if (!userToFollow || !loggedInUser) {
      throw new CustomError('User not found', 404);
    }

    if (loggedInUser.following.includes(userID)) {
      throw new CustomError('You already follow this user', 400);
    } else {
      await loggedInUser.updateOne({ $push: { following: userID } });
      await userToFollow.updateOne({ $push: { followers: _ID } });
    }

    await loggedInUser.save();
    await userToFollow.save();

    res.status(200).json({ message: 'User followed' });
  } catch (error) {
    next(error);
  }
};

const unfollowUserController = async (req, res, next) => {
  const { userID } = req.params;
  const { _ID } = req.body;

  try {
    if (userID === _ID) {
      throw new CustomError('You cannot unfollow yourself', 500);
    }

    const userToUnfollow = await User.findById(userID);
    const loggedInUser = await User.findById(_ID);

    if (!userToUnfollow || !loggedInUser) {
      throw new CustomError('User not found', 404);
    }

    if (!loggedInUser.following.includes(userID)) {
      throw new CustomError('You do not follow this user', 400);
    } else {
      await loggedInUser.updateOne({ $pull: { following: userID } });
      await userToUnfollow.updateOne({ $pull: { followers: _ID } });
    }

    loggedInUser.following = loggedInUser.following.filter(
      (id) => id.toString() !== userID.toString()
    );
    userToUnfollow.followers = userToUnfollow.followers.filter(
      (id) => id.toString() !== _ID.toString()
    );

    await loggedInUser.save();
    await userToUnfollow.save();

    res.status(200).json({ message: 'User unfollowed' });
  } catch (error) {
    next(error);
  }
};

const blockUserController = async (req, res, next) => {
  const { userID } = req.params;
  const { _ID } = req.body;

  try {
    if (userID === _ID) {
      throw new CustomError('You cannot block yourself', 500);
    }

    const userToBlock = await User.findById(userID);
    const loggedInUser = await User.findById(_ID);

    if (!userToBlock || !loggedInUser) {
      throw new CustomError('User not found', 404);
    }

    if (loggedInUser.blocked.includes(userID)) {
      throw new CustomError('You already blocked this user', 400);
    }

    loggedInUser.blocked.push(userID);
    loggedInUser.following = loggedInUser.following.filter(
      (id) => id.toString() !== userID.toString()
    );
    userToBlock.followers = userToBlock.followers.filter(
      (id) => id.toString() !== _ID.toString()
    );

    await loggedInUser.save();
    await userToBlock.save();

    res.status(200).json({ message: 'User blocked' });
  } catch (error) {
    next(error);
  }
};

const unblockUserController = async (req, res, next) => {
  const { userID } = req.params;
  const { _ID } = req.body;

  try {
    if (userID === _ID) {
      throw new CustomError('You cannot unblock yourself', 500);
    }

    const userToUnblock = await User.findById(userID);
    const loggedInUser = await User.findById(_ID);

    if (!userToUnblock || !loggedInUser) {
      throw new CustomError('User not found', 404);
    }

    if (loggedInUser.blocked.includes(userID)) {
      throw new CustomError('You already unblocked this user', 400);
    }

    loggedInUser.blocked = loggedInUser.blocked.filter(
      (id) => id.toString() !== userID.toString()
    );

    await loggedInUser.save();
    await userToUnblock.save();

    res.status(200).json({ message: 'User unblocked' });
  } catch (error) {
    next(error);
  }
};

const getBlockedUsersController = async (req, res, next) => {
  const { user_ID } = req.params;
  try {
    const user = await User.findById(user_ID).populate(
      'blocked',
      'userName',
      'email',
      'fullName',
      'bio',
      'profilePicture',
      'coverPicture',
      'followers',
      'following'
    );
    if (!user) {
      throw new CustomError('User not found', 404);
    }
    const { blocked, ...data } = user._doc;
    res.status(200).json(blocked);
  } catch (error) {
    next(error);
  }
};

const deleteUserController = async (req, res, next) => {
  const { user_ID } = req.params;

  try {
    const userToDelete = await User.findById(user_ID);

    if (!userToDelete) {
      throw new CustomError('User not found', 404);
    }

    await Post.deleteMany({ user: user_ID });
    await Post.deleteMany({ 'comments.user': user_ID });
    await Post.deleteMany({ 'comments.replies.user': user_ID });
    await Comment.deleteMany({ user: user_ID });
    await Story.deleteMany({ user: user_ID });
    await Post.updateMany({ likes: user_ID }, { $pull: { likes: user_ID } });

    await User.updateMany(
      { _id: { $in: userToDelete.following } },
      { $pull: { followers: user_ID } }
    );

    await Comment.updateMany({ user: user_ID }, { $pull: { user: user_ID } });
    await Comment.updateMany(
      { 'replies.user': user_ID },
      { $pull: { 'replies.$.user': user_ID } }
    );

    await Post.updateMany({}, { $pull: { likes: user_ID } });

    const replyComments = await Comment.find({ 'replies.user': user_ID });

    await Promise.all(
      replyComments.map(async (comment) => {
        comment.replies = comment.replies.filter(
          (reply) => reply.user.toString() !== user_ID.toString()
        );
        await comment.save();
      })
    );

    await userToDelete.deleteOne();

    res.status(200).json({ message: 'User deleted' });
  } catch (error) {
    next(error);
  }
};

const searchUsersController = async (req, res, next) => {
  const { query } = req.params;

  try {
    const users = await User.find({
      $or: [
        { userName: { $regex: new RegExp(query, 'i') } },
        { fullName: { $regex: new RegExp(query, 'i') } },
      ],
    });

    res.status(200).json(users);
  } catch (error) {
    next(error);
  }
};

const generateFileUrl = (filename) => {
  return process.env.URL + `/uploads/${filename}`;
};
const uploadProfilePictureController = async (req, res, next) => {
  const { userID } = req.params;
  const { filename } = req.file;
  try {
    const user = await User.findOneAndUpdate(
      userID,
      { profilePicture: generateFileUrl(filename) },
      { new: true }
    );
    if (!user) {
      throw new CustomError('User not found', 404);
    }
    res.status(200).json({ message: 'Profile Pictue updated', user });
  } catch (error) {
    nedxt(error);
  }
};
module.exports = {
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
};
