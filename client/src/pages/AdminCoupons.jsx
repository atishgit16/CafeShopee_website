// src/pages/admin/AdminCoupons.jsx
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import toast from 'react-hot-toast';
import { 
  Plus, 
  Edit, 
  Trash2, 
  Ticket, 
  Search, 
  Filter,
  Eye
} from 'lucide-react';

const AdminCoupons = () => {
  const [coupons, setCoupons] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterType, setFilterType] = useState('all');
  const navigate = useNavigate();

  const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';

  useEffect(() => {
    fetchCoupons();
  }, []);

  const fetchCoupons = async () => {
    try {
      const response = await axios.get(`${API_URL}/coupons`);
      setCoupons(response.data);
    } catch (error) {
      console.error('Fetch coupons error:', error);
      toast.error('Failed to load coupons');
    } finally {
      setLoading(false);
    }
  };

  const deleteCoupon = async (id) => {
    if (!window.confirm('Are you sure you want to delete this coupon?')) return;
    try {
      await axios.delete(`${API_URL}/coupons/${id}`);
      toast.success('Coupon deleted successfully');
      fetchCoupons();
    } catch (error) {
      console.error('Delete coupon error:', error);
      toast.error('Failed to delete coupon');
    }
  };

  const filteredCoupons = coupons.filter(coupon => {
    const matchesSearch = coupon.code.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesType = filterType === 'all' || coupon.type === filterType;
    return matchesSearch && matchesType;
  });

  if (loading) {
    return (
      <div className="min-h-screen bg-black text-white flex items-center justify-center pt-20">
        <div className="text-center">
          <div className="text-4xl mb-4 animate-pulse">🎫</div>
          <div className="text-xl text-gray-400 animate-pulse">Loading coupons...</div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-black text-white pt-20 pb-12">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center mt-8 justify-between mb-9">
          <h1 className="text-3xl md:text-4xl mb-8 font-bold bg-gradient-to-r from-green-400 to-amber-500 bg-clip-text text-transparent">
            Coupon Management
          </h1>
          <button
            onClick={() => navigate('/admin/add-coupon')}
            className="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-full text-sm font-semibold transition-all flex items-center gap-2"
          >
            <Plus className="w-4 h-4" />
            Add Coupon
          </button>
        </div>

        <div className="bg-gray-900/80 rounded-2xl p-6 backdrop-blur-sm border border-gray-800">
          <div className="flex flex-col md:flex-row gap-4 mb-6">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-500" />
              <input
                type="text"
                placeholder="Search coupons..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-2 bg-gray-800 border border-gray-700 rounded-xl focus:outline-none focus:border-amber-500 text-white"
              />
            </div>
            <select
              value={filterType}
              onChange={(e) => setFilterType(e.target.value)}
              className="px-4 py-2 bg-gray-800 border border-gray-700 rounded-xl focus:outline-none focus:border-amber-500 text-white"
            >
              <option value="all">All Types</option>
              <option value="percentage">Percentage</option>
              <option value="fixed">Fixed Amount</option>
              <option value="combo">Combo</option>
              <option value="free_delivery">Free Delivery</option>
            </select>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredCoupons.map((coupon) => (
              <div
                key={coupon._id}
                className="group bg-gray-800/50 rounded-2xl p-6 border border-gray-700 hover:border-green-500/30 transition-all"
              >
                <div className="flex justify-between items-start mb-4">
                  <div>
                    <h3 className="text-xl font-bold text-green-400">{coupon.code}</h3>
                    <p className="text-sm text-gray-400">{coupon.description}</p>
                  </div>
                  <div className="flex gap-2">
                    <button
                      onClick={() => navigate(`/admin/edit-coupon/${coupon._id}`)}
                      className="p-2 bg-gray-700 rounded-full hover:bg-amber-600 transition-colors"
                    >
                      <Edit className="w-4 h-4" />
                    </button>
                    <button
                      onClick={() => deleteCoupon(coupon._id)}
                      className="p-2 bg-gray-700 rounded-full hover:bg-red-600 transition-colors"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>
                <div className="space-y-2 text-sm">
                  <p className="text-gray-300">
                    Type: <span className="capitalize">{coupon.type}</span>
                  </p>
                  <p className="text-gray-300">
                    Value: {coupon.type === 'percentage' ? `${coupon.value}%` : `₹${coupon.value}`}
                  </p>
                  {coupon.minOrderAmount > 0 && (
                    <p className="text-gray-300">Min. Order: ₹{coupon.minOrderAmount}</p>
                  )}
                  <p className="text-gray-300">
                    Valid Till: {new Date(coupon.validUntil).toLocaleDateString()}
                  </p>
                  <div className="flex items-center gap-2">
                    <span className={`px-2 py-1 rounded-full text-xs ${coupon.isActive ? 'bg-green-500/20 text-green-500' : 'bg-red-500/20 text-red-500'}`}>
                      {coupon.isActive ? 'Active' : 'Inactive'}
                    </span>
                    <span className="text-gray-400 text-xs">
                      Used: {coupon.usedCount}/{coupon.usageLimit || '∞'}
                    </span>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {filteredCoupons.length === 0 && (
            <div className="text-center py-12">
              <Ticket className="w-16 h-16 mx-auto text-gray-600 mb-4" />
              <p className="text-gray-400">No coupons found</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default AdminCoupons;