// src/context/CartContext.jsx
import React, { createContext, useState, useContext, useEffect } from 'react';
import axios from 'axios';
import { useAuth } from './AuthContext';
import toast from 'react-hot-toast';

const CartContext = createContext();

export const useCart = () => {
  const context = useContext(CartContext);
  if (!context) {
    throw new Error('useCart must be used within CartProvider');
  }
  return context;
};

export const CartProvider = ({ children }) => {
  const [cart, setCart] = useState(null);
  const [cartCount, setCartCount] = useState(0);
  const [loading, setLoading] = useState(true);
  const { isAuthenticated } = useAuth();

  const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';

  useEffect(() => {
    if (isAuthenticated) {
      fetchCart();
    } else {
      setCart(null);
      setCartCount(0);
      setLoading(false);
    }
  }, [isAuthenticated]);

  const fetchCart = async () => {
    try {
      const token = localStorage.getItem('token');
      const response = await axios.get(`${API_URL}/cart`, {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });
      setCart(response.data);
      
      // Calculate total items
      const totalItems = response.data.items.reduce((sum, item) => sum + item.quantity, 0);
      setCartCount(totalItems);
      return response.data;
    } catch (error) {
      console.error('Fetch cart error:', error);
    } finally {
      setLoading(false);
    }
  };

  const addToCart = async (productId, quantity = 1) => {
    try {
      const token = localStorage.getItem('token');
      await axios.post(`${API_URL}/cart/add`, 
        { productId, quantity },
        {
          headers: {
            'Authorization': `Bearer ${token}`
          }
        }
      );
      toast.success('Added to cart!');
      // Refresh cart data immediately
      await fetchCart();
      return true;
    } catch (error) {
      console.error('Add to cart error:', error);
      toast.error('Failed to add to cart');
      return false;
    }
  };

  const updateQuantity = async (itemId, quantity) => {
    try {
      const token = localStorage.getItem('token');
      await axios.put(`${API_URL}/cart/${itemId}`, 
        { quantity },
        {
          headers: {
            'Authorization': `Bearer ${token}`
          }
        }
      );
      await fetchCart(); // Refresh cart data
      toast.success('Cart updated');
    } catch (error) {
      console.error('Update cart error:', error);
      toast.error('Failed to update cart');
    }
  };

  const removeItem = async (itemId) => {
    try {
      const token = localStorage.getItem('token');
      await axios.delete(`${API_URL}/cart/${itemId}`, {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });
      await fetchCart(); // Refresh cart data
      toast.success('Item removed from cart');
    } catch (error) {
      console.error('Remove item error:', error);
      toast.error('Failed to remove item');
    }
  };

  const clearCart = async () => {
    try {
      const token = localStorage.getItem('token');
      await axios.delete(`${API_URL}/cart`, {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });
      await fetchCart(); // Refresh cart data
      toast.success('Cart cleared');
    } catch (error) {
      console.error('Clear cart error:', error);
      toast.error('Failed to clear cart');
    }
  };

  const value = {
    cart,
    cartCount,
    loading,
    addToCart,
    updateQuantity,
    removeItem,
    clearCart,
    fetchCart
  };

  return (
    <CartContext.Provider value={value}>
      {children}
    </CartContext.Provider>
  );
};