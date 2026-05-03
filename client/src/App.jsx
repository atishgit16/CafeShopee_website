// App.jsx
import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { Toaster } from 'react-hot-toast';
import { AuthProvider } from './context/AuthContext';
import ProtectedRoute from './components/ProtectedRoute';


// Pages
import Home from './pages/Home';
import Menu from './pages/Menu';
import Cart from './pages/Cart';
import Contact from './pages/Contact';
import Checkout from './pages/Checkout';
import Login from './pages/Login';
import About from './pages/About';
import Register from './pages/Register';
import OrderSuccess from './pages/OrderSuccess';
import AdminDashboard from './pages/AdminDashboard';
import AdminProducts from './pages/AdminProducts';
import AdminOrders from './pages/AdminOrders';
import AdminAddProduct from './pages/AdminAddProduct';
import AdminEditProduct from './pages/AdminEditProduct';
import AdminCoupons from './pages/AdminCoupons';
import AdminAddCoupon from './pages/AdminAddCoupon';
import AdminLocations from './pages/AdminLocations';
import AdminAddLocation from './pages/AdminAddLocation';
import AdminLocationTables from './pages/AdminLocationTables';
import UserOrders from './pages/UserOrders';
import OrderTracking from './pages/OrderTracking';
import { CartProvider } from './context/CartContext';

// Components
import Header from './components/Header';
import Footer from './components/Footer';

function App() {

  

  //verify api is correctly loaded from .env

   console.log('API URL:', import.meta.env.VITE_API_URL);

  return (
    <Router>

      <AuthProvider>
         <CartProvider>
        <div className="min-h-screen flex flex-col bg-black">
          <Header />
          <main className="flex-grow">
            <Routes>
              <Route path="/" element={<Home />} />
              <Route path="/menu" element={<Menu />} />
              <Route path="/login" element={<Login />} />
              <Route path="/register" element={<Register />} />
              <Route path="/contact" element={<Contact />} />
              <Route path="/About" element={<About />} />
              {/* Protected Routes */}
              <Route path="/cart" element={
                <ProtectedRoute>
                  <Cart />
                </ProtectedRoute>
              } />
              <Route path="/checkout" element={
                <ProtectedRoute>
                  <Checkout />
                </ProtectedRoute>
              } />
              <Route path="/order-success" element={
                <ProtectedRoute>
                  <OrderSuccess />
                </ProtectedRoute>
              } />
              <Route path="/order-tracking/:orderId" element={
  <ProtectedRoute>
    <OrderTracking />
  </ProtectedRoute>
} />
// In the protected routes section, add:
<Route path="/my-orders" element={
  <ProtectedRoute>
    <UserOrders />
  </ProtectedRoute>
} />

              {/* Admin Routes - Fixed paths with /admin prefix */}
              <Route path="/admin" element={
                <ProtectedRoute requireAdmin>
                  <AdminDashboard />
                </ProtectedRoute>
              } />
              <Route path="/admin/products" element={
                <ProtectedRoute requireAdmin>
                  <AdminProducts />
                </ProtectedRoute>
              } />
              <Route path="/admin/orders" element={
                <ProtectedRoute requireAdmin>
                  <AdminOrders />
                </ProtectedRoute>
              } />
              <Route path="/admin/add-product" element={
                <ProtectedRoute requireAdmin>
                  <AdminAddProduct />
                </ProtectedRoute>
              } />
              <Route path="/admin/edit-product/:id" element={
  <ProtectedRoute requireAdmin>
    <AdminEditProduct />
  </ProtectedRoute>
} />
<Route path="/admin/coupons" element={
  <ProtectedRoute requireAdmin>
    <AdminCoupons />
  </ProtectedRoute>
} />
<Route path="/admin/add-coupon" element={
  <ProtectedRoute requireAdmin>
    <AdminAddCoupon />
  </ProtectedRoute>
} />
<Route path="/admin/edit-coupon/:id" element={
  <ProtectedRoute requireAdmin>
    <AdminAddCoupon />
  </ProtectedRoute>
} />
  
              {/* Admin - Locations */}
              <Route path="/admin/locations" element={
                <ProtectedRoute requireAdmin>
                  <AdminLocations />
                </ProtectedRoute>
              } />
              <Route path="/admin/add-location" element={
                <ProtectedRoute requireAdmin>
                  <AdminAddLocation />
                </ProtectedRoute>
              } />
              <Route path="/admin/edit-location/:id" element={
                <ProtectedRoute requireAdmin>
                  <AdminAddLocation />
                </ProtectedRoute>
              } />
              <Route path="/admin/location/:id/tables" element={
                <ProtectedRoute requireAdmin>
                  <AdminLocationTables />
                </ProtectedRoute>
              } />
              
              {/* 404 */}
              <Route path="*" element={<Navigate to="/" />} />
            </Routes>
          </main>
          <Footer />
          <Toaster position="top-right" />
        </div>
        </CartProvider>
      </AuthProvider>
    </Router>
  );
}

export default App;