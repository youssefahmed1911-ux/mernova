require('dotenv').config();

const express = require('express');
const connectDB = require('./db');

const app = express();

app.get('/api/health', (_req, res) => {
  res.status(200).json({ status: 'ok' });
});

async function startServer() {
  await connectDB();
  app.listen(3000, () => {
    console.log('Mernova backend listening on port 3000');
  });
}

startServer();