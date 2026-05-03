// src/pages/Checkout.jsx - Updated Version with Auto-Location
import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import toast from 'react-hot-toast';
import { 
  CreditCard, 
  MapPin, 
  Loader2, 
  Phone, 
  QrCode, 
  Wallet, 
  ArrowLeft, 
  Lock, 
  Copy, 
  Ticket,
  Store,
  Truck,
  Table,
  LocateFixed
} from 'lucide-react';
import { QRCodeSVG } from 'qrcode.react';
import { 
  CardElement, 
  useStripe, 
  useElements 
} from '@stripe/react-stripe-js';

const Checkout = () => {
  const [cart, setCart] = useState(null);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [orderType, setOrderType] = useState('dine-in');
  const [locations, setLocations] = useState([]);
  const [selectedLocation, setSelectedLocation] = useState('');
  const [tables, setTables] = useState([]);
  const [selectedTable, setSelectedTable] = useState('');
  const [paymentMethod, setPaymentMethod] = useState('card');
  const [cardDetails, setCardDetails] = useState({
    cardNumber: '',
    cardName: '',
    expiry: '',
    cvv: ''
  });
  const [upiId, setUpiId] = useState('');
  const [showUpiInput, setShowUpiInput] = useState(false);
  const [appliedCoupon, setAppliedCoupon] = useState(null);
  const [discount, setDiscount] = useState(0);
  const [isLoadingLocations, setIsLoadingLocations] = useState(false);
  const [stripeError, setStripeError] = useState(null);
  const [paymentIntentId, setPaymentIntentId] = useState(null);
  const [detectingLocation, setDetectingLocation] = useState(false);
  const [userCoordinates, setUserCoordinates] = useState(null);
  
  const stripe = useStripe();
  const elements = useElements();
  
  const DEFAULT_UPI_ID = 'brewheaven@upi';
  const { isAuthenticated } = useAuth();
  const navigate = useNavigate();

  const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';

  useEffect(() => {
    if (!isAuthenticated) {
      toast.error('Please login to checkout');
      navigate('/login');
      return;
    }
    fetchCart();
    fetchLocations();
    // Auto-detect location on load
    detectUserLocation();
    // Check for applied coupon
    const savedCoupon = localStorage.getItem('appliedCoupon');
    if (savedCoupon) {
      try {
        const coupon = JSON.parse(savedCoupon);
        setAppliedCoupon(coupon);
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
      if (response.data.items.length === 0) {
        toast.error('Your cart is empty');
        navigate('/menu');
      }
    } catch (error) {
      console.error('Fetch cart error:', error);
      toast.error('Failed to load cart');
    } finally {
      setLoading(false);
    }
  };

  const fetchLocations = async () => {
    setIsLoadingLocations(true);
    try {
      const response = await axios.get(`${API_URL}/locations`);
      setLocations(response.data);
    } catch (error) {
      console.error('Fetch locations error:', error);
      toast.error('Failed to load locations');
    } finally {
      setIsLoadingLocations(false);
    }
  };

  const fetchAvailableTables = async (locationId) => {
    try {
      const response = await axios.get(`${API_URL}/locations/${locationId}/tables`);
      setTables(response.data);
    } catch (error) {
      console.error('Fetch tables error:', error);
      toast.error('Failed to load available tables');
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

  const handleOrderTypeChange = (type) => {
    setOrderType(type);
    setSelectedLocation('');
    setSelectedTable('');
    setTables([]);
  };

  const handleLocationChange = (e) => {
    const locationId = e.target.value;
    setSelectedLocation(locationId);
    setSelectedTable('');
    if (locationId) {
      fetchAvailableTables(locationId);
    } else {
      setTables([]);
    }
  };

  const handleCardChange = (e) => {
    setCardDetails({
      ...cardDetails,
      [e.target.name]: e.target.value
    });
  };

  const detectUserLocation = () => {
    if (!navigator.geolocation) {
      toast.error('Geolocation is not supported by your browser');
      return;
    }

    setDetectingLocation(true);
    toast.loading('Detecting your location...');

    navigator.geolocation.getCurrentPosition(
      (position) => {
        toast.dismiss();
        const coords = {
          lat: position.coords.latitude,
          lng: position.coords.longitude
        };
        setUserCoordinates(coords);
        toast.success('Location detected successfully!');
        setDetectingLocation(false);
      },
      (error) => {
        toast.dismiss();
        console.error('Geolocation error:', error);
        toast.error('Unable to detect your location. Please try again.');
        setDetectingLocation(false);
      },
      {
        enableHighAccuracy: true,
        timeout: 15000,
        maximumAge: 0
      }
    );
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    // Validate based on order type
    if (orderType === 'dine-in') {
      if (!selectedLocation) {
        toast.error('Please select a location');
        return;
      }
      if (!selectedTable) {
        toast.error('Please select a table');
        return;
      }
    }

    if (orderType === 'delivery') {
      if (!userCoordinates) {
        toast.error('Location not detected. Please try again.');
        return;
      }
    }

    // Validate payment method
    if (paymentMethod === 'card') {
      if (!stripe || !elements) {
        toast.error('Payment system not ready');
        return;
      }
      
      if (!cardDetails.cardName) {
        toast.error('Please enter cardholder name');
        return;
      }
    }

    if (paymentMethod === 'upi' && !upiId.trim()) {
      toast.error('Please enter your UPI ID or use the QR code');
      return;
    }

    setSubmitting(true);
    setStripeError(null);

    try {
      let paymentIntentIdValue = null;
      let paymentStatus = 'pending';

      // Process card payment via Stripe
      if (paymentMethod === 'card') {
        const finalTotal = getFinalTotal();
        
        // Create payment intent first
        const paymentIntentResponse = await axios.post(`${API_URL}/payments/create-payment-intent`, {
          amount: finalTotal
        });

        const { clientSecret, paymentIntentId } = paymentIntentResponse.data;
        setPaymentIntentId(paymentIntentId);
        paymentIntentIdValue = paymentIntentId;

        // Confirm payment with card element
        const cardElement = elements.getElement(CardElement);
        const { error, paymentIntent } = await stripe.confirmCardPayment(clientSecret, {
          payment_method: {
            card: cardElement,
            billing_details: {
              name: cardDetails.cardName
            }
          }
        });

        if (error) {
          setStripeError(error.message);
          toast.error(error.message);
          setSubmitting(false);
          return;
        }

        paymentIntentIdValue = paymentIntent.id;
        paymentStatus = paymentIntent.status;
      }

      // Prepare order data
      const orderData = {
        orderType,
        paymentMethod,
        paymentIntentId: paymentIntentIdValue,
        paymentStatus,
        upiId: paymentMethod === 'upi' ? (upiId || DEFAULT_UPI_ID) : undefined,
        cardDetails: paymentMethod === 'card' ? cardDetails : undefined,
        coupon: appliedCoupon
      };

      if (orderType === 'dine-in') {
        orderData.locationId = selectedLocation;
        orderData.tableNumber = selectedTable;
      }

      if (orderType === 'delivery') {
        orderData.deliveryCoordinates = userCoordinates;
      }

      const orderResponse = await axios.post(`${API_URL}/orders`, orderData);
      
      localStorage.removeItem('appliedCoupon');
      
      if (orderResponse.data.redirectTo) {
        navigate(orderResponse.data.redirectTo);
      } else {
        navigate('/order-success');
      }
      
      toast.success('Order placed successfully!');
    } catch (error) {
      console.error('Place order error:', error);
      toast.error(error.response?.data?.message || 'Failed to place order');
    } finally {
      setSubmitting(false);
    }
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

  const formatCardNumber = (value) => {
    const v = value.replace(/\s/g, '').replace(/[^0-9]/gi, '');
    const matches = v.match(/\d{4,16}/g);
    const match = matches && matches[0] || '';
    const parts = [];
    for (let i = 0; i < match.length; i += 4) {
      parts.push(match.substring(i, i + 4));
    }
    if (parts.length) {
      return parts.join(' ');
    } else {
      return value;
    }
  };

  const handleCardNumberChange = (e) => {
    const formatted = formatCardNumber(e.target.value);
    setCardDetails({
      ...cardDetails,
      cardNumber: formatted
    });
  };

  const upiQrData = cart ? `upi://pay?pa=${DEFAULT_UPI_ID}&pn=BrewHeaven&am=${getFinalTotal().toFixed(2)}&cu=INR` : null;

  const copyUpiId = () => {
    navigator.clipboard.writeText(DEFAULT_UPI_ID);
    toast.success('UPI ID copied to clipboard!');
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-black text-white flex items-center justify-center pt-20">
        <div className="text-2xl animate-pulse">Loading checkout...</div>
      </div>
    );
  }

  if (!cart || cart.items.length === 0) {
    return (
      <div className="min-h-screen bg-black text-white pt-20">
        <div className="container mx-auto px-4 py-20 text-center">
          <h2 className="text-3xl font-bold mb-4">Your cart is empty</h2>
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
    <div className="min-h-screen bg-gradient-to-b from-black to-gray-900 text-white pt-20 pb-12">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 max-w-6xl">
        <div className="flex items-center mb-8">
          <button
            onClick={() => navigate('/cart')}
            className="p-2 rounded-full hover:bg-gray-800 transition-colors mr-4"
          >
            <ArrowLeft className="w-6 h-6" />
          </button>
          <h1 className="text-3xl md:text-4xl font-bold bg-gradient-to-r from-amber-400 to-amber-600 bg-clip-text text-transparent">
            Checkout
          </h1>
        </div>

        <div className="grid lg:grid-cols-2 gap-8">
          <div className="bg-gray-900/80 rounded-2xl p-6 backdrop-blur-sm border border-gray-800">
            <h2 className="text-xl font-bold mb-4 flex items-center gap-2">
              <CreditCard className="w-5 h-5 text-amber-400" />
              Order Summary
            </h2>
            <div className="space-y-3">
              {cart.items.map((item) => (
                <div key={item._id} className="flex justify-between text-gray-300 text-sm">
                  <span>
                    {item.product.name} × {item.quantity}
                  </span>
                  <span className="text-amber-400">
                    ₹{(item.product.price * item.quantity).toFixed(2)}
                  </span>
                </div>
              ))}
            </div>
            <div className="border-t border-gray-800 pt-4 mt-4">
              <div className="flex justify-between text-lg font-bold">
                <span>Subtotal</span>
                <span className="text-amber-400">
                  ₹{getSubtotal().toFixed(2)}
                </span>
              </div>
              <div className="flex justify-between text-sm text-gray-400 mt-1">
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
                <div className="flex justify-between text-xl font-bold">
                  <span>Total</span>
                  <span className="text-amber-400">
                    ₹{getFinalTotal().toFixed(2)}
                  </span>
                </div>
              </div>
            </div>
          </div>

          <div className="bg-gray-900/80 rounded-2xl p-6 backdrop-blur-sm border border-gray-800">
            <h2 className="text-xl font-bold mb-4 flex items-center gap-2">
              <MapPin className="w-5 h-5 text-amber-400" />
              Order Details
            </h2>
            <form onSubmit={handleSubmit} className="space-y-4">
              {/* Order Type Selection */}
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">
                  Order Type <span className="text-red-400">*</span>
                </label>
                <div className="grid grid-cols-2 gap-3">
                  <label className={`flex items-center gap-3 p-3 rounded-xl cursor-pointer transition-all border ${orderType === 'dine-in' ? 'border-amber-500 bg-amber-500/10' : 'border-gray-700 hover:border-gray-600'}`}>
                    <input
                      type="radio"
                      name="orderType"
                      value="dine-in"
                      checked={orderType === 'dine-in'}
                      onChange={() => handleOrderTypeChange('dine-in')}
                      className="accent-amber-500"
                    />
                    <Store className="w-5 h-5" />
                    <span className="text-gray-300">Dine In</span>
                  </label>
                  <label className={`flex items-center gap-3 p-3 rounded-xl cursor-pointer transition-all border ${orderType === 'delivery' ? 'border-amber-500 bg-amber-500/10' : 'border-gray-700 hover:border-gray-600'}`}>
                    <input
                      type="radio"
                      name="orderType"
                      value="delivery"
                      checked={orderType === 'delivery'}
                      onChange={() => handleOrderTypeChange('delivery')}
                      className="accent-amber-500"
                    />
                    <Truck className="w-5 h-5" />
                    <span className="text-gray-300">Delivery</span>
                  </label>
                </div>
              </div>

              {/* Dine-in Options */}
              {orderType === 'dine-in' && (
                <div className="space-y-3 animate-fade-in-up">
                  <div>
                    <label className="block text-sm font-medium text-gray-300 mb-2">
                      Select Location <span className="text-red-400">*</span>
                    </label>
                    <select
                      value={selectedLocation}
                      onChange={handleLocationChange}
                      className="w-full px-4 py-3 bg-gray-800 border border-gray-700 rounded-xl focus:outline-none focus:border-amber-500 text-white"
                    >
                      <option value="">Select a location</option>
                      {locations.map(location => (
                        <option key={location._id} value={location._id}>
                          {location.name} - {location.address}
                        </option>
                      ))}
                    </select>
                  </div>

                  {selectedLocation && (
                    <div>
                      <label className="block text-sm font-medium text-gray-300 mb-2">
                        Select Table <span className="text-red-400">*</span>
                      </label>
                      {tables.length > 0 ? (
                        <div className="grid grid-cols-3 gap-2">
                          {tables.map(table => (
                            <button
                              key={table.tableNumber}
                              type="button"
                              onClick={() => setSelectedTable(table.tableNumber)}
                              className={`p-3 rounded-xl text-center transition-all border ${
                                selectedTable === table.tableNumber
                                  ? 'border-amber-500 bg-amber-500/10 text-amber-400'
                                  : 'border-gray-700 hover:border-gray-600 text-gray-300'
                              }`}
                            >
                              <Table className="w-5 h-5 mx-auto mb-1" />
                              <span>Table {table.tableNumber}</span>
                              <p className="text-xs text-gray-500">Capacity: {table.capacity}</p>
                            </button>
                          ))}
                        </div>
                      ) : (
                        <div className="text-center py-4 text-gray-400 text-sm">
                          No tables available at this location
                        </div>
                      )}
                    </div>
                  )}
                </div>
              )}

              {/* Delivery Options - Simplified */}
              {orderType === 'delivery' && (
                <div className="space-y-3 animate-fade-in-up">
                  <div className="bg-blue-500/10 border border-blue-500/30 rounded-xl p-3">
                    <p className="text-sm text-blue-400">
                      <LocateFixed className="w-4 h-4 inline mr-1" />
                      {userCoordinates ? (
                        <span>Location detected: {userCoordinates.lat.toFixed(4)}, {userCoordinates.lng.toFixed(4)}</span>
                      ) : (
                        <span>Detecting your location...</span>
                      )}
                    </p>
                  </div>
                  <button
                    type="button"
                    onClick={detectUserLocation}
                    disabled={detectingLocation}
                    className="w-full bg-blue-600 hover:bg-blue-700 text-white py-2 rounded-xl text-sm font-semibold transition-all disabled:opacity-50 flex items-center justify-center gap-2"
                  >
                    {detectingLocation ? (
                      <>
                        <Loader2 className="w-4 h-4 animate-spin" />
                        Detecting...
                      </>
                    ) : (
                      <>
                        <LocateFixed className="w-4 h-4" />
                        {userCoordinates ? 'Re-detect Location' : 'Detect Location'}
                      </>
                    )}
                  </button>
                </div>
              )}

              {/* Payment Method */}
              <div className="pt-4">
                <label className="block text-sm font-medium text-gray-300 mb-3">
                  Payment Method <span className="text-red-400">*</span>
                </label>
                <div className="grid grid-cols-1 gap-3">
                  {/* Card Option - Stripe */}
                  <label className={`flex items-center gap-3 p-3 rounded-xl cursor-pointer transition-all border ${paymentMethod === 'card' ? 'border-amber-500 bg-amber-500/10' : 'border-gray-700 hover:border-gray-600'}`}>
                    <input
                      type="radio"
                      name="paymentMethod"
                      value="card"
                      checked={paymentMethod === 'card'}
                      onChange={() => setPaymentMethod('card')}
                      className="accent-amber-500"
                    />
                    <CreditCard className="w-5 h-5" />
                    <span className="text-gray-300">Credit / Debit Card</span>
                  </label>

                  {/* Card Element - Show when card is selected */}
                  {paymentMethod === 'card' && (
                    <div className="ml-8 space-y-3 animate-fade-in-up">
                      <div>
                        <label className="block text-sm text-gray-400 mb-1">Cardholder Name</label>
                        <input
                          type="text"
                          name="cardName"
                          value={cardDetails.cardName}
                          onChange={handleCardChange}
                          placeholder="Name of Carder Owner"
                          className="w-full px-4 py-2 bg-gray-800 border border-gray-700 rounded-xl focus:outline-none focus:border-amber-500 text-white"
                          required
                        />
                      </div>
                      <div className="bg-gray-800/50 rounded-xl p-3">
                        <CardElement 
                          options={{
                            style: {
                              base: {
                                fontSize: '16px',
                                color: '#fff',
                                '::placeholder': {
                                  color: '#666',
                                },
                                iconColor: '#F59E0B',
                              },
                              invalid: {
                                color: '#ef4444',
                                iconColor: '#ef4444',
                              },
                            },
                            hidePostalCode: true,
                          }}
                        />
                      </div>
                      {stripeError && (
                        <p className="text-red-400 text-sm">{stripeError}</p>
                      )}
                    </div>
                  )}

                  {/* Cash Option */}
                  <label className={`flex items-center gap-3 p-3 rounded-xl cursor-pointer transition-all border ${paymentMethod === 'cash' ? 'border-amber-500 bg-amber-500/10' : 'border-gray-700 hover:border-gray-600'}`}>
                    <input
                      type="radio"
                      name="paymentMethod"
                      value="cash"
                      checked={paymentMethod === 'cash'}
                      onChange={() => setPaymentMethod('cash')}
                      className="accent-amber-500"
                    />
                    <Wallet className="w-5 h-5" />
                    <span className="text-gray-300">Cash on Delivery</span>
                  </label>

                  {/* UPI Option */}
                  <label className={`flex items-center gap-3 p-3 rounded-xl cursor-pointer transition-all border ${paymentMethod === 'upi' ? 'border-amber-500 bg-amber-500/10' : 'border-gray-700 hover:border-gray-600'}`}>
                    <input
                      type="radio"
                      name="paymentMethod"
                      value="upi"
                      checked={paymentMethod === 'upi'}
                      onChange={() => setPaymentMethod('upi')}
                      className="accent-amber-500"
                    />
                    <QrCode className="w-5 h-5" />
                    <span className="text-gray-300">UPI / QR Code</span>
                  </label>

                  {paymentMethod === 'upi' && (
                    <div className="ml-8 space-y-4 animate-fade-in-up">
                      <div className="flex flex-col items-center">
                        <div className="bg-white p-4 rounded-xl shadow-lg">
                          <QRCodeSVG
                            value={upiQrData || ''}
                            size={200}
                            level="H"
                            includeMargin={true}
                          />
                        </div>
                        <p className="text-sm text-gray-400 mt-3">
                          Scan this QR code to pay <span className="text-amber-400 font-bold">₹{getFinalTotal().toFixed(2)}</span>
                        </p>
                        <p className="text-xs text-gray-500">
                          UPI ID: {DEFAULT_UPI_ID}
                        </p>
                        <button
                          type="button"
                          onClick={copyUpiId}
                          className="mt-2 flex items-center gap-1 text-xs text-amber-400 hover:text-amber-300 transition-colors"
                        >
                          <Copy className="w-3 h-3" />
                          Copy UPI ID
                        </button>
                      </div>

                      <div className="relative">
                        <div className="absolute inset-0 flex items-center">
                          <div className="w-full border-t border-gray-700"></div>
                        </div>
                        <div className="relative flex justify-center text-xs text-gray-400">
                          <span className="px-2 bg-gray-900">OR</span>
                        </div>
                      </div>

                      <div>
                        <label className="block text-sm text-gray-400 mb-1">
                          Enter your UPI ID (Optional)
                        </label>
                        <input
                          type="text"
                          value={upiId}
                          onChange={(e) => setUpiId(e.target.value)}
                          placeholder="example@upi"
                          className="w-full px-4 py-2 bg-gray-800 border border-gray-700 rounded-xl focus:outline-none focus:border-amber-500 text-white transition-colors"
                        />
                        <p className="text-xs text-gray-500 mt-1">
                          Enter your own UPI ID to pay manually
                        </p>
                      </div>
                    </div>
                  )}
                </div>
              </div>

              <button
                type="submit"
                disabled={submitting || !stripe}
                className="w-full bg-amber-600 hover:bg-amber-700 text-white py-3 rounded-xl font-semibold transition-all transform hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
              >
                {submitting ? (
                  <>
                    <Loader2 className="w-5 h-5 animate-spin" />
                    <span>Placing Order...</span>
                  </>
                ) : (
                  <>
                    <Lock className="w-5 h-5" />
                    Place Order
                  </>
                )}
              </button>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Checkout;