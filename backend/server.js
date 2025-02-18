const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const dotenv = require('dotenv');
const authRoutes = require('./routes/auth');  // Import auth routes
const productRoutes = require('./routes/product');  // Import product routes
const cartRoutes = require('./routes/Cart');  // Import cart routes

dotenv.config(); // Load environment variables

const app = express();

// CORS Configuration - Allow frontend app (React) to communicate with this server
const corsOptions = {
  origin: 'http://localhost:5173', // React frontend URL
  methods: 'GET,POST,PUT,DELETE', // Allow more methods
  allowedHeaders: 'Content-Type,Authorization',
};
app.use(cors(corsOptions));

// Middleware to parse JSON bodies
app.use(express.json());

// API Routes
app.use('/api/auth', authRoutes);       // Authentication routes
app.use('/api/products', productRoutes); // Product-related routes
app.use('/api/cart', cartRoutes);        // Cart-related routes

// Root route
app.get('/', (req, res) => {
  res.send('Shopify Clone Backend is running 🚀');
});

// MongoDB Connection with Error Handling
mongoose.connect(process.env.MONGO_URI)
  .then(() => console.log('✅ MongoDB connected successfully'))
  .catch((err) => {
    console.error('❌ MongoDB connection error:', err);
    process.exit(1); // Exit the process if DB connection fails
  });

// Start the server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`🚀 Server running on port ${PORT}`);
});
