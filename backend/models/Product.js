const mongoose = require('mongoose');

const productSchema = new mongoose.Schema(
  {
    name: { type: String, required: true, trim: true },
    description: { type: String, required: true, trim: true },
    price: { type: Number, required: true, min: [0, 'Price must be a positive number'] },
    category: { 
      type: String, 
      required: true,
      enum: ['Electronics', 'Clothing', 'Home & Kitchen', 'Books', 'Beauty'], // Optional
    },
    image: { 
      type: String, 
      required: true, 
      validate: {
        validator: function(v) {
          return /^(http|https):\/\/[^ "]+$/.test(v);
        },
        message: 'Invalid image URL format',
      },
    },
  },
  { timestamps: true } // Automatically adds createdAt and updatedAt fields
);

const Product = mongoose.model('Product', productSchema);
module.exports = Product;
