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
module.exports = { getUserController, updateUserController };
