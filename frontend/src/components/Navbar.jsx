import { Link } from 'react-router-dom';
import './Navbar.css'; // Custom CSS for minimal tweaks
import '@fortawesome/fontawesome-free/css/all.min.css';
import { useEffect, useState } from 'react';

function Navbar({ searchQuery, setSearchQuery }) {
  const [cartCount, setCartCount] = useState(0);

  // Function to update the cart count
  const updateCartCount = () => {
    const cart = JSON.parse(localStorage.getItem('cart')) || [];
    setCartCount(cart.length);
  };

  // Update cart count when the page loads
  useEffect(() => {
    updateCartCount();

    // Listen for the cartUpdated event to update the cart count
    window.addEventListener('cartUpdated', updateCartCount);

    // Clean up the event listener when the component unmounts
    return () => {
      window.removeEventListener('cartUpdated', updateCartCount);
    };
  }, []);

  useEffect(() => {
    // Listen to the cartUpdated event to refresh the cart count
    const handleCartUpdated = () => {
      const cart = JSON.parse(localStorage.getItem('cart')) || [];
      setCartCount(cart.length); // Update your cart count state here
    };
  
    window.addEventListener('cartUpdated', handleCartUpdated);
  
    return () => {
      window.removeEventListener('cartUpdated', handleCartUpdated);
    };
  }, []);
  

  return (
    <nav className="navbar navbar-light bg-white shadow-sm">
      {/* Logo */}
      <Link to="/" className="navbar-logo">
        <i className="fab fa-shopify"></i> Shopify
      </Link>

      {/* Search Bar */}
      <div className="search-container">
        <i className="fas fa-search search-icon"></i>
        <input
          type="text"
          className="search-input"
          placeholder="Search products..."
          value={searchQuery} // Bind value to searchQuery state
          onChange={(e) => setSearchQuery(e.target.value)} // Update searchQuery on change
        />
      </div>

      {/* Navbar Icons */}
      <div className="navbar-icons">
        <Link to="/cart" className="navbar-link">
        {cartCount > 0 && <span className="cart-count">{cartCount}</span>} {/* Show cart count */}
          <i className="fas fa-shopping-cart"></i> 
          
          Cart
         
        </Link>
        <Link to="/wishlist" className="navbar-link">
          <i className="fas fa-heart"></i> Wishlist
        </Link>
        <Link to="/profile" className="navbar-link">
          <i className="fas fa-user"></i> Profile
        </Link>
      </div>
    </nav>
  );
}

export default Navbar;
