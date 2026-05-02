// src/pages/admin/AdminOrders.jsx
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import toast from 'react-hot-toast';
import { ArrowLeft, Eye, Package, Clock, CheckCircle, XCircle, Truck } from 'lucide-react';

const AdminOrders = () => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedOrder, setSelectedOrder] = useState(null);
  const [updating, setUpdating] = useState(false);
  const navigate = useNavigate();

  const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';

  useEffect(() => {
    fetchOrders();
  }, []);

  const fetchOrders = async () => {
    try {
      const response = await axios.get(`${API_URL}/orders`);
      setOrders(response.data);
    } catch (error) {
      console.error('Fetch orders error:', error);
      toast.error('Failed to load orders');
    } finally {
      setLoading(false);
    }
  };

  const updateOrderStatus = async (orderId, newStatus) => {
    setUpdating(true);
    try {
      await axios.put(`${API_URL}/orders/${orderId}/status`, { 
        orderStatus: newStatus 
      });
      toast.success(`Order status updated to ${newStatus}`);
      fetchOrders();
      setSelectedOrder(null);
    } catch (error) {
      console.error('Update order error:', error);
      toast.error('Failed to update order status');
    } finally {
      setUpdating(false);
    }
  };

  const getStatusColor = (status) => {
    switch(status) {
      case 'pending': return 'bg-yellow-500/20 text-yellow-500';
      case 'processing': return 'bg-blue-500/20 text-blue-500';
      case 'shipped': return 'bg-purple-500/20 text-purple-500';
      case 'delivered': return 'bg-green-500/20 text-green-500';
      case 'cancelled': return 'bg-red-500/20 text-red-500';
      default: return 'bg-gray-500/20 text-gray-500';
    }
  };

  const getStatusIcon = (status) => {
    switch(status) {
      case 'pending': return <Clock className="w-4 h-4" />;
      case 'processing': return <Package className="w-4 h-4" />;
      case 'shipped': return <Truck className="w-4 h-4" />;
      case 'delivered': return <CheckCircle className="w-4 h-4" />;
      case 'cancelled': return <XCircle className="w-4 h-4" />;
      default: return <Clock className="w-4 h-4" />;
    }
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD'
    }).format(amount);
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-black text-white flex items-center justify-center pt-20">
        <div className="text-center">
          <div className="text-4xl mb-4 animate-pulse">📦</div>
          <div className="text-xl text-gray-400 animate-pulse">Loading orders...</div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-black text-white pt-20 pb-12">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="flex mt-8 items-center justify-between mb-8">
          <div className="flex items-center gap-4">
            <button
              onClick={() => navigate('/admin')}
              className="p-2 rounded-full hover:bg-gray-800 transition-colors"
            >
              <ArrowLeft className="w-6 h-6" />
            </button>
            <h1 className="text-3xl md:text-4xl font-bold bg-gradient-to-r from-amber-400 to-amber-600 bg-clip-text text-transparent">
              Order Management
            </h1>
          </div>
          <div className="flex gap-2">
            <span className="text-sm text-gray-400">
              Total: {orders.length} orders
            </span>
          </div>
        </div>

        {/* Orders Table */}
        <div className="bg-gray-900/80 rounded-2xl p-6 backdrop-blur-sm border border-gray-800 overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="text-left text-gray-400 text-sm border-b border-gray-800">
                  <th className="pb-3 px-4">Order ID</th>
                  <th className="pb-3 px-4">Customer</th>
                  <th className="pb-3 px-4">Items</th>
                  <th className="pb-3 px-4">Total</th>
                  <th className="pb-3 px-4">Status</th>
                  <th className="pb-3 px-4">Date</th>
                  <th className="pb-3 px-4">Actions</th>
                </tr>
              </thead>
              <tbody>
                {orders.length > 0 ? (
                  orders.map((order) => (
                    <tr key={order._id} className="border-b border-gray-800/50 hover:bg-gray-800/30 transition-colors">
                      <td className="py-4 px-4 text-sm font-mono">
                        #{order._id?.slice(-8)}
                      </td>
                      <td className="py-4 px-4 text-sm">
                        <div className="font-medium">{order.user?.name || 'Guest'}</div>
                        <div className="text-xs text-gray-500">{order.user?.email || 'No email'}</div>
                      </td>
                      <td className="py-4 px-4 text-sm">
                        {order.items?.length || 0} items
                      </td>
                      <td className="py-4 px-4 text-sm font-bold text-amber-400">
                        {formatCurrency(order.totalAmount)}
                      </td>
                      <td className="py-4 px-4">
                        <span className={`inline-flex items-center gap-1 px-3 py-1 rounded-full text-xs font-medium ${getStatusColor(order.orderStatus)}`}>
                          {getStatusIcon(order.orderStatus)}
                          {order.orderStatus}
                        </span>
                      </td>
                      <td className="py-4 px-4 text-sm text-gray-400">
                        {formatDate(order.createdAt)}
                      </td>
                      <td className="py-4 px-4">
                        <button
                          onClick={() => setSelectedOrder(order)}
                          className="p-2 rounded-full hover:bg-gray-700 transition-colors"
                          title="View details"
                        >
                          <Eye className="w-4 h-4 text-gray-400 hover:text-white" />
                        </button>
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan="7" className="py-12 text-center text-gray-500">
                      <Package className="w-16 h-16 mx-auto mb-4 opacity-50" />
                      <p className="text-xl font-medium">No orders found</p>
                      <p className="text-sm">Orders will appear here when customers place them</p>
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>

        {/* Order Detail Modal */}
        {selectedOrder && (
          <div className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50 flex items-center justify-center p-4">
            <div className="bg-gray-900 rounded-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto p-6 border border-gray-800">
              <div className="flex justify-between items-start mb-6">
                <h2 className="text-2xl font-bold text-amber-400">
                  Order #{selectedOrder._id?.slice(-8)}
                </h2>
                <button
                  onClick={() => setSelectedOrder(null)}
                  className="p-2 rounded-full hover:bg-gray-800 transition-colors"
                >
                  <XCircle className="w-6 h-6" />
                </button>
              </div>

              <div className="space-y-4">
                {/* Customer Info */}
                <div className="bg-gray-800/50 rounded-xl p-4">
                  <h3 className="font-semibold mb-2">Customer Information</h3>
                  <p className="text-gray-300">Name: {selectedOrder.user?.name || 'Guest'}</p>
                  <p className="text-gray-300">Email: {selectedOrder.user?.email || 'N/A'}</p>
                </div>

                {/* Shipping Address */}
                <div className="bg-gray-800/50 rounded-xl p-4">
                  <h3 className="font-semibold mb-2">Shipping Address</h3>
                  {selectedOrder.address ? (
                    <>
                      <p className="text-gray-300">{selectedOrder.address.street}</p>
                      <p className="text-gray-300">
                        {selectedOrder.address.city}, {selectedOrder.address.state} {selectedOrder.address.zipCode}
                      </p>
                      <p className="text-gray-300">{selectedOrder.address.country}</p>
                    </>
                  ) : (
                    <p className="text-gray-400">No address provided</p>
                  )}
                </div>

                {/* Order Items */}
                <div className="bg-gray-800/50 rounded-xl p-4">
                  <h3 className="font-semibold mb-2">Order Items</h3>
                  <div className="space-y-2">
                    {selectedOrder.items?.map((item, index) => (
                      <div key={index} className="flex justify-between text-sm">
                        <span className="text-gray-300">
                          {item.product?.name || 'Product'} × {item.quantity}
                        </span>
                        <span className="text-amber-400">
                          {formatCurrency(item.price * item.quantity)}
                        </span>
                      </div>
                    ))}
                  </div>
                  <div className="border-t border-gray-700 mt-3 pt-3 flex justify-between font-bold">
                    <span>Total</span>
                    <span className="text-amber-400">{formatCurrency(selectedOrder.totalAmount)}</span>
                  </div>
                </div>

                {/* Order Status */}
                <div className="bg-gray-800/50 rounded-xl p-4">
                  <h3 className="font-semibold mb-2">Update Order Status</h3>
                  <div className="grid grid-cols-2 gap-2">
                    {['pending', 'processing', 'shipped', 'delivered', 'cancelled'].map((status) => (
                      <button
                        key={status}
                        onClick={() => updateOrderStatus(selectedOrder._id, status)}
                        disabled={updating || selectedOrder.orderStatus === status}
                        className={`px-3 py-2 rounded-lg text-sm font-medium transition-all ${
                          selectedOrder.orderStatus === status
                            ? 'bg-amber-600 text-white'
                            : 'bg-gray-700 hover:bg-gray-600 text-gray-300'
                        } ${updating ? 'opacity-50 cursor-not-allowed' : ''}`}
                      >
                        {status.charAt(0).toUpperCase() + status.slice(1)}
                      </button>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default AdminOrders;