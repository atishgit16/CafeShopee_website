// src/pages/OrderSuccess.jsx
import React from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { CheckCircle, Home, Coffee, Package } from 'lucide-react';

const OrderSuccess = () => {
  const navigate = useNavigate();
  const location = useLocation();
  
  // Get orderId from the URL query parameters or state
  const searchParams = new URLSearchParams(location.search);
  const orderId = searchParams.get('orderId') || '';

  return (
    <div className="min-h-screen bg-black text-white pt-20 flex items-center justify-center">
      <div className="text-center max-w-lg px-4 animate-fade-in-up">
        <div className="flex justify-center mb-6">
          <div className="w-24 h-24 bg-green-500/20 rounded-full flex items-center justify-center">
            <CheckCircle className="w-16 h-16 text-green-500" />
          </div>
        </div>
        
        <h1 className="text-4xl md:text-5xl font-bold mb-4 text-amber-400">
          Order Placed!
        </h1>
        
        <p className="text-xl text-gray-300 mb-2">
          Thank you for your order at BrewHeaven!
        </p>
        <p className="text-gray-400 mb-8">
          We'll send you a confirmation email shortly with your order details.
        </p>

        <div className="space-y-3">
          <button
            onClick={() => navigate('/')}
            className="block w-full bg-amber-600 hover:bg-amber-700 text-white px-6 py-3 rounded-full font-semibold transition-all transform hover:scale-105"
          >
            <Home className="w-5 h-5 inline mr-2" />
            Back to Home
          </button>
          <button
            onClick={() => navigate('/menu')}
            className="block w-full bg-gray-800 hover:bg-gray-700 text-white px-6 py-3 rounded-full font-semibold transition-all transform hover:scale-105"
          >
            <Coffee className="w-5 h-5 inline mr-2" />
            Order More
          </button>
          <button
            onClick={() => navigate(`/order-tracking/${orderId}`)}
            className="block w-full bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-full font-semibold transition-all transform hover:scale-105"
          >
            <Package className="w-5 h-5 inline mr-2" />
            Track Your Order
          </button>
        </div>
      </div>
    </div>
  );
};

export default OrderSuccess;