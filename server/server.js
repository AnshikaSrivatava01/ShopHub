require('dotenv').config({ path: './server/.env' });

const express = require('express');
const cors = require('cors');
const mongoose = require('mongoose');
const auth=require('./middleware/auth');

// DB connection
const connectDB = require('./config/db');
connectDB();

// Disable mongoose buffering
mongoose.set('bufferCommands', false);

const app = express();

// Middleware
app.use(cors());
app.use(express.json());

// ✅ TEST ROUTE
app.get('/api/test', (req, res) => {
  res.json({ message: "API working perfectly 🚀" });
});

// Routes
app.use('/api/auth', require('./routes/auth'));
app.use('/api/products', require('./routes/products'));
app.use('/api/orders', require('./routes/orders'));
app.use('/api/reviews', require('./routes/reviews'));
app.use('/api/payments', require('./routes/payments'));
app.use('/api/wishlist', require('./routes/wishlist'));

// Root route
app.get('/', (req, res) => {
  res.send('ShopHub API is running...');
});

// Port
const PORT = process.env.PORT || 5001;

// Start server
app.listen(PORT, () => {
  console.log(`🚀 ShopHub API Server running on port ${PORT}`);
});
