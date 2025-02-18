import React, { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom"; // Import useNavigate
import Navbar from "../components/Navbar";
import { FaShoppingCart, FaHeart } from 'react-icons/fa';
import "../styles/Home.css";

function Home() {
  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState([
    { name: "All", image: "./image3.png" },
    { name: "Electronics", image: "./image4.png" },
    { name: "Clothing", image: "./image2.png" },
    { name: "Home & Kitchen", image: "./image1.png" },
    { name: "Books", image: "./image6.png" },
    { name: "Beauty", image: "./image5.png" },
  ]);
  const [selectedCategory, setSelectedCategory] = useState("All");
  const [searchQuery, setSearchQuery] = useState(""); // Search state

  const heroImages = ["./hero.png", "./hero1.png", "./hero2.png"];
  const [currentSlide, setCurrentSlide] = useState(0);
  const navigate = useNavigate(); // Initialize navigate

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const response = await fetch(`${import.meta.env.VITE_API_URL}/api/products`);
        if (response.ok) {
          const data = await response.json();
          setProducts(data);
        } else {
          console.error("Failed to fetch products");
        }
      } catch (error) {
        console.error("Error fetching products:", error);
      }
    };

    fetchProducts();

    const slideInterval = setInterval(() => {
      setCurrentSlide((prevSlide) => (prevSlide + 1) % heroImages.length);
    }, 3000);

    return () => clearInterval(slideInterval);
  }, []);

  // **Filter products based on category & search query**
  const filteredProducts = products.filter((product) => {
    return (
      (selectedCategory === "All" || product.category === selectedCategory) &&
      product.name.toLowerCase().includes(searchQuery.toLowerCase())
    );
  });

  const addToCart = (product) => {
    const token = localStorage.getItem('token');
    
    if (!token) {
      alert('Please login to add products to your cart.');
      navigate('/login');
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
  
    // Trigger a custom event to notify other components of the cart update
    window.dispatchEvent(new Event('cartUpdated'));
  
    alert('Product added to cart!');
  };
  

  const removeFromCart = (product) => {
    let cart = JSON.parse(localStorage.getItem('cart')) || [];
  
    // Find index of the product to remove
    const productIndex = cart.findIndex(item => item._id === product._id);
  
    if (productIndex > -1) {
      // Remove the product from the cart
      cart.splice(productIndex, 1);
      localStorage.setItem('cart', JSON.stringify(cart));
  
      // Trigger the cartUpdated event to update cart count in Navbar
      window.dispatchEvent(new Event('cartUpdated'));
  
      alert('Product removed from cart!');
    }
  };

  const addToWishlist = (product) => {
    const token = localStorage.getItem('token');
  
    if (!token) {
      alert('Please login to add products to your wishlist.');
      navigate('/login');
      return;
    }
  
    let wishlist = JSON.parse(localStorage.getItem('wishlist')) || [];
    const existingProduct = wishlist.find(item => item._id === product._id);
  
    if (existingProduct) {
      alert('Product is already in your wishlist!');
      return;
    }
  
    wishlist.push(product);
    localStorage.setItem('wishlist', JSON.stringify(wishlist));
  
    // Trigger a custom event to notify other components of the wishlist update
    window.dispatchEvent(new Event('wishlistUpdated'));
  
    alert('Product added to wishlist!');
  };

  return (
    <div className="home-page">
      <Navbar searchQuery={searchQuery} setSearchQuery={setSearchQuery} />

      {/* Categories Section */}
      <div className="categories">
        {categories.map((category) => (
          <div
            key={category.name}
            className={`category-item ${selectedCategory === category.name ? "active" : ""}`}
            onClick={() => setSelectedCategory(category.name)}
          >
            <img src={category.image} alt={category.name} className="category-image" />
            <span className="category-name">{category.name}</span>
          </div>
        ))}
      </div>

      {/* Hero Section */}
      <div className="hero-section">
        <button
          className="prev-slide"
          onClick={() => setCurrentSlide((prev) => (prev - 1 + heroImages.length) % heroImages.length)}
        >
          &lt;
        </button>
        <img src={heroImages[currentSlide]} alt="Hero Slide" className="hero-image" />
        <button
          className="next-slide"
          onClick={() => setCurrentSlide((prev) => (prev + 1) % heroImages.length)}
        >
          &gt;
        </button>
      </div>

      <div className="dots-container">
        {heroImages.map((_, index) => (
          <div
            key={index}
            className={`dot ${currentSlide === index ? "active" : ""}`}
            onClick={() => setCurrentSlide(index)}
          />
        ))}
      </div>

      {/* Product List */}
      <div className="product-list">
        {filteredProducts.length > 0 ? (
          filteredProducts.map((product) => (
            <div key={product._id} className="product-card">
              <img src={product.image} alt={product.name} className="product-image" />
              <h3 className="product-name">{product.name}</h3>
              <p className="product-description">
                {product.description.length > 50
                  ? `${product.description.slice(0, 50)}...`
                  : product.description}
              </p>
              <p className="product-price">Rs. {product.price}</p>
              <button className="add-to-cart" onClick={() => addToCart(product)}> <FaShoppingCart /> Add to Cart</button>
              <button className="add-to-wishlist" onClick={() => addToWishlist(product)}><FaHeart /> Add to Wishlist</button>
            </div>
          ))
        ) : (
          <p className="no-products">No products found.</p>
        )}
      </div>
    </div>
  );
}

export default Home;
