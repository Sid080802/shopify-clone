// src/pages/Profile.jsx
import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Navbar from '../components/Navbar';
import "../styles/Profile.css";

function Profile() {
  const [user, setUser] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    const token = localStorage.getItem('token');
    const storedUser = localStorage.getItem('user'); // Get user data from localStorage

    // Check if there's no token or no user data in localStorage
    if (!token || !storedUser) {
      navigate('/login'); // Redirect to login if no token or user found
    } else {
      try {
        setUser(JSON.parse(storedUser)); // Try to parse the user data
      } catch (error) {
        console.error("Error parsing user data:", error);
        setUser(null); // If parsing fails, reset user to null
      }
    }
  }, [navigate]);

  const logout = () => {
    localStorage.removeItem('token'); // Remove token
    localStorage.removeItem('user');  // Remove user data
    navigate('/'); // Redirect to login page
  };

  if (!user) {
    return <p>Loading...</p>;
  }

  return (
    <div>
    <Navbar />
    <div className="profile-container">
    
      <h2 className="profile-welcome">Welcome, {user.name}</h2>
      <p className="profile-email">Email: {user.email}</p>
      <button className="profile-logout-btn" onClick={logout}>Logout</button> {/* Logout Button */}
    </div>
    </div>
  );
}

export default Profile;
