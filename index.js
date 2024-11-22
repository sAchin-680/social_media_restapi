const express = require('express');
require('express-async-errors');
const dotenv = require('dotenv');
const cookieParser = require('cookie-parser');
const connectDB = require('./config/db');
const authRoute = require('./routes/auth');
const userRoute = require('./routes/users');

// Middlwares
const { errorHandler } = require('./middlewares/error');

dotenv.config();

const app = express();

app.use(express.json());
app.use(cookieParser());
app.use(errorHandler);

connectDB();

app.use('/api/users', userRoute);
app.use('/api/auth', authRoute);

const PORT = 5000;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
