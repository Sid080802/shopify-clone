import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { FaEye, FaEyeSlash } from 'react-icons/fa';
import "../styles/Login.css";
import Navbar from "../components/Navbar";

function Login({ loginUser }) { // Receiving loginUser function from App.jsx
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    console.log('Submitting login request:', { email, password });

    try {
      const response = await axios.post(
        `${import.meta.env.VITE_API_URL}/api/auth/login`,
        { email, password },
        { headers: { 'Content-Type': 'application/json' } }
      );

      if (response.data.user && response.data.token) {
        localStorage.setItem('user', JSON.stringify(response.data.user)); // Save user data
        localStorage.setItem('token', response.data.token); // Save token

        console.log('Login response:', response.data);
        alert('Login successful');
        loginUser(response.data.user); // Notify App.jsx about the successful login
        navigate('/'); // Navigate to the home page after login
      } else {
        throw new Error('User data not returned');
      }
    } catch (err) {
      console.error('Login error:', err.response ? err.response.data : err.message);
      setError(err.response?.data?.message || 'Invalid email or password');
    }
  };

  return (
    <div> <Navbar />
    <div className="login-container">

      <h2 className="login-heading">Login</h2>
      {error && <p className="error-message">{error}</p>}
      <form className="login-form" onSubmit={handleSubmit}>
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
            <span 
              className="eye-icon" 
              onClick={() => setShowPassword(!showPassword)}
            >
              {showPassword ? <FaEyeSlash /> : <FaEye />}
            </span>
          </div>
        </div>
        <button className="submit-button" type="submit">Login</button>
      </form>
      <p className="signup-link">Don't have an account? <a href="/api/auth/signup">Sign up</a></p>
    </div>
    </div>
  );
}

export default Login;
