// src/pages/Menu.jsx
import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useCart } from '../context/CartContext';
import toast from 'react-hot-toast';
import { ShoppingCart, Plus } from 'lucide-react';

const Menu = () => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedCategory, setSelectedCategory] = useState('All');
  const { isAuthenticated } = useAuth();
  const { addToCart } = useCart(); // Get addToCart from CartContext
  const navigate = useNavigate();

  const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';

  useEffect(() => {
    fetchProducts();
  }, []);

  const fetchProducts = async () => {
    try {
      const response = await axios.get(`${API_URL}/products`);
      setProducts(response.data);
    } catch (error) {
      console.error('Fetch products error:', error);
      toast.error('Failed to load products');
    } finally {
      setLoading(false);
    }
  };

  const handleAddToCart = async (productId) => {
    if (!isAuthenticated) {
      toast.error('Please login to add items to cart');
      navigate('/login');
      return;
    }

    const success = await addToCart(productId);
    if (success) {
      // No need to do anything else - CartContext handles the refresh
      // The cart badge will update automatically
    }
  };

  const categories = ['All', ...new Set(products.map(p => p.category))];
  const filteredProducts = selectedCategory === 'All' 
    ? products 
    : products.filter(p => p.category === selectedCategory);

  if (loading) {
    return (
      <div className="min-h-screen bg-black text-white flex items-center justify-center pt-20">
        <div className="text-2xl animate-pulse">Loading menu...</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-black text-white pt-20">
      {/* Hero Section */}
      <div className="relative py-20 bg-gradient-to-b from-black to-gray-900">
        <div className="container mx-auto px-4 text-center">
          <h1 className="text-5xl md:text-7xl font-bold mb-4 bg-gradient-to-r from-amber-400 to-amber-600 bg-clip-text text-transparent">
            Our Menu
          </h1>
          <p className="text-xl text-gray-400 max-w-2xl mx-auto">
            Crafted with passion, served with love. Explore our signature blends and favorites.
          </p>
        </div>
      </div>

      {/* Category Filter */}
      <div className="container mx-auto px-4 py-8">
        <div className="flex flex-wrap justify-center gap-4 mb-12">
          {categories.map((category) => (
            <button
              key={category}
              onClick={() => setSelectedCategory(category)}
              className={`px-6 py-2 rounded-full text-sm font-medium transition-colors ${
                selectedCategory === category
                  ? 'bg-amber-600 text-white'
                  : 'bg-gray-800 text-gray-400 hover:bg-gray-700'
              }`}
            >
              {category}
            </button>
          ))}
        </div>

        {/* Products Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {filteredProducts.map((product) => (
            <div
              key={product._id}
              className="group bg-gray-900/80 rounded-2xl overflow-hidden hover:scale-105 transition-all duration-300 border border-gray-800 hover:border-amber-500/30"
            >
              <div className="relative h-48 overflow-hidden">
                <img
                  src={product.image}
                  alt={product.name}
                  className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                />
                {product.stock === 0 && (
                  <div className="absolute inset-0 bg-black/60 flex items-center justify-center">
                    <span className="text-red-400 font-bold">Out of Stock</span>
                  </div>
                )}
              </div>
              <div className="p-4">
                <h3 className="text-lg font-bold text-white mb-1">{product.name}</h3>
                <p className="text-sm text-gray-400 mb-3 line-clamp-2">{product.description}</p>
                <div className="flex justify-between items-center">
                  <span className="text-xl font-bold text-amber-400">
                    ₹{product.price.toFixed(2)}
                  </span>
                  <button
                    onClick={() => handleAddToCart(product._id)}
                    disabled={product.stock === 0}
                    className={`p-2 rounded-full transition-colors ${
                      product.stock === 0
                        ? 'bg-gray-700 cursor-not-allowed'
                        : 'bg-amber-600 hover:bg-amber-700'
                    }`}
                  >
                    <Plus className="w-5 h-5 text-white" />
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>

        {filteredProducts.length === 0 && (
          <div className="text-center py-12">
            <p className="text-gray-400">No products found in this category.</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default Menu;