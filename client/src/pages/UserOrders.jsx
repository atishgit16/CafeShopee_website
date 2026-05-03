// src/pages/UserOrders.jsx
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { useAuth } from '../context/AuthContext';
import toast from 'react-hot-toast';
import { Package, Clock, CheckCircle, ArrowRight } from 'lucide-react';

const UserOrders = () => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const { isAuthenticated } = useAuth();
  const navigate = useNavigate();

  const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';

  useEffect(() => {
    if (!isAuthenticated) {
      toast.error('Please login to view your orders');
      navigate('/login');
      return;
    }
    fetchOrders();
  }, [isAuthenticated]);

  const fetchOrders = async () => {
    try {
      // Get token from localStorage
      const token = localStorage.getItem('token');
      
      if (!token) {
        toast.error('Please login to view your orders');
        navigate('/login');
        return;
      }

      // Make request with Authorization header
      const response = await axios.get(`${API_URL}/orders/my-orders`, {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });
      
      setOrders(response.data);
    } catch (error) {
      console.error('Fetch orders error:', error);
      if (error.response?.status === 401) {
        toast.error('Session expired. Please login again.');
        navigate('/login');
      } else {
        toast.error('Failed to load orders');
      }
    } finally {
      setLoading(false);
    }
  };

  const getStatusColor = (status) => {
    switch(status) {
      case 'pending': return 'bg-yellow-500/20 text-yellow-500';
      case 'confirmed': return 'bg-blue-500/20 text-blue-500';
      case 'preparing': return 'bg-purple-500/20 text-purple-500';
      case 'ready': return 'bg-green-500/20 text-green-500';
      case 'delivered': return 'bg-green-600/20 text-green-600';
      case 'cancelled': return 'bg-red-500/20 text-red-500';
      default: return 'bg-gray-500/20 text-gray-500';
    }
  };

  const getStatusIcon = (status) => {
    switch(status) {
      case 'pending': return <Clock className="w-4 h-4" />;
      case 'confirmed': return <CheckCircle className="w-4 h-4" />;
      case 'preparing': return <Package className="w-4 h-4" />;
      case 'ready': return <CheckCircle className="w-4 h-4" />;
      case 'delivered': return <Package className="w-4 h-4" />;
      default: return <Clock className="w-4 h-4" />;
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-black text-white flex items-center justify-center pt-20">
        <div className="text-center">
          <div className="text-4xl mb-4 animate-pulse">📦</div>
          <div className="text-xl text-gray-400 animate-pulse">Loading your orders...</div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-black to-gray-900 text-white pt-20 pb-12">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 max-w-4xl">
        <h1 className="text-3xl md:text-4xl font-bold mb-8 bg-gradient-to-r from-amber-400 to-amber-600 bg-clip-text text-transparent">
          My Orders
        </h1>

        {orders.length === 0 ? (
          <div className="bg-gray-900/80 rounded-2xl p-12 backdrop-blur-sm border border-gray-800 text-center">
            <Package className="w-16 h-16 mx-auto text-gray-600 mb-4" />
            <h3 className="text-xl font-bold mb-2">No orders yet</h3>
            <p className="text-gray-400">Start ordering from our menu!</p>
            <button
              onClick={() => navigate('/menu')}
              className="mt-4 bg-amber-600 hover:bg-amber-700 text-white px-6 py-2 rounded-full font-semibold transition-all"
            >
              Browse Menu
            </button>
          </div>
        ) : (
          <div className="space-y-4">
            {orders.map((order) => (
              <div
                key={order._id}
                className="bg-gray-900/80 rounded-2xl p-6 backdrop-blur-sm border border-gray-800 hover:border-amber-500/30 transition-all"
              >
                <div className="flex flex-col md:flex-row justify-between items-start md:items-center">
                  <div>
                    <h3 className="font-bold text-lg">Order #{order._id?.slice(-6)}</h3>
                    <p className="text-sm text-gray-400">
                      {new Date(order.createdAt).toLocaleDateString('en-US', {
                        year: 'numeric',
                        month: 'short',
                        day: 'numeric',
                        hour: '2-digit',
                        minute: '2-digit'
                      })}
                    </p>
                    <div className="mt-1 flex items-center gap-2">
                      <span className="text-xs text-gray-400">
                        {order.items?.length || 0} items
                      </span>
                      <span className="text-xs text-gray-400">•</span>
                      <span className="text-xs text-amber-400">
                        ₹{order.totalAmount?.toFixed(2)}
                      </span>
                    </div>
                  </div>
                  <div className="mt-2 md:mt-0 flex items-center gap-3">
                    <span className={`flex items-center gap-1 px-3 py-1 rounded-full text-xs font-medium ${getStatusColor(order.orderStatus)}`}>
                      {getStatusIcon(order.orderStatus)}
                      {order.orderStatus?.toUpperCase()}
                    </span>
                    <button
                      onClick={() => navigate(`/order-tracking/${order._id}`)}
                      className="text-amber-400 hover:text-amber-300 text-sm flex items-center gap-1 transition-colors"
                    >
                      Track Order
                      <ArrowRight className="w-3 h-3" />
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default UserOrders;