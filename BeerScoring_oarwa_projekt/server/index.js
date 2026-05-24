const mongoose = require('mongoose');
const express = require('express');
require('dotenv').config();
const beerRoutes = require('./routes/beers');
const reviewRoutes = require('./routes/reviews');
const authRoutes = require('./routes/auth');
const protectedRoutes = require('./routes/protected');
const cors = require('cors');

const app = express();
const PORT = process.env.PORT || 5000;
const MONGODB_URI = process.env.MONGODB_URI || 'mongodb://127.0.0.1:27017/BeerScoring';
const CLIENT_ORIGIN = process.env.CLIENT_ORIGIN || 'http://localhost:5173';

app.use(cors({
  origin: CLIENT_ORIGIN,
  credentials: true
}));

app.use(express.json());

app.use('/api/beers', beerRoutes);
app.use('/api/reviews', reviewRoutes);
app.use('/api/auth', authRoutes);
app.use('/api/private', protectedRoutes);

async function startServer() {
  try {
    await mongoose.connect(MONGODB_URI, {
      serverSelectionTimeoutMS: 5000,
    });
    console.log(`MongoDB connected: ${mongoose.connection.name}`);

    app.listen(PORT, () => {
      console.log(`Server is running on port ${PORT}`);
    });
  } catch (err) {
    console.error('MongoDB connection failed:', err.message);
    console.error(`Connection string used: ${MONGODB_URI.replace(/\/\/([^:]+):([^@]+)@/, '//<user>:<password>@')}`);
    process.exit(1);
  }
}

startServer();
