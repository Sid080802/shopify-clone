import React, { useState, useEffect } from 'react';
import Navbar from '../components/Navbar';
import { FaShoppingCart, FaHeart } from 'react-icons/fa';
import "../styles/Wishlist.css";

function Wishlist() {
  const [wishlist, setWishlist] = useState([]);

  useEffect(() => {
    // Get the wishlist from localStorage
    const storedWishlist = JSON.parse(localStorage.getItem('wishlist')) || [];
    setWishlist(storedWishlist);
  }, []);

  const removeFromWishlist = (product) => {
    let updatedWishlist = wishlist.filter(item => item._id !== product._id);
    setWishlist(updatedWishlist);
    localStorage.setItem('wishlist', JSON.stringify(updatedWishlist));
    alert('Product removed from wishlist!');
  };

  const addToCartFromWishlist = (product) => {
    const token = localStorage.getItem('token');
  
    if (!token) {
      alert('Please login to add products to your cart.');
      return;
    }
  
    let cart = JSON.parse(localStorage.getItem('cart')) || [];
    const existingProduct = cart.find(item => item._id === product._id);
  
    if (existingProduct) {
      alert('Product already in cart!');
      return;
    }
  
    cart.push(product);
    localStorage.setItem('cart', JSON.stringify(cart));
  
    alert('Product added to cart from wishlist!');
  };

  return (
    <div className="wishlist-page">
      <Navbar />

      <div className="wishlist-container">
        <h2>Your Wishlist</h2>

        {wishlist.length > 0 ? (
          <div className="wishlist-items">
            {wishlist.map((product) => (
              <div key={product._id} className="wishlist-item">
                <img src={product.image} alt={product.name} className="wishlist-item-image" />
                <div className="wishlist-item-details">
                  <h3>{product.name}</h3>
                  <p>{product.description.length > 50 ? `${product.description.slice(0, 50)}...` : product.description}</p>
                  <p className="wishlist-item-price">Rs. {product.price}</p>
                </div>
                <div className="wishlist-item-actions">
                  <button
                    className="move-to-cart"
                    onClick={() => addToCartFromWishlist(product)}
                  >
                    <FaShoppingCart /> Move to Cart
                  </button>
                  <button
                    className="remove-from-wishlist"
                    onClick={() => removeFromWishlist(product)}
                  >
                    <FaHeart /> Remove
                  </button>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <p>Your wishlist is empty.</p>
        )}
      </div>
    </div>
  );
}

export default Wishlist;
