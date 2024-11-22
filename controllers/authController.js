const User = require('../models/User');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const { CustomError, errorHandler } = require('../middlewares/error');

const registerController = async (req, res, next) => {
  try {
    const { userName, email, password, fullName, bio } = req.body;

    if (!userName || !email || !password) {
      return res.status(400).json('All fields are required');
    }

    const existingUser = await User.findOne({
      $or: [{ userName }, { email }, { fullName }, { bio }],
    });

    if (existingUser) {
      throw new CustomError('User already exists', 400);
    }

    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    const newUser = new User({
      userName,
      email,
      fullName,
      bio,
      password: hashedPassword,
    });
    const savedUser = await newUser.save();

    return res.status(201).json(savedUser);
  } catch (error) {
    next(error);
  }
};

const loginController = async (req, res, next) => {
  try {
    const user = req.body.email
      ? await User.findOne({ email: req.body.email })
      : await User.findOne({ username: req.body.username });

    if (!user) {
      throw new CustomError('User not found', 404);
    }

    const match = await bcrypt.compare(req.body.password, user.password);
    if (!match) {
      throw new CustomError('Invalid credentials', 400);
    }

    const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, {
      expiresIn: '24h',
    });
    // console.log(token);

    const { password, ...data } = user.toObject();

    res.cookie('token', token, { httpOnly: true }).status(200).json(data);
  } catch (error) {
    next(error);
  }
};

const logoutController = async (req, res, next) => {
  try {
    res
      .clearCookie('token', { sameSite: 'none', secure: true })
      .status(200)
      .json('Logged out');
  } catch (error) {
    next(error);
  }
};

const currentUserController = async (req, res, next) => {
  const token = req.cookies.token;

  const data = await jwt.verify(
    token,
    process.env.JWT_SECRET,
    async (err, data) => {
      if (err) {
        throw new CustomError('User not found', 404);
      }

      try {
        const id = data.id;

        const user = await User.findByOne({ _id: id });

        res.status(200).json(user);
      } catch (error) {
        next(error);
      }
    }
  );
};

const updateController = async (req, res, next) => {
  const token = req.cookies.token;

  jwt.verify(token, process.env.JWT_SECRET, async (err, data) => {
    if (err) {
      throw new CustomError('Unauthorized', 401);
    }

    try {
      const { userName, email, fullName, bio } = req.body;
      const userId = data.id;

      const updatedUser = await User.findByIdAndUpdate(
        userId,
        updateData,
        { userName, email, fullName, bio },
        { new: true }
      );

      if (!updatedUser) {
        return res.status(404).json('User not found');
      }

      res.status(200).json(updatedUser);
    } catch (error) {
      next(error);
    }
  });
};

const deleteController = async (req, res, next) => {
  const token = req.cookies.token;

  jwt.verify(token, process.env.JWT_SECRET, async (err, data) => {
    if (err) {
      throw new CustomError('Unauthorized', 401);
    }

    try {
      const userId = data.id;
      const deletedUser = await User.findByIdAndDelete(userId);

      if (!deletedUser) {
        return res.status(404).json('User not found');
      }

      res.status(200).json('User deleted successfully');
    } catch (error) {
      next(error);
    }
  });
};

module.exports = {
  registerController,
  loginController,
  logoutController,
  currentUserController,
  updateController,
  deleteController,
};
