// src/pages/OrderTracking.jsx
import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';
import { useAuth } from '../context/AuthContext';
import toast from 'react-hot-toast';
import { 
  Package, 
  CheckCircle, 
  Clock, 
  Truck, 
  Store, 
  ArrowLeft,
  MapPin
} from 'lucide-react';

const OrderTracking = () => {
  const { orderId } = useParams();
  const { isAuthenticated } = useAuth();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [order, setOrder] = useState(null);
  const [trackingTimeline, setTrackingTimeline] = useState([]);
  const [currentStatus, setCurrentStatus] = useState('');

  const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';

  useEffect(() => {
    if (!isAuthenticated) {
      toast.error('Please login to track your order');
      navigate('/login');
      return;
    }
    fetchOrderTracking();
  }, [orderId, isAuthenticated]);

  const fetchOrderTracking = async () => {
    try {
      // Get token from localStorage
      const token = localStorage.getItem('token');
      
      if (!token) {
        toast.error('Please login to track your order');
        navigate('/login');
        return;
      }

      // Make request with Authorization header
      const response = await axios.get(`${API_URL}/orders/${orderId}/tracking`, {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });
      
      setOrder(response.data.order);
      setTrackingTimeline(response.data.trackingTimeline);
      setCurrentStatus(response.data.currentStatus);
    } catch (error) {
      console.error('Fetch tracking error:', error);
      toast.error('Failed to load order tracking');
      navigate('/');
    } finally {
      setLoading(false);
    }
  };

  const getStatusIcon = (status) => {
    switch(status.toLowerCase()) {
      case 'order received':
        return <Package className="w-6 h-6 text-blue-400" />;
      case 'order confirmed':
        return <CheckCircle className="w-6 h-6 text-green-400" />;
      case 'preparing':
        return <Clock className="w-6 h-6 text-yellow-400" />;
      case 'ready':
        return <Store className="w-6 h-6 text-purple-400" />;
      case 'delivered':
        return <Truck className="w-6 h-6 text-green-500" />;
      default:
        return <Clock className="w-6 h-6 text-gray-400" />;
    }
  };

  const getStatusColor = (status) => {
    switch(status.toLowerCase()) {
      case 'order received':
        return 'border-blue-400';
      case 'order confirmed':
        return 'border-green-400';
      case 'preparing':
        return 'border-yellow-400';
      case 'ready':
        return 'border-purple-400';
      case 'delivered':
        return 'border-green-500';
      default:
        return 'border-gray-400';
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-black text-white flex items-center justify-center pt-20">
        <div className="text-center">
          <div className="text-4xl mb-4 animate-pulse">📦</div>
          <div className="text-xl text-gray-400 animate-pulse">Loading order tracking...</div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-black to-gray-900 text-white pt-20 pb-12">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 max-w-4xl">
        <div className="flex items-center gap-4 mb-8">
          <button
            onClick={() => navigate('/')}
            className="p-2 rounded-full hover:bg-gray-800 transition-colors"
          >
            <ArrowLeft className="w-6 h-6" />
          </button>
          <h1 className="text-3xl md:text-4xl font-bold bg-gradient-to-r from-amber-400 to-amber-600 bg-clip-text text-transparent">
            Order Tracking
          </h1>
        </div>

        {/* Order Summary */}
        <div className="bg-gray-900/80 rounded-2xl p-6 backdrop-blur-sm border border-gray-800 mb-8">
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center">
            <div>
              <h2 className="text-xl font-bold">Order #{order?._id?.slice(-6)}</h2>
              <p className="text-gray-400 text-sm">
                Placed on {new Date(order?.createdAt).toLocaleDateString('en-US', {
                  year: 'numeric',
                  month: 'long',
                  day: 'numeric',
                  hour: '2-digit',
                  minute: '2-digit'
                })}
              </p>
            </div>
            <div className="mt-2 md:mt-0">
              <span className={`px-3 py-1 rounded-full text-xs font-medium ${
                currentStatus === 'delivered' ? 'bg-green-500/20 text-green-500' :
                currentStatus === 'pending' ? 'bg-yellow-500/20 text-yellow-500' :
                'bg-blue-500/20 text-blue-500'
              }`}>
                {currentStatus?.toUpperCase()}
              </span>
            </div>
          </div>

          <div className="mt-4 border-t border-gray-800 pt-4">
            <h3 className="text-sm font-medium text-gray-400 mb-2">Order Items</h3>
            <div className="space-y-2">
              {order?.items?.map((item, index) => (
                <div key={index} className="flex justify-between text-sm">
                  <span className="text-gray-300">
                    {item.product?.name} × {item.quantity}
                  </span>
                  <span className="text-amber-400">
                    ₹{(item.price * item.quantity).toFixed(2)}
                  </span>
                </div>
              ))}
            </div>
            <div className="border-t border-gray-800 pt-2 mt-2 flex justify-between font-bold">
              <span>Total</span>
              <span className="text-amber-400">₹{order?.totalAmount?.toFixed(2)}</span>
            </div>
          </div>
        </div>

        {/* Tracking Timeline */}
        <div className="bg-gray-900/80 rounded-2xl p-6 backdrop-blur-sm border border-gray-800">
          <h2 className="text-xl font-bold mb-6">Tracking Timeline</h2>
          <div className="relative">
            {/* Vertical line */}
            <div className="absolute left-5 top-0 bottom-0 w-0.5 bg-gray-700"></div>
            
            <div className="space-y-6">
              {trackingTimeline.map((step, index) => (
                <div key={index} className="relative flex items-start gap-4">
                  {/* Circle on timeline */}
                  <div className={`relative z-10 w-10 h-10 rounded-full bg-gray-900 border-2 ${getStatusColor(step.status)} flex items-center justify-center`}>
                    {getStatusIcon(step.status)}
                  </div>
                  
                  {/* Content */}
                  <div className="flex-1">
                    <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center">
                      <h3 className="font-semibold text-lg">{step.status}</h3>
                      <span className="text-sm text-gray-400">
                        {new Date(step.timestamp).toLocaleDateString('en-US', {
                          month: 'short',
                          day: 'numeric',
                          hour: '2-digit',
                          minute: '2-digit'
                        })}
                      </span>
                    </div>
                    <p className="text-gray-400 text-sm mt-1">{step.description}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default OrderTracking;