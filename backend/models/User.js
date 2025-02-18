const mongoose = require('mongoose');

const userSchema = new mongoose.Schema(
  {
    name: { type: String, required: true, trim: true },
    email: { 
      type: String, 
      required: true, 
      unique: true, 
      trim: true, 
      lowercase: true,
      match: [/^\S+@\S+\.\S+$/, 'Invalid email format'], // Email validation
    },
    password: { type: String, required: true, minlength: [6, 'Password must be at least 6 characters'] },
  },
  { timestamps: true } // Automatically adds createdAt and updatedAt
);

const User = mongoose.model('User', userSchema);
module.exports = User;
