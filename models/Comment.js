const mongoose = require('mongoose');
const comentSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
  },
  post: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Post',
    required: true,
  },
  text: {
    type: String,
    required: true,
    text: true,
  },
  likes: {
    type: mongoose.Schema.Types.ObjectId,
    default: 0,
    ref: 'User',
  },
  replies: [
    {
      user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
      },
      text: {
        type: String,
        required: true,
        text: true,
      },
      likes: {
        type: mongoose.Schema.Types.ObjectId,
        default: 0,
        ref: 'User',
      },
    },
  ],
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

const Comment = mongoose.model('Comment', comentSchema);

module.exports = comment;
