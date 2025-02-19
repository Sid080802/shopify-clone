// src/pages/Signup.jsx
import React, { useState, useRef } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { FaEye, FaEyeSlash } from 'react-icons/fa';
import "../styles/Signup.css";
import Navbar from "../components/Navbar";

function Signup() {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const navigate = useNavigate();
  const timeoutId = useRef(null); // useRef to store timeout across re-renders

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const response = await axios.post(`${import.meta.env.VITE_API_URL}/api/auth/signup`, { name, email, password });

      if (response.status === 201) {
        localStorage.setItem('token', response.data.token);
        localStorage.setItem('user', JSON.stringify(response.data.user)); // Store user data
        alert('Account created successfully!');
        navigate('/login'); // Redirect to home page
      }
    } catch (err) {
      console.error('Signup Error:', err.response?.data?.message || err.message);
      setError(err.response?.data?.message || 'Signup failed. Please try again.');
    }
  };

  const handleEyeClick = () => {
    setShowPassword((prev) => !prev);

    // Automatically hide the password after 3 seconds
    if (!showPassword) {
      timeoutId.current = setTimeout(() => {
        setShowPassword(false);
      }, 3000);
    } else {
      clearTimeout(timeoutId.current);
    }
  };

  return (
    <div> <Navbar />
    <div className="signup-container">
      <h2 className="signup-heading">Sign Up</h2>
      {error && <p className="error-message">{error}</p>}
      <form className="signup-form" onSubmit={handleSubmit}>
        <div className="form-group">
          <label className="label">Name:</label>
          <input
            className="input-field"
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
            required
          />
        </div>
        <div className="form-group">
          <label className="label">Email:</label>
          <input
            className="input-field"
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />
        </div>
        <div className="form-group">
          <label className="label">Password:</label>
          <div className="password-container">
            <input
              className="input-field"
              type={showPassword ? 'text' : 'password'}
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
            <span className="eye-icon" onClick={handleEyeClick}>
              {showPassword ? <FaEyeSlash /> : <FaEye />}
            </span>
          </div>
        </div>
        <button className="submit-button" type="submit">Sign Up</button>
      </form>
      <p className="login-link">
  Already have an account? <span onClick={() => navigate('/login')} style={{ cursor: 'pointer', color: 'blue', textDecoration: 'underline' }}>Login</span>
</p>
    </div>
    </div>
  );
}

export default Signup;
