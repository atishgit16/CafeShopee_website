// src/pages/admin/AdminAddCoupon.jsx
import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import axios from 'axios';
import toast from 'react-hot-toast';
import { ArrowLeft, Save, X } from 'lucide-react';

const AdminAddCoupon = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [products, setProducts] = useState([]);
  const [formData, setFormData] = useState({
    code: '',
    type: 'percentage',
    value: '',
    minOrderAmount: '',
    maxDiscount: '',
    description: '',
    validUntil: '',
    usageLimit: '',
    isActive: true,
    applicableProducts: [],
    comboProducts: [],
    comboPrice: '',
    image: ''
  });

  const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';

  useEffect(() => {
    fetchProducts();
    if (id) {
      fetchCoupon();
    }
  }, [id]);

  const fetchProducts = async () => {
    try {
      const response = await axios.get(`${API_URL}/products`);
      setProducts(response.data);
    } catch (error) {
      console.error('Fetch products error:', error);
      toast.error('Failed to load products');
    }
  };

  const fetchCoupon = async () => {
    try {
      const response = await axios.get(`${API_URL}/coupons/${id}`);
      setFormData(response.data);
    } catch (error) {
      console.error('Fetch coupon error:', error);
      toast.error('Failed to load coupon');
    }
  };

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      if (id) {
        await axios.put(`${API_URL}/coupons/${id}`, formData);
        toast.success('Coupon updated successfully');
      } else {
        await axios.post(`${API_URL}/coupons`, formData);
        toast.success('Coupon created successfully');
      }
      navigate('/admin/coupons');
    } catch (error) {
      console.error('Coupon save error:', error);
      toast.error(error.response?.data?.message || 'Failed to save coupon');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-black text-white pt-20 pb-12">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 max-w-3xl">
        <div className="flex items-center gap-4 mb-8">
          <button
            onClick={() => navigate('/admin/coupons')}
            className="p-2 rounded-full hover:bg-gray-800 transition-colors"
          >
            <ArrowLeft className="w-6 h-6" />
          </button>
          <h1 className="text-3xl md:text-4xl font-bold bg-gradient-to-r from-green-400 to-amber-500 bg-clip-text text-transparent">
            {id ? 'Edit Coupon' : 'Add New Coupon'}
          </h1>
        </div>

        <form onSubmit={handleSubmit} className="bg-gray-900/80 rounded-2xl p-6 backdrop-blur-sm border border-gray-800 space-y-6">
          <div className="grid md:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">
                Coupon Code <span className="text-red-400">*</span>
              </label>
              <input
                name="code"
                value={formData.code}
                onChange={handleChange}
                placeholder="e.g., BREW20"
                className="w-full px-4 py-3 bg-gray-800 border border-gray-700 rounded-xl focus:outline-none focus:border-amber-500 text-white uppercase"
                required
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">
                Coupon Type <span className="text-red-400">*</span>
              </label>
              <select
                name="type"
                value={formData.type}
                onChange={handleChange}
                className="w-full px-4 py-3 bg-gray-800 border border-gray-700 rounded-xl focus:outline-none focus:border-amber-500 text-white"
                required
              >
                <option value="percentage">Percentage Discount</option>
                <option value="fixed">Fixed Amount</option>
                <option value="combo">Combo Offer</option>
                <option value="free_delivery">Free Delivery</option>
              </select>
            </div>
          </div>

          <div className="grid md:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">
                Value <span className="text-red-400">*</span>
              </label>
              <input
                name="value"
                type="number"
                value={formData.value}
                onChange={handleChange}
                placeholder={formData.type === 'percentage' ? '20' : '100'}
                className="w-full px-4 py-3 bg-gray-800 border border-gray-700 rounded-xl focus:outline-none focus:border-amber-500 text-white"
                required
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">
                Valid Until <span className="text-red-400">*</span>
              </label>
              <input
                name="validUntil"
                type="date"
                value={formData.validUntil ? new Date(formData.validUntil).toISOString().split('T')[0] : ''}
                onChange={handleChange}
                className="w-full px-4 py-3 bg-gray-800 border border-gray-700 rounded-xl focus:outline-none focus:border-amber-500 text-white"
                required
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-300 mb-2">
              Description <span className="text-red-400">*</span>
            </label>
            <textarea
              name="description"
              value={formData.description}
              onChange={handleChange}
              placeholder="e.g., Get 20% off on all beverages"
              rows="2"
              className="w-full px-4 py-3 bg-gray-800 border border-gray-700 rounded-xl focus:outline-none focus:border-amber-500 text-white resize-none"
              required
            />
          </div>

          <div className="grid md:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">
                Minimum Order Amount
              </label>
              <input
                name="minOrderAmount"
                type="number"
                value={formData.minOrderAmount}
                onChange={handleChange}
                placeholder="0"
                className="w-full px-4 py-3 bg-gray-800 border border-gray-700 rounded-xl focus:outline-none focus:border-amber-500 text-white"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">
                Maximum Discount
              </label>
              <input
                name="maxDiscount"
                type="number"
                value={formData.maxDiscount}
                onChange={handleChange}
                placeholder="0"
                className="w-full px-4 py-3 bg-gray-800 border border-gray-700 rounded-xl focus:outline-none focus:border-amber-500 text-white"
              />
            </div>
          </div>

          <div className="grid md:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">
                Usage Limit
              </label>
              <input
                name="usageLimit"
                type="number"
                value={formData.usageLimit}
                onChange={handleChange}
                placeholder="0 (unlimited)"
                className="w-full px-4 py-3 bg-gray-800 border border-gray-700 rounded-xl focus:outline-none focus:border-amber-500 text-white"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">
                Image URL
              </label>
              <input
                name="image"
                value={formData.image}
                onChange={handleChange}
                placeholder="https://example.com/coupon.jpg"
                className="w-full px-4 py-3 bg-gray-800 border border-gray-700 rounded-xl focus:outline-none focus:border-amber-500 text-white"
              />
            </div>
          </div>

          <div className="flex items-center gap-2">
            <input
              name="isActive"
              type="checkbox"
              checked={formData.isActive}
              onChange={handleChange}
              className="w-5 h-5 accent-amber-500"
            />
            <label className="text-sm text-gray-300">Active</label>
          </div>

          <div className="flex gap-4 pt-4">
            <button
              type="submit"
              disabled={loading}
              className="flex-1 bg-green-600 hover:bg-green-700 text-white px-6 py-3 rounded-xl font-semibold transition-all transform hover:scale-105 disabled:opacity-50"
            >
              {loading ? 'Saving...' : id ? 'Update Coupon' : 'Create Coupon'}
            </button>
            <button
              type="button"
              onClick={() => navigate('/admin/coupons')}
              className="flex-1 bg-gray-800 hover:bg-gray-700 text-white px-6 py-3 rounded-xl font-semibold transition-all"
            >
              Cancel
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default AdminAddCoupon;