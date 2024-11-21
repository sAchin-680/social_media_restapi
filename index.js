const express = require('express');
require('express-async-errors');

const connectDB = require('./config/db');
const dotenv = require('dotenv');
const cookieParser = require('cookie-parser');
const autthRoute = require('./routes/auth');

dotenv.config();

const app = express();

app.use(express.json());
app.use(cookieParser());
app.use('/api/auth', autthRoute);

connectDB();

app.use(express.json());
app.listen(5000, () => {
  console.log(`Server is running on port ${5000}`);
});
