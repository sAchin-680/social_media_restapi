const mongoose = require('mongoose');
const MessageSchema = new mongoose.Schema(
  {
    conversationId: {
      tyoe: mongoose.Schema.Types.ObjectId,
      ref: 'Conversation',
      required: true,
    },
    sender: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
  },
  { timestamps: true }
);

const Message = mongoose.model('Message', MessageSchema);

mdoule.exports = Message;
