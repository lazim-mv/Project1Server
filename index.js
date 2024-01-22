const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
require('dotenv').config();

const app = express();

const mongoString = process.env.DATABASE_URL;

mongoose.connect(mongoString, {
  dbName: 'UsedBikeDB',
});

const database = mongoose.connection;

database.on('error', (error) => {
  console.log(error);
});

database.once('open', () => {
  console.log('Database Connected');
});

app.use(express.json({ limit: '50mb' }));
app.use(cors());

// Import the routes from the 'products' module
const { router: authRoutes, User } = require('./UserLogin/auth'); 
const productsRoutes = require('./AddProduct/products');

// Use the routes in your app
app.use('/admin', authRoutes)
app.use('/products', productsRoutes);

// Add a simple route to test if the server is running

const PORT = process.env.PORT || 3001;

app.listen(PORT, () => {
  console.log(`Server Started at ${PORT}`);
});
