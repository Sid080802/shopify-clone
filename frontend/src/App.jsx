import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate,
} from "react-router-dom";
import React, { useState, useEffect } from "react";
import Home from "./pages/Home";
import Cart from "./pages/Cart";
import Login from "./pages/Login";
import Profile from "./pages/Profile";
import Signup from "./pages/Signup";
import AddProduct from "./pages/AddProduct"; // Import AddProduct
import Wishlist from "./pages/Wishlist";


const App = () => {
  const [user, setUser] = useState(null); // Stores the logged-in user data

  useEffect(() => {
    const token = localStorage.getItem("token");
    const storedUser = localStorage.getItem("user");

    // If the user is logged in (token exists)
    if (token && storedUser) {
      setUser(JSON.parse(storedUser)); // Set user data from localStorage
    } else {
      setUser(null); // If no token, reset user state
    }
  }, []);

  const loginUser = (userData) => {
    setUser(userData);
    localStorage.setItem("token", userData.token); // Store token
    localStorage.setItem("user", JSON.stringify(userData)); // Store user data
  };

  const logoutUser = () => {
    setUser(null);
    localStorage.removeItem("token"); // Remove token
    localStorage.removeItem("user"); // Remove user data
  };

  return (
    <Router>
      <Routes>
        {/* Home Page is accessible by everyone */}
        <Route path="/" element={<Home />} />

        {/* Login Route */}
        <Route path="/login" element={<Login loginUser={loginUser} />} />

        {/* Signup Route */}
        <Route path="/signup" element={<Signup />} />

        {/* AddProduct Route - Only accessible if logged in */}
        <Route path="/add-product" element={<AddProduct />} />

        {/* Protected Routes */}
        <Route path="/cart" element={<Cart />} />

        <Route path="/wishlist" element={<Wishlist />} />

        <Route
          path="/profile"
          element={
            user ? (
              <Profile logoutUser={logoutUser} />
            ) : (
              <Navigate to="/login" />
            )
          }
        />
      </Routes>
    </Router>
  );
};

export default App;
