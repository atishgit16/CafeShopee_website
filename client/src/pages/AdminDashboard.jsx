// src/pages/admin/AdminDashboard.jsx
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { useAuth } from '../context/AuthContext';
import toast from 'react-hot-toast';
import { 
  Coffee, 
  ShoppingBag, 
  Users, 
  DollarSign, 
  Package,
  CheckCircle,
  ArrowRight,
  Ticket,
  TrendingUp,
  TrendingDown,
  Download,
  Calendar,
  FileText,
  BarChart3,
  PieChart,
  Activity,
  Award,
  MapPin,
  Store,
  IndianRupee,
  Table
} from 'lucide-react';
import { 
  LineChart, 
  Line, 
  BarChart, 
  Bar, 
  PieChart as RePieChart, 
  Pie, 
  Cell, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  Legend, 
  ResponsiveContainer 
} from 'recharts';
import * as XLSX from 'xlsx';

const AdminDashboard = () => {
  const [stats, setStats] = useState({
    totalProducts: 0,
    totalOrders: 0,
    totalUsers: 0,
    totalRevenue: 0,
    totalCoupons: 0,
    totalLocations: 0,
    totalTables: 0,
    dailyRevenue: 0,
    weeklyRevenue: 0,
    monthlyRevenue: 0,
    yearlyRevenue: 0,
    profitMargin: 0,
    avgOrderValue: 0,
    recentOrders: [],
    lowStockProducts: [],
    topProducts: [],
    salesData: [],
    monthlyData: [],
    orderStatusData: [],
    paymentMethodData: []
  });
  const [loading, setLoading] = useState(true);
  const [timeRange, setTimeRange] = useState('monthly');
  const { user } = useAuth();
  const navigate = useNavigate();

  const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';

  useEffect(() => {
    fetchDashboardData();
  }, []);

  const fetchDashboardData = async () => {
    try {
      // Fetch all necessary data
      const [productsRes, ordersRes, couponsRes, usersRes, locationsRes] = await Promise.all([
        axios.get(`${API_URL}/products`),
        axios.get(`${API_URL}/orders`),
        axios.get(`${API_URL}/coupons`),
        axios.get(`${API_URL}/auth/users`).catch(() => ({ data: [] })),
        axios.get(`${API_URL}/locations`)
      ]);

      const products = productsRes.data;
      const orders = ordersRes.data;
      const coupons = couponsRes.data;
      const users = usersRes.data || [];
      const locations = locationsRes.data || [];

      // Calculate total tables across all locations
      const totalTables = locations.reduce((sum, location) => sum + (location.tables?.length || 0), 0);

      // Calculate revenue
      const totalRevenue = orders.reduce((sum, order) => sum + order.totalAmount, 0);
      
      // Calculate profit margin (assuming 40% profit on average)
      const estimatedProfit = totalRevenue * 0.40;
      const profitMargin = totalRevenue > 0 ? (estimatedProfit / totalRevenue) * 100 : 0;

      // Calculate average order value
      const avgOrderValue = orders.length > 0 ? totalRevenue / orders.length : 0;

      // Calculate revenue by time period
      const now = new Date();
      const today = new Date(now.getFullYear(), now.getMonth(), now.getDate());
      const weekStart = new Date(today);
      weekStart.setDate(today.getDate() - today.getDay());
      const monthStart = new Date(now.getFullYear(), now.getMonth(), 1);
      const yearStart = new Date(now.getFullYear(), 0, 1);

      const dailyRevenue = orders
        .filter(order => new Date(order.createdAt) >= today)
        .reduce((sum, order) => sum + order.totalAmount, 0);

      const weeklyRevenue = orders
        .filter(order => new Date(order.createdAt) >= weekStart)
        .reduce((sum, order) => sum + order.totalAmount, 0);

      const monthlyRevenue = orders
        .filter(order => new Date(order.createdAt) >= monthStart)
        .reduce((sum, order) => sum + order.totalAmount, 0);

      const yearlyRevenue = orders
        .filter(order => new Date(order.createdAt) >= yearStart)
        .reduce((sum, order) => sum + order.totalAmount, 0);

      // Top products
      const productSales = {};
      orders.forEach(order => {
        order.items.forEach(item => {
          const productId = item.product._id || item.product;
          if (!productSales[productId]) {
            productSales[productId] = {
              name: item.product.name || 'Unknown',
              quantity: 0,
              revenue: 0
            };
          }
          productSales[productId].quantity += item.quantity;
          productSales[productId].revenue += item.price * item.quantity;
        });
      });

      const topProducts = Object.values(productSales)
        .sort((a, b) => b.quantity - a.quantity)
        .slice(0, 5);

      // Monthly sales data for chart
      const monthlyData = [];
      const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
      
      for (let i = 0; i < 6; i++) {
        const date = new Date();
        date.setMonth(date.getMonth() - i);
        const month = months[date.getMonth()];
        const year = date.getFullYear();
        
        const monthlyRevenue = orders
          .filter(order => {
            const orderDate = new Date(order.createdAt);
            return orderDate.getMonth() === date.getMonth() && 
                   orderDate.getFullYear() === date.getFullYear();
          })
          .reduce((sum, order) => sum + order.totalAmount, 0);

        monthlyData.unshift({
          month: `${month} ${year}`,
          revenue: monthlyRevenue,
          orders: orders.filter(order => {
            const orderDate = new Date(order.createdAt);
            return orderDate.getMonth() === date.getMonth() && 
                   orderDate.getFullYear() === date.getFullYear();
          }).length
        });
      }

      // Order status distribution
      const orderStatusData = {};
      orders.forEach(order => {
        const status = order.orderStatus || 'pending';
        orderStatusData[status] = (orderStatusData[status] || 0) + 1;
      });

      const orderStatusChartData = Object.entries(orderStatusData).map(([name, value]) => ({
        name,
        value
      }));

      // Payment method distribution
      const paymentMethodData = {};
      orders.forEach(order => {
        const method = order.paymentMethod || 'unknown';
        paymentMethodData[method] = (paymentMethodData[method] || 0) + 1;
      });

      const paymentMethodChartData = Object.entries(paymentMethodData).map(([name, value]) => ({
        name,
        value
      }));

      // Recent orders
      const recentOrders = orders.slice(0, 5);
      const lowStockProducts = products.filter(p => p.stock <= 5);

      setStats({
        totalProducts: products.length,
        totalOrders: orders.length,
        totalUsers: users.length || 0,
        totalRevenue,
        totalCoupons: coupons.length,
        totalLocations: locations.length,
        totalTables,
        dailyRevenue,
        weeklyRevenue,
        monthlyRevenue,
        yearlyRevenue,
        profitMargin,
        avgOrderValue,
        recentOrders,
        lowStockProducts,
        topProducts,
        salesData: monthlyData,
        monthlyData,
        orderStatusData: orderStatusChartData,
        paymentMethodData: paymentMethodChartData
      });
    } catch (error) {
      console.error('Fetch dashboard error:', error);
      toast.error('Failed to load dashboard data');
    } finally {
      setLoading(false);
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

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  };

  const generateExcelReport = () => {
    try {
      // Prepare data for Excel
      const excelData = [];
      
      // Add header
      excelData.push(['BrewHeaven Cafe - Sales Report']);
      excelData.push(['Generated:', new Date().toLocaleString()]);
      excelData.push([]);
      
      // Add stats
      excelData.push(['Business Metrics']);
      excelData.push(['Total Revenue', `₹${stats.totalRevenue.toFixed(2)}`]);
      excelData.push(['Total Orders', stats.totalOrders]);
      excelData.push(['Total Products', stats.totalProducts]);
      excelData.push(['Total Users', stats.totalUsers]);
      excelData.push(['Total Locations', stats.totalLocations]);
      excelData.push(['Total Tables', stats.totalTables]);
      excelData.push(['Average Order Value', `₹${stats.avgOrderValue.toFixed(2)}`]);
      excelData.push(['Profit Margin', `${stats.profitMargin.toFixed(1)}%`]);
      excelData.push([]);
      
      // Add recent orders
      excelData.push(['Recent Orders']);
      excelData.push(['Order ID', 'Customer', 'Amount', 'Status', 'Date']);
      stats.recentOrders.forEach(order => {
        excelData.push([
          `#${order._id?.slice(-6) || 'N/A'}`,
          order.user?.name || 'Guest',
          `₹${order.totalAmount?.toFixed(2) || '0.00'}`,
          order.orderStatus || 'pending',
          formatDate(order.createdAt)
        ]);
      });
      excelData.push([]);
      
      // Add top products
      excelData.push(['Top Selling Products']);
      excelData.push(['Product Name', 'Quantity Sold', 'Revenue']);
      stats.topProducts.forEach(product => {
        excelData.push([
          product.name,
          product.quantity,
          `₹${product.revenue.toFixed(2)}`
        ]);
      });
      excelData.push([]);
      
      // Add monthly data
      excelData.push(['Monthly Revenue Overview']);
      excelData.push(['Month', 'Revenue', 'Orders']);
      stats.monthlyData.forEach(item => {
        excelData.push([
          item.month,
          `₹${item.revenue.toFixed(2)}`,
          item.orders
        ]);
      });

      // Create workbook and worksheet
      const wb = XLSX.utils.book_new();
      const ws = XLSX.utils.aoa_to_sheet(excelData);
      
      // Set column widths
      ws['!cols'] = [
        { wch: 20 },
        { wch: 20 },
        { wch: 15 },
        { wch: 15 },
        { wch: 15 }
      ];
      
      XLSX.utils.book_append_sheet(wb, ws, 'Sales Report');
      
      // Generate and download
      XLSX.writeFile(wb, 'BrewHeaven_Sales_Report.xlsx');
      toast.success('Excel report downloaded successfully!');
      
    } catch (error) {
      console.error('Generate Excel error:', error);
      toast.error('Failed to generate Excel report');
    }
  };

  const COLORS = ['#F59E0B', '#3B82F6', '#10B981', '#8B5CF6', '#EF4444'];

  if (loading) {
    return (
      <div className="min-h-screen bg-black text-white flex items-center justify-center pt-20">
        <div className="text-center">
          <div className="text-4xl mb-4 animate-pulse">☕</div>
          <div className="text-xl text-gray-400 animate-pulse">Loading dashboard...</div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-black text-white pt-20 pb-12">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-8">
          <div>
            <h1 className="text-3xl md:text-4xl font-bold bg-gradient-to-r from-amber-400 to-amber-600 bg-clip-text text-transparent">
              Admin Dashboard
            </h1>
            <p className="text-gray-400 mt-1">Welcome back, {user?.name || 'Admin'}</p>
          </div>
          <div className="flex gap-3 mt-4 sm:mt-0">
            <button
              onClick={() => navigate('/admin/add-product')}
              className="bg-amber-600 hover:bg-amber-700 text-white px-4 py-2 rounded-full text-sm font-semibold transition-all transform hover:scale-105"
            >
              Add Product
            </button>
            <button
              onClick={() => navigate('/admin/locations')}
              className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-full text-sm font-semibold transition-all transform hover:scale-105"
            >
              <Store className="w-4 h-4 inline mr-1" />
              Manage Locations
            </button>
            <button
              onClick={generateExcelReport}
              className="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-full text-sm font-semibold transition-all transform hover:scale-105"
            >
              <FileText className="w-4 h-4 inline mr-1" />
              Export Excel
            </button>
          </div>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <div className="bg-gray-900/80 rounded-2xl p-6 backdrop-blur-sm border border-gray-800 hover:border-amber-500/30 transition-colors">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-400 text-sm">Total Products</p>
                <p className="text-3xl font-bold mt-1">{stats.totalProducts}</p>
              </div>
              <div className="w-12 h-12 bg-amber-500/20 rounded-full flex items-center justify-center">
                <Coffee className="w-6 h-6 text-amber-500" />
              </div>
            </div>
            <button 
              onClick={() => navigate('/admin/products')}
              className="mt-4 text-sm text-amber-400 hover:text-amber-300 flex items-center gap-1"
            >
              Manage Products <ArrowRight className="w-4 h-4" />
            </button>
          </div>

          <div className="bg-gray-900/80 rounded-2xl p-6 backdrop-blur-sm border border-gray-800 hover:border-blue-500/30 transition-colors">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-400 text-sm">Total Orders</p>
                <p className="text-3xl font-bold mt-1">{stats.totalOrders}</p>
              </div>
              <div className="w-12 h-12 bg-blue-500/20 rounded-full flex items-center justify-center">
                <ShoppingBag className="w-6 h-6 text-blue-500" />
              </div>
            </div>
            <button 
              onClick={() => navigate('/admin/orders')}
              className="mt-4 text-sm text-blue-400 hover:text-blue-300 flex items-center gap-1"
            >
              View Orders <ArrowRight className="w-4 h-4" />
            </button>
          </div>

          <div className="bg-gray-900/80 rounded-2xl p-6 backdrop-blur-sm border border-gray-800 hover:border-green-500/30 transition-colors">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-400 text-sm">Total Users</p>
                <p className="text-3xl font-bold mt-1">{stats.totalUsers}</p>
              </div>
              <div className="w-12 h-12 bg-green-500/20 rounded-full flex items-center justify-center">
                <Users className="w-6 h-6 text-green-500" />
              </div>
            </div>
            <p className="mt-4 text-sm text-gray-500">Active customers</p>
          </div>

          <div className="bg-gray-900/80 rounded-2xl p-6 backdrop-blur-sm border border-gray-800 hover:border-purple-500/30 transition-colors">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-400 text-sm">Total Revenue</p>
                <p className="text-3xl font-bold mt-1 text-amber-400">
                  ₹{stats.totalRevenue.toFixed(2)}
                </p>
              </div>
              <div className="w-12 h-12 bg-purple-500/20 rounded-full flex items-center justify-center">
             <IndianRupee className="w-6 h-6 text-purple-500" />
              </div>
            </div>
            <p className="mt-4 text-sm text-gray-500">Lifetime sales</p>
          </div>
        </div>

        {/* Location & Table Stats */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <div className="bg-gray-900/80 rounded-2xl p-6 backdrop-blur-sm border border-gray-800 hover:border-blue-500/30 transition-colors">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-400 text-sm">Total Locations</p>
                <p className="text-3xl font-bold mt-1">{stats.totalLocations}</p>
              </div>
              <div className="w-12 h-12 bg-blue-500/20 rounded-full flex items-center justify-center">
                <Store className="w-6 h-6 text-blue-500" />
              </div>
            </div>
            <button 
              onClick={() => navigate('/admin/locations')}
              className="mt-4 text-sm text-blue-400 hover:text-blue-300 flex items-center gap-1"
            >
              Manage Locations <ArrowRight className="w-4 h-4" />
            </button>
          </div>

          <div className="bg-gray-900/80 rounded-2xl p-6 backdrop-blur-sm border border-gray-800 hover:border-green-500/30 transition-colors">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-400 text-sm">Total Tables</p>
                <p className="text-3xl font-bold mt-1">{stats.totalTables}</p>
              </div>
              <div className="w-12 h-12 bg-green-500/20 rounded-full flex items-center justify-center">
                <Table className="w-6 h-6 text-green-500" />
              </div>
            </div>
            <button 
              onClick={() => navigate('/admin/locations')}
              className="mt-4 text-sm text-green-400 hover:text-green-300 flex items-center gap-1"
            >
              Manage Tables <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Revenue Breakdown */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <div className="bg-gray-900/80 rounded-2xl p-6 backdrop-blur-sm border border-gray-800">
            <div className="flex items-center justify-between mb-2">
              <p className="text-gray-400 text-sm">Today</p>
              <TrendingUp className="w-4 h-4 text-green-500" />
            </div>
            <p className="text-2xl font-bold">₹{stats.dailyRevenue.toFixed(2)}</p>
          </div>
          <div className="bg-gray-900/80 rounded-2xl p-6 backdrop-blur-sm border border-gray-800">
            <div className="flex items-center justify-between mb-2">
              <p className="text-gray-400 text-sm">This Week</p>
              <TrendingUp className="w-4 h-4 text-blue-500" />
            </div>
            <p className="text-2xl font-bold">₹{stats.weeklyRevenue.toFixed(2)}</p>
          </div>
          <div className="bg-gray-900/80 rounded-2xl p-6 backdrop-blur-sm border border-gray-800">
            <div className="flex items-center justify-between mb-2">
              <p className="text-gray-400 text-sm">This Month</p>
              <TrendingUp className="w-4 h-4 text-purple-500" />
            </div>
            <p className="text-2xl font-bold">₹{stats.monthlyRevenue.toFixed(2)}</p>
          </div>
          <div className="bg-gray-900/80 rounded-2xl p-6 backdrop-blur-sm border border-gray-800">
            <div className="flex items-center justify-between mb-2">
              <p className="text-gray-400 text-sm">This Year</p>
              <TrendingUp className="w-4 h-4 text-amber-500" />
            </div>
            <p className="text-2xl font-bold">₹{stats.yearlyRevenue.toFixed(2)}</p>
          </div>
        </div>

        {/* Analytics Section */}
        <div className="grid lg:grid-cols-2 gap-8 mb-8">
          {/* Revenue Chart */}
          <div className="bg-gray-900/80 rounded-2xl p-6 backdrop-blur-sm border border-gray-800">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-xl font-bold">Revenue Overview</h2>
              <div className="flex gap-2">
                <button
                  onClick={() => setTimeRange('weekly')}
                  className={`px-3 py-1 rounded-full text-xs ${timeRange === 'weekly' ? 'bg-amber-600' : 'bg-gray-800'}`}
                >
                  Weekly
                </button>
                <button
                  onClick={() => setTimeRange('monthly')}
                  className={`px-3 py-1 rounded-full text-xs ${timeRange === 'monthly' ? 'bg-amber-600' : 'bg-gray-800'}`}
                >
                  Monthly
                </button>
                <button
                  onClick={() => setTimeRange('yearly')}
                  className={`px-3 py-1 rounded-full text-xs ${timeRange === 'yearly' ? 'bg-amber-600' : 'bg-gray-800'}`}
                >
                  Yearly
                </button>
              </div>
            </div>
            <div className="h-64" id="revenue-chart">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={stats.monthlyData}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#333" />
                  <XAxis dataKey="month" stroke="#666" />
                  <YAxis stroke="#666" />
                  <Tooltip 
                    contentStyle={{ backgroundColor: '#1a1a1a', border: '1px solid #333' }}
                    itemStyle={{ color: '#fff' }}
                  />
                  <Legend />
                  <Line type="monotone" dataKey="revenue" stroke="#F59E0B" strokeWidth={2} />
                  <Line type="monotone" dataKey="orders" stroke="#3B82F6" strokeWidth={2} />
                </LineChart>
              </ResponsiveContainer>
            </div>
          </div>

          {/* Order Status Distribution */}
          <div className="bg-gray-900/80 rounded-2xl p-6 backdrop-blur-sm border border-gray-800">
            <h2 className="text-xl font-bold mb-4">Order Status Distribution</h2>
            <div className="h-64">
              <ResponsiveContainer width="100%" height="100%">
                <RePieChart>
                  <Pie
                    data={stats.orderStatusData}
                    cx="50%"
                    cy="50%"
                    labelLine={false}
                    label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}
                    outerRadius={80}
                    fill="#8884d8"
                    dataKey="value"
                  >
                    {stats.orderStatusData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                    ))}
                  </Pie>
                  <Tooltip 
                    contentStyle={{ backgroundColor: '#1a1a1a', border: '1px solid #333' }}
                    itemStyle={{ color: '#fff' }}
                  />
                </RePieChart>
              </ResponsiveContainer>
            </div>
          </div>
        </div>

        {/* Top Products & Payment Methods */}
        <div className="grid lg:grid-cols-2 gap-8 mb-8">
          {/* Top Products */}
          <div className="bg-gray-900/80 rounded-2xl p-6 backdrop-blur-sm border border-gray-800">
            <h2 className="text-xl font-bold mb-4">Top Selling Products</h2>
            <div className="space-y-3">
              {stats.topProducts.map((product, index) => (
                <div key={index} className="flex items-center justify-between p-3 bg-gray-800/50 rounded-xl">
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 bg-amber-500/20 rounded-full flex items-center justify-center text-amber-400 font-bold">
                      {index + 1}
                    </div>
                    <div>
                      <p className="font-medium">{product.name}</p>
                      <p className="text-xs text-gray-400">{product.quantity} sold</p>
                    </div>
                  </div>
                  <p className="text-amber-400 font-bold">₹{product.revenue.toFixed(2)}</p>
                </div>
              ))}
            </div>
          </div>

          {/* Payment Methods */}
          <div className="bg-gray-900/80 rounded-2xl p-6 backdrop-blur-sm border border-gray-800">
            <h2 className="text-xl font-bold mb-4">Payment Methods</h2>
            <div className="h-48">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={stats.paymentMethodData}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#333" />
                  <XAxis dataKey="name" stroke="#666" />
                  <YAxis stroke="#666" />
                  <Tooltip 
                    contentStyle={{ backgroundColor: '#1a1a1a', border: '1px solid #333' }}
                    itemStyle={{ color: '#fff' }}
                  />
                  <Bar dataKey="value" fill="#F59E0B" />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>
        </div>

        {/* Recent Orders */}
        <div className="grid lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2">
            <div className="bg-gray-900/80 rounded-2xl p-6 backdrop-blur-sm border border-gray-800">
              <div className="flex justify-between items-center mb-4">
                <h2 className="text-xl font-bold">Recent Orders</h2>
                <button 
                  onClick={() => navigate('/admin/orders')}
                  className="text-sm text-amber-400 hover:text-amber-300"
                >
                  View All
                </button>
              </div>
              
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead>
                    <tr className="text-left text-gray-400 text-sm">
                      <th className="pb-3 px-2">Order ID</th>
                      <th className="pb-3 px-2">Customer</th>
                      <th className="pb-3 px-2">Amount</th>
                      <th className="pb-3 px-2">Status</th>
                      <th className="pb-3 px-2">Date</th>
                    </tr>
                  </thead>
                  <tbody>
                    {stats.recentOrders.length > 0 ? (
                      stats.recentOrders.map((order) => (
                        <tr key={order._id} className="border-t border-gray-800">
                          <td className="py-3 px-2 text-sm">#{order._id?.slice(-6)}</td>
                          <td className="py-3 px-2 text-sm">{order.user?.name || 'Guest'}</td>
                          <td className="py-3 px-2 text-sm text-amber-400">
                            ₹{order.totalAmount?.toFixed(2)}
                          </td>
                          <td className="py-3 px-2">
                            <span className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(order.orderStatus)}`}>
                              {order.orderStatus}
                            </span>
                          </td>
                          <td className="py-3 px-2 text-sm text-gray-400">
                            {formatDate(order.createdAt)}
                          </td>
                        </tr>
                      ))
                    ) : (
                      <tr>
                        <td colSpan="5" className="py-8 text-center text-gray-500">
                          No orders found
                        </td>
                      </tr>
                    )}
                  </tbody>
                </table>
              </div>
            </div>
          </div>

          {/* Low Stock Alert */}
          <div>
            <div className="bg-gray-900/80 rounded-2xl p-6 backdrop-blur-sm border border-gray-800">
              <h2 className="text-xl font-bold mb-4 flex items-center gap-2">
                <Package className="w-5 h-5 text-amber-400" />
                Low Stock Alert
              </h2>
              
              <div className="space-y-3">
                {stats.lowStockProducts.length > 0 ? (
                  stats.lowStockProducts.slice(0, 5).map((product) => (
                    <div key={product._id} className="flex items-center justify-between p-3 bg-gray-800/50 rounded-xl">
                      <div className="flex items-center gap-3">
                        <img 
                          src={product.image} 
                          alt={product.name}
                          className="w-10 h-10 rounded-lg object-cover"
                        />
                        <div>
                          <p className="text-sm font-medium">{product.name}</p>
                          <p className="text-xs text-gray-400">Stock: {product.stock}</p>
                        </div>
                      </div>
                      {product.stock === 0 ? (
                        <span className="text-red-400 text-xs font-medium">Out of Stock</span>
                      ) : (
                        <span className="text-yellow-400 text-xs font-medium">Low Stock</span>
                      )}
                    </div>
                  ))
                ) : (
                  <div className="text-center py-8 text-gray-500">
                    <CheckCircle className="w-12 h-12 mx-auto mb-2 text-green-500/50" />
                    <p>All products are well stocked</p>
                  </div>
                )}
              </div>

              {stats.lowStockProducts.length > 0 && (
                <button 
                  onClick={() => navigate('/admin/products')}
                  className="w-full mt-4 bg-gray-800 hover:bg-gray-700 text-white px-4 py-2 rounded-xl text-sm font-semibold transition-all"
                >
                  Restock Products
                </button>
              )}
            </div>

            {/* Quick Actions */}
            <div className="mt-6 bg-gray-900/80 rounded-2xl p-6 backdrop-blur-sm border border-gray-800">
              <h2 className="text-xl font-bold mb-4">Quick Actions</h2>
              <div className="space-y-2">
                <button 
                  onClick={() => navigate('/admin/add-product')}
                  className="w-full bg-gray-800 hover:bg-gray-700 text-white px-4 py-2 rounded-xl text-sm font-semibold transition-all flex items-center justify-center gap-2"
                >
                  <Coffee className="w-4 h-4" />
                  Add New Product
                </button>
                <button 
                  onClick={() => navigate('/admin/orders')}
                  className="w-full bg-gray-800 hover:bg-gray-700 text-white px-4 py-2 rounded-xl text-sm font-semibold transition-all flex items-center justify-center gap-2"
                >
                  <ShoppingBag className="w-4 h-4" />
                  View All Orders
                </button>
                <button 
                  onClick={() => navigate('/admin/products')}
                  className="w-full bg-gray-800 hover:bg-gray-700 text-white px-4 py-2 rounded-xl text-sm font-semibold transition-all flex items-center justify-center gap-2"
                >
                  <Package className="w-4 h-4" />
                  Manage Products
                </button>
                <button 
                  onClick={() => navigate('/admin/coupons')}
                  className="w-full bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-xl text-sm font-semibold transition-all flex items-center justify-center gap-2"
                >
                  <Ticket className="w-4 h-4" />
                  Manage Coupons
                </button>
                <button 
                  onClick={() => navigate('/admin/locations')}
                  className="w-full bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-xl text-sm font-semibold transition-all flex items-center justify-center gap-2"
                >
                  <Store className="w-4 h-4" />
                  Manage Locations
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;