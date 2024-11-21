const express = require('express');
const connectDB = require('./config/db');
const dotenv = require('dotenv');
dotenv.config();
const app = express();
connectDB();

app.use(express.json());
app.listen(5000, () => {
  console.log(`Server is running on port ${5000}`);
});
