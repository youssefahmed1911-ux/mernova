// db.js: connects the backend to our MongoDB Atlas database.
// server.js loads the .env file first (require('dotenv').config()),
// then calls connectDB() before it starts listening on port 3000.

const mongoose = require('mongoose');

const connectDB = async () => {
  // The connection string comes from .env, never from the code itself.
  const uri = process.env.MONGODB_URI;

  if (!uri) {
    console.error('MONGODB_URI is missing. Create backend/.env from backend/.env.example.');
    process.exit(1);
  }

  try {
    await mongoose.connect(uri);
    console.log('MongoDB connected');
  } catch (error) {
    console.error('MongoDB connection failed:', error.message);
    process.exit(1); // stop the server: the app cannot work without its database
  }
};

module.exports = connectDB;
