const mongoose = require('mongoose');

const uri = process.env.MONGO_URI;

if (!uri) {
  throw new Error('MONGO_URI environment variable is not defined.');
}

mongoose
  .connect(uri, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then(() => {
    console.log('Connected to MongoDB');
  })
  .catch((err) => {
    console.error('Failed to connect to MongoDB:', err.message);
  });
