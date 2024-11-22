const User = require('../models/User');

const getUserController = async (req, res, next) => {
  const { userID } = req.params;
  try {
    const user = await User.findById(userID);
    if (!user) {
      throw new Error('User not found', 404);
    }
    const { password, ...rest } = user._doc;
    res.status(200).json(data._doc);
  } catch (error) {
    next(error);
  }
};

const updateUserController = async (req, res, next) => {
  const { userID } = req.params;
  const updateData = req.body;
  try {
    const userToUpdate = await User.findById(userID);
    if (!usertoUpdate) {
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
    const user = await User.findById(userID);
    const loggedUser = await User.findById(_ID);

    if (!userToFollow || !loggedUser) {
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
module.exports = {
  getUserController,
  updateUserController,
  followUserController,
};
