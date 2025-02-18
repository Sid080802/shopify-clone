import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom'; // To redirect after adding a product
import Navbar from '../components/Navbar';
import "../styles/AddProduct.css";

function AddProduct() {
  const navigate = useNavigate();

  // State to hold form values
  const [product, setProduct] = useState({
    name: '',
    description: '',
    price: '',
    image: '',
    category: 'Electronics', // Default category
  });

  const [loading, setLoading] = useState(false); // To manage form submission state
  const [error, setError] = useState(null); // To handle errors

  // Handle input changes
  const handleChange = (e) => {
    const { name, value } = e.target;
    setProduct({
      ...product,
      [name]: value,
    });
  };

  // Handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault();

    // Simple validation for price to ensure it's a positive number
    if (product.price <= 0) {
      alert('Please enter a valid price.');
      return;
    }

    // Create the product object to send to the backend
    const newProduct = {
      name: product.name,
      description: product.description,
      price: parseFloat(product.price), // Ensure price is a number
      image: product.image,
      category: product.category,
    };

    setLoading(true); // Set loading state to true

    try {
      // Send a POST request to the server to add the product to the database
      const response = await fetch(`${import.meta.env.VITE_API_URL}/api/products`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(newProduct),
      });

      if (response.ok) {
        // If the request was successful, clear the form and redirect to the homepage
        setProduct({
          name: '',
          description: '',
          price: '',
          image: '',
          category: 'Electronics',
        });
        navigate('/home');
      } else {
        // Handle error if the request failed
        setError('Failed to add product.');
      }
    } catch (error) {
      console.error('Error:', error);
      setError('Error adding product. Please try again.');
    } finally {
      setLoading(false); // Set loading state to false after request completion
    }
  };

  return (
    <div>
      <Navbar />
      <div className="add-product-page">
        <div className="add-product-form-container">
          <h2 className="form-title">Add New Product</h2>
          <form onSubmit={handleSubmit} className="product-form">
            <label className="form-label">
              Title:
              <input
                type="text"
                name="name"
                value={product.name}
                onChange={handleChange}
                required
                className="form-input"
              />
            </label>
            <label className="form-label">
              Description:
              <textarea
                name="description"
                value={product.description}
                onChange={handleChange}
                required
                className="form-textarea"
              />
            </label>
            <label className="form-label">
              Image URL:
              <input
                type="text"
                name="image"
                value={product.image}
                onChange={handleChange}
                required
                className="form-input"
              />
            </label>
            <label className="form-label">
              Category:
              <select
                name="category"
                value={product.category}
                onChange={handleChange}
                required
                className="form-select"
              >
                <option value="Electronics">Electronics</option>
                <option value="Clothing">Clothing</option>
                <option value="Home & Kitchen">Home & Kitchen</option>
                <option value="Books">Books</option>
                <option value="Beauty">Beauty</option>
              </select>
            </label>
            <label className="form-label">
              Price:
              <input
                type="number"
                name="price"
                value={product.price}
                onChange={handleChange}
                required
                min="0"
                className="form-input"
              />
            </label>

            <button type="submit" className="submit-btn" disabled={loading}>
              {loading ? 'Adding Product...' : 'Add Product'}
            </button>
          </form>

          {/* Display error message if any */}
          {error && <div className="error-message">{error}</div>}
        </div>
      </div>
    </div>
  );
}

export default AddProduct;
