const express = require('express');
const connectDB = require('./config/db');
const app = express();
const dotenv = require('dotenv');
const PORT = process.env.PORT || 5000;
dotenv.config();

app.get('/', (req, res) => {
  res.send('Hello World!');
});

const posts = [
  {
    id: 1,
    title: 'First Post',
    content: 'This is the first post',
  },
  {
    id: 2,
    title: 'Second Post',
    content: 'This is the Second post',
  },
];

app.get('/posts', (req, res) => {
  res.json(posts);
});

app.get('/posts/:id', (req, res) => {
  const id = req.params.id;
  const post = posts.find((post) => post.id == id);

  if (!posts) {
    res.status(404).json({ error: 'Post not found' });
  }
  res.send(post);
});

app.post('/posts', (req, res) => {
  const title = 'new post';
  const content = 'new content';
  const newPost = {
    id: posts.length + 1,
    title,
    content,
  };
  posts.push(newPost);
  res.status(201).json(newPost);
});

connectDB();

app.listen(PORT, () => {
  console.log('Server is running on port 5000');
});
