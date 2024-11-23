const express = require('express');
require('express-async-errors');
const dotenv = require('dotenv');
const cookieParser = require('cookie-parser');
const connectDB = require('./config/db');
const authRoute = require('./routes/auth');
const userRoute = require('./routes/users');
const path = require('path');
const postRoute = require('./routes/posts');
const commentRoute = require('./routes/comments');
const storiesRoute = require('./routes/stories');
const Conversation = require('./models/Conversation');
const Message = require('./models/Message');

// Middlwares
const { errorHandler } = require('./middlewares/error');

dotenv.config();

const app = express();

app.use(express.json());
app.use(cookieParser());

app.use('/uploads', express.static(path.join(__dirname, 'uploads')));
app.use(errorHandler);

connectDB();

app.use('/api/users', userRoute);
app.use('/api/auth', authRoute);
app.use('/api/posts', postRoute);
app.use('/api/comments', commentRoute);
app.use('/api/stories', storiesRoute);
app.use('/api/conversations', verifyToken, conversationRoute);
app.use('/api/messages', verifyToken, messageRoute);

const PORT = 5000;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
