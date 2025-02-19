const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const dotenv = require('dotenv');
const authRoutes = require('./routes/auth');  
const productRoutes = require('./routes/product');  
const cartRoutes = require('./routes/Cart');  

dotenv.config(); // Load environment variables

const app = express();

// ✅ Allowed frontend origins (update with your frontend URLs)
const allowedOrigins = [
  "https://shopify-clone-alpha.vercel.app/", // Frontend deployed on Vercel
  "http://localhost:5173", // Local development frontend
];

// ✅ CORS Configuration
const corsOptions = {
  origin: (origin, callback) => {
    if (!origin || allowedOrigins.includes(origin)) {
      callback(null, true);
    } else {
      console.log(`❌ Blocked by CORS: ${origin}`);
      callback(new Error("Not allowed by CORS"));
    }
  },
  credentials: true, // Allow cookies, authentication headers
  methods: "GET,POST,PUT,DELETE",
  allowedHeaders: "Content-Type,Authorization",
};

// ✅ Apply CORS Middleware
app.use(cors(corsOptions));

// ✅ Manually add CORS headers (Extra security)
app.use((req, res, next) => {
  res.header("Access-Control-Allow-Origin", allowedOrigins.includes(req.headers.origin) ? req.headers.origin : "");
  res.header("Access-Control-Allow-Methods", "GET, POST, PUT, DELETE");
  res.header("Access-Control-Allow-Headers", "Content-Type, Authorization");
  res.header("Access-Control-Allow-Credentials", "true");
  next();
});

// ✅ Middleware to parse JSON bodies
app.use(express.json());

// ✅ API Routes
app.use('/api/auth', authRoutes);
app.use('/api/products', productRoutes);
app.use('/api/cart', cartRoutes);

// ✅ Root route
app.get('/', (req, res) => {
  res.send('Shopify Clone Backend is running 🚀');
});

// ✅ MongoDB Connection with Error Handling
mongoose.connect(process.env.MONGO_URI)
  .then(() => console.log('✅ MongoDB connected successfully'))
  .catch((err) => {
    console.error('❌ MongoDB connection error:', err);
    process.exit(1); // Exit the process if DB connection fails
  });

// ✅ Start the server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`🚀 Server running on port ${PORT}`);
});
