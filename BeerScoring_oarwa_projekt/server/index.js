const mongoose = require('mongoose');
const express = require('express');
const beerRoutes = require('./routes/beers');
const reviewRoutes = require('./routes/reviews');
const authRoutes = require('./routes/auth');

const app = express();

// Spajanje na MongoDB bazu
mongoose.connect('mongodb://127.0.0.1:27017/BeerScoring')
    .then(() => console.log('MongoDB connected'))
    .catch(err => console.log(err));

// Instanca konekcije na bazu
const db = mongoose.connection;

// Upravljanje događajima
db.on('error', (error) => {
  console.error('Greška pri spajanju:', error);
});

db.once('open', () => {
  console.log('Spojeni smo na MongoDB bazu');
});

app.use(express.json());

// Set up routes
app.use('/api/beers', beerRoutes);
app.use('/api/reviews', reviewRoutes);
app.use('/api/auth', authRoutes);

app.listen(5000, () => {
  console.log('Server is running on port 5000');
});
