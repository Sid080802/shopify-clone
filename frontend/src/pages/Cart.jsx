import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom'; 
import Navbar from "../components/Navbar";
import "../styles/Cart.css";

const Cart = () => {
  const [cartItems, setCartItems] = useState([]);
  const [totalPrice, setTotalPrice] = useState(0);
  const navigate = useNavigate();

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (!token) {
      navigate('/login');
    } else {
      const storedCart = localStorage.getItem('cart');
      if (storedCart) {
        const items = JSON.parse(storedCart);
        const updatedItems = items.map(item => ({
          ...item,
          quantity: item.quantity || 1, 
        }));
        setCartItems(updatedItems);
        updateTotalPrice(updatedItems);
      }
    }
  }, [navigate]);
  

  // Update the total price when quantity or cart items change
  const updateTotalPrice = (items) => {
    const total = items.reduce((acc, item) => {
      const price = parseFloat(item.price);
      const quantity = parseInt(item.quantity, 10);
      if (!isNaN(price) && !isNaN(quantity)) {
        return acc + price * quantity;
      }
      return acc;
    }, 0);
    setTotalPrice(total);
  };

  const handleQuantityChange = (productId, operation) => {
    const updatedCart = cartItems.map(item => {
      if (item._id === productId) {
        const newQuantity = operation === 'increase' ? item.quantity + 1 : item.quantity - 1;
        if (newQuantity > 0) {
          item.quantity = newQuantity;
        }
      }
      return item;
    });
    setCartItems(updatedCart);
    localStorage.setItem('cart', JSON.stringify(updatedCart)); // Update localStorage with new cart
    updateTotalPrice(updatedCart); // Recalculate the total price
  };

  const removeFromCart = (productId) => {
    const updatedCart = cartItems.filter(item => item._id !== productId);
    setCartItems(updatedCart);
    localStorage.setItem('cart', JSON.stringify(updatedCart)); // Update localStorage with new cart
    updateTotalPrice(updatedCart); // Recalculate the total price
  
    // Trigger the cartUpdated event to notify other components of the cart update
    window.dispatchEvent(new Event('cartUpdated'));
  };
  

  const handleBuyNow = () => {
    alert("Your order has been placed successfully!");
  };

  return (
    <div className="cart-page">
      <Navbar />
      <div className="cart-header">
        <h2>Your Cart</h2>
      </div>
      <div className="cart-container">
        <div className="cart-items-container">
          {cartItems.length === 0 ? (
            <p className="empty-cart-message">Your cart is empty.</p>
          ) : (
            cartItems.map((item) => (
              <div key={item._id} className="cart-item">
                <img src={item.image} alt={item.name} className="cart-item-image" />
                <div className="cart-item-details">
                  <h3 className="cart-item-name">{item.name}</h3>
                  <p className="cart-item-price">Price: Rs. {item.price}</p>

                  <div className="quantity-container">
                    <button 
                      className="quantity-btn"
                      onClick={() => handleQuantityChange(item._id, 'decrease')}
                    >
                      -
                    </button>
                    <span className="quantity">{item.quantity}</span>
                    <button 
                      className="quantity-btn"
                      onClick={() => handleQuantityChange(item._id, 'increase')}
                    >
                      +
                    </button>
                  </div>

                  <p className="item-total-price">
                    Total: Rs. {item.price * item.quantity}
                  </p>

                  <button 
                    className="remove-btn" 
                    onClick={() => removeFromCart(item._id)}
                  >
                    Remove
                  </button>
                </div>
              </div>
            ))
          )}
        </div>

        {/* Show Total and Buy Now only when cart is not empty */}
        {cartItems.length > 0 && (
          <div className="cart-total-container">
            <div className="cart-total">
              <h3>Total Price: Rs. {totalPrice}</h3>
              <button 
                className="buy-btn" 
                onClick={handleBuyNow}
              >
                Buy Now
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default Cart;