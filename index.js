const express = require('express');
const connectDB = require('./config/db');
const app = express();
const dotenv = require('dotenv');
const PORT = process.env.PORT || 5000;
const authRoute = require('./routes/auth');

app.use(express.json());
app.use('/api/auth', authRoute);
dotenv.config();

connectDB();

app.listen(PORT, () => {
  console.log('Server is running on port 5000');
});
