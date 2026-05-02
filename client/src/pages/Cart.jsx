// src/pages/Cart.jsx
import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import toast from 'react-hot-toast';
import { Trash2, Minus, Plus, ShoppingBag, Ticket, X, Percent } from 'lucide-react';

const Cart = () => {
  const [cart, setCart] = useState(null);
  const [loading, setLoading] = useState(true);
  const [appliedCoupon, setAppliedCoupon] = useState(null);
  const [discount, setDiscount] = useState(0);
  const [couponCode, setCouponCode] = useState('');
  const [applyingCoupon, setApplyingCoupon] = useState(false);
  const { isAuthenticated } = useAuth();
  const navigate = useNavigate();

  const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';

  useEffect(() => {
    if (!isAuthenticated) {
      navigate('/login');
      return;
    }
    fetchCart();
    // Check for applied coupon from localStorage
    const savedCoupon = localStorage.getItem('appliedCoupon');
    if (savedCoupon) {
      try {
        const coupon = JSON.parse(savedCoupon);
        setAppliedCoupon(coupon);
        // Calculate discount
        calculateDiscount(coupon);
      } catch (error) {
        console.error('Error parsing coupon:', error);
      }
    }
  }, [isAuthenticated]);

  const fetchCart = async () => {
    try {
      const response = await axios.get(`${API_URL}/cart`);
      setCart(response.data);
    } catch (error) {
      console.error('Fetch cart error:', error);
      toast.error('Failed to load cart');
    } finally {
      setLoading(false);
    }
  };

  const calculateDiscount = (coupon) => {
    if (!cart) return;
    let discountAmount = 0;
    const subtotal = cart.totalPrice;

    if (coupon.type === 'percentage') {
      discountAmount = (subtotal * coupon.value) / 100;
      if (coupon.maxDiscount > 0 && discountAmount > coupon.maxDiscount) {
        discountAmount = coupon.maxDiscount;
      }
    } else if (coupon.type === 'fixed') {
      discountAmount = coupon.value;
      if (discountAmount > subtotal) {
        discountAmount = subtotal;
      }
    } else if (coupon.type === 'combo') {
      if (coupon.comboPrice > 0) {
        discountAmount = subtotal - coupon.comboPrice;
        if (discountAmount < 0) discountAmount = 0;
      }
    }

    setDiscount(discountAmount);
  };

  const handleApplyCoupon = async () => {
    if (!couponCode.trim()) {
      toast.error('Please enter a coupon code');
      return;
    }

    setApplyingCoupon(true);
    try {
      const response = await axios.post(`${API_URL}/coupons/validate`, {
        code: couponCode,
        cartTotal: cart.totalPrice
      });

      if (response.data.valid) {
        setAppliedCoupon(response.data.coupon);
        setDiscount(response.data.discount);
        localStorage.setItem('appliedCoupon', JSON.stringify(response.data.coupon));
        toast.success(`Coupon ${couponCode} applied!`);
        setCouponCode('');
      }
    } catch (error) {
      toast.error(error.response?.data?.message || 'Invalid coupon');
    } finally {
      setApplyingCoupon(false);
    }
  };

  const handleRemoveCoupon = () => {
    setAppliedCoupon(null);
    setDiscount(0);
    localStorage.removeItem('appliedCoupon');
    toast.success('Coupon removed');
  };

  const updateQuantity = async (itemId, newQuantity) => {
    if (newQuantity < 1) return;
    try {
      await axios.put(`${API_URL}/cart/${itemId}`, { quantity: newQuantity });
      // Refresh cart and recalculate discount
      await fetchCart();
      if (appliedCoupon) {
        calculateDiscount(appliedCoupon);
      }
    } catch (error) {
      console.error('Update cart error:', error);
      toast.error('Failed to update cart');
    }
  };

  const removeItem = async (itemId) => {
    try {
      await axios.delete(`${API_URL}/cart/${itemId}`);
      await fetchCart();
      if (appliedCoupon) {
        calculateDiscount(appliedCoupon);
      }
      toast.success('Item removed from cart');
    } catch (error) {
      console.error('Remove item error:', error);
      toast.error('Failed to remove item');
    }
  };

  const clearCart = async () => {
    try {
      await axios.delete(`${API_URL}/cart`);
      await fetchCart();
      setAppliedCoupon(null);
      setDiscount(0);
      localStorage.removeItem('appliedCoupon');
      toast.success('Cart cleared');
    } catch (error) {
      console.error('Clear cart error:', error);
      toast.error('Failed to clear cart');
    }
  };

  const handleCheckout = () => {
    navigate('/checkout');
  };

  const getSubtotal = () => {
    if (!cart) return 0;
    return cart.totalPrice;
  };

  const getTax = () => {
    return getSubtotal() * 0.10;
  };

  const getFinalTotal = () => {
    const subtotal = getSubtotal();
    const tax = getTax();
    const total = subtotal + tax - discount;
    return total > 0 ? total : 0;
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-black text-white flex items-center justify-center pt-20">
        <div className="text-2xl animate-pulse">Loading cart...</div>
      </div>
    );
  }

  if (!cart || cart.items.length === 0) {
    return (
      <div className="min-h-screen bg-black text-white pt-20">
        <div className="container mx-auto px-4 py-20 text-center">
          <ShoppingBag className="w-24 h-24 mx-auto mb-6 text-gray-600" />
          <h2 className="text-3xl font-bold mb-4">Your cart is empty</h2>
          <p className="text-gray-400 mb-8">Add some delicious items from our menu!</p>
          <button
            onClick={() => navigate('/menu')}
            className="bg-amber-600 hover:bg-amber-700 text-white px-8 py-3 rounded-full font-semibold transition-all"
          >
            Browse Menu
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-black text-white pt-20">
      <div className="container mx-auto px-4 py-12">
        <h1 className="text-4xl md:text-5xl font-bold mb-8 text-center bg-gradient-to-r from-amber-400 to-amber-600 bg-clip-text text-transparent">
          Your Cart
        </h1>

        <div className="grid lg:grid-cols-3 gap-8">
          {/* Cart Items */}
          <div className="lg:col-span-2">
            <div className="bg-gray-900/80 rounded-2xl p-6 backdrop-blur-sm border border-gray-800">
              {cart.items.map((item) => (
                <div
                  key={item._id}
                  className="flex items-center gap-4 py-4 border-b border-gray-800 last:border-0"
                >
                  <img
                    src={item.product.image}
                    alt={item.product.name}
                    className="w-20 h-20 object-cover rounded-xl"
                  />
                  <div className="flex-1">
                    <h3 className="font-bold">{item.product.name}</h3>
                    <p className="text-sm text-gray-400">
                      ₹{item.product.price.toFixed(2)} each
                    </p>
                  </div>
                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => updateQuantity(item._id, item.quantity - 1)}
                      className="p-1 rounded-full hover:bg-gray-800 transition-colors"
                    >
                      <Minus className="w-4 h-4" />
                    </button>
                    <span className="w-8 text-center">{item.quantity}</span>
                    <button
                      onClick={() => updateQuantity(item._id, item.quantity + 1)}
                      className="p-1 rounded-full hover:bg-gray-800 transition-colors"
                    >
                      <Plus className="w-4 h-4" />
                    </button>
                  </div>
                  <div className="text-right">
                    <p className="font-bold text-amber-400">
                      ₹{(item.product.price * item.quantity).toFixed(2)}
                    </p>
                    <button
                      onClick={() => removeItem(item._id)}
                      className="text-red-400 hover:text-red-500 transition-colors mt-1"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              ))}
            </div>
            
            <div className="mt-4 flex justify-end">
              <button
                onClick={clearCart}
                className="text-red-400 hover:text-red-500 transition-colors text-sm"
              >
                Clear Cart
              </button>
            </div>
          </div>

          {/* Cart Summary */}
          <div className="lg:col-span-1">
            <div className="bg-gray-900/80 rounded-2xl p-6 backdrop-blur-sm border border-gray-800 sticky top-24">
              <h2 className="text-xl font-bold mb-4">Order Summary</h2>
              
              {/* Coupon Section */}
              <div className="mb-4">
                {appliedCoupon ? (
                  <div className="bg-green-500/10 border border-green-500/30 rounded-xl p-3 mb-3">
                    <div className="flex justify-between items-start">
                      <div>
                        <p className="font-bold text-green-400">{appliedCoupon.code}</p>
                        <p className="text-xs text-gray-400">{appliedCoupon.description}</p>
                        <p className="text-sm text-green-400">- ₹{discount.toFixed(2)}</p>
                      </div>
                      <button
                        onClick={handleRemoveCoupon}
                        className="p-1 hover:bg-red-500/20 rounded-full transition-colors"
                      >
                        <X className="w-4 h-4 text-red-400" />
                      </button>
                    </div>
                  </div>
                ) : (
                  <div className="flex gap-2 mb-3">
                    <input
                      type="text"
                      value={couponCode}
                      onChange={(e) => setCouponCode(e.target.value.toUpperCase())}
                      placeholder="Enter coupon code"
                      className="flex-1 px-3 py-2 bg-gray-800 border border-gray-700 rounded-xl focus:outline-none focus:border-amber-500 text-white text-sm"
                    />
                    <button
                      onClick={handleApplyCoupon}
                      disabled={applyingCoupon}
                      className="bg-green-600 hover:bg-green-700 px-3 py-2 rounded-xl text-sm font-semibold transition-all disabled:opacity-50 whitespace-nowrap"
                    >
                      {applyingCoupon ? '...' : 'Apply'}
                    </button>
                  </div>
                )}
              </div>

              {/* Price Breakdown */}
              <div className="space-y-2 mb-4">
                <div className="flex justify-between text-gray-400 text-sm">
                  <span>Subtotal</span>
                  <span>₹{getSubtotal().toFixed(2)}</span>
                </div>
                <div className="flex justify-between text-gray-400 text-sm">
                  <span>Tax (10%)</span>
                  <span>₹{getTax().toFixed(2)}</span>
                </div>
                {discount > 0 && (
                  <div className="flex justify-between text-green-400 text-sm">
                    <span>Discount</span>
                    <span>- ₹{discount.toFixed(2)}</span>
                  </div>
                )}
                <div className="border-t border-gray-800 pt-2 mt-2">
                  <div className="flex justify-between font-bold text-lg">
                    <span>Total</span>
                    <span className="text-amber-400">
                      ₹{getFinalTotal().toFixed(2)}
                    </span>
                  </div>
                </div>
              </div>

              <button
                onClick={handleCheckout}
                className="w-full bg-amber-600 hover:bg-amber-700 text-white py-3 rounded-full font-semibold transition-all transform hover:scale-105"
              >
                Proceed to Checkout
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Cart;