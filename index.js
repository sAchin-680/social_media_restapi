const express = require('express');

const connectDB = require('./config/db');
const dotenv = require('dotenv');

const autthRoute = require('./routes/auth');

dotenv.config();

const app = express();

app.use(express.json());
app.use('/api/auth', autthRoute);

connectDB();

app.use(express.json());
app.listen(5000, () => {
  console.log(`Server is running on port ${5000}`);
});
