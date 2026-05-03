// components/Header.jsx - Updated with CartContext and responsive mobile menu
import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useCart } from '../context/CartContext';
import { ShoppingCart, LogOut, Menu, X } from 'lucide-react';
import toast from 'react-hot-toast';

const Header = ({ scrolled = false, scrollToSection, heroRef, aboutRef, menuRef, contactRef }) => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const { user, logout, isAuthenticated, isAdmin } = useAuth();
  const { cartCount } = useCart(); // Get cartCount from CartContext
  const navigate = useNavigate();
  const location = useLocation();

  const handleLogout = () => {
    logout();
    navigate('/');
    toast.success('Logged out successfully');
  };

  // Navigation items based on authentication status
  const navItems = [
    { name: 'Home', path: '/', ref: heroRef },
    { name: 'About', path: '/about', ref: aboutRef },
    { name: 'Menu', path: '/menu', ref: menuRef },
    { name: 'Contact', path: '/contact', ref: contactRef },
    ...(isAuthenticated ? [
      { name: 'My Orders', path: '/my-orders' }
    ] : []),
    ...(isAdmin ? [{ name: 'Admin', path: '/admin' }] : []),
  ];

  const handleNavigation = (item) => {
    if (item.ref && scrollToSection && location.pathname === '/') {
      scrollToSection(item.ref);
    } else if (item.ref && scrollToSection) {
      navigate('/');
      setTimeout(() => {
        scrollToSection(item.ref);
      }, 100);
    } else {
      navigate(item.path);
    }
    setMobileMenuOpen(false);
  };

  const handleLogoClick = () => {
    if (location.pathname === '/' && scrollToSection) {
      scrollToSection(heroRef);
    } else {
      navigate('/');
    }
  };

  return (
    <>
      <nav className={`fixed top-0 w-full z-50 transition-all duration-500 ${
        scrolled ? 'bg-black/70 backdrop-blur-xl py-1 shadow-xl border-b border-white/10' : 'bg-black/30 backdrop-blur-sm py-1'
      }`}>
        <div className="container mx-auto px-4 sm:px-6 flex justify-between items-center h-16 sm:h-auto">
          {/* Logo */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8 }}
            className="flex items-center space-x-2 cursor-pointer"
            onClick={handleLogoClick}
          >
            <img 
              src="/logo1.png" 
              alt="BrewHeaven Logo" 
              className="h-12 sm:h-16 md:h-20 w-auto object-contain hover:scale-110 transition duration-300"
            />
          </motion.div>

          {/* Desktop Navigation */}
          <div className="hidden md:flex space-x-8 text-lg font-medium">
            {navItems.map((item) => (
              <motion.button
                key={item.name}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => handleNavigation(item)}
                className="text-white hover:text-amber-400 transition-colors duration-300 relative group"
              >
                {item.name}
                <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-amber-400 transition-all duration-300 group-hover:w-full"></span>
              </motion.button>
            ))}
          </div>

          {/* Desktop Right Section */}
          <div className="hidden md:flex items-center space-x-6">
            {isAuthenticated ? (
              <>
                <Link to="/cart" className="relative text-white hover:text-amber-400 transition-colors">
                  <ShoppingCart className="w-6 h-6" />
                  <span className="absolute -top-2 -right-2 bg-amber-600 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center">
                    {cartCount}
                  </span>
                </Link>
                <div className="flex items-center space-x-3">
                  <span className="text-white font-medium">{user?.name}</span>
                  <button
                    onClick={handleLogout}
                    className="text-white hover:text-red-400 transition-colors"
                  >
                    <LogOut className="w-5 h-5" />
                  </button>
                </div>
              </>
            ) : (
              <div className="flex items-center space-x-4">
                <Link
                  to="/login"
                  className="text-white hover:text-amber-400 transition-colors text-lg font-medium"
                >
                  Login
                </Link>
                <Link
                  to="/register"
                  className="bg-amber-600 hover:bg-amber-700 text-white px-5 py-2 rounded-full font-semibold transition-all shadow-lg"
                >
                  Sign Up
                </Link>
              </div>
            )}
          </div>

          {/* Mobile menu button */}
          <div className="md:hidden">
            <button 
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="text-white hover:text-amber-400 transition"
            >
              {mobileMenuOpen ? (
                <X className="w-6 h-6" />
              ) : (
                <Menu className="w-6 h-6" />
              )}
            </button>
          </div>
        </div>
      </nav>

      {/* Mobile Menu - Responsive 3 lines max - With WHITE TEXT */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ 
          opacity: mobileMenuOpen ? 1 : 0,
          y: mobileMenuOpen ? 0 : -20,
          pointerEvents: mobileMenuOpen ? 'auto' : 'none'
        }}
        transition={{ duration: 0.3 }}
        className={`fixed top-16 left-0 right-0 z-40 bg-black/95 backdrop-blur-lg p-4 md:hidden max-h-[80vh] overflow-y-auto`}
      >
        <div className="flex flex-col space-y-2">
          {/* First 3 items - WITH text-white */}
          {navItems.slice(0, 3).map((item) => (
            <button
              key={item.name}
              onClick={() => handleNavigation(item)}
              className="text-lg font-medium text-white hover:text-amber-400 transition-colors py-2 border-b border-white/10 text-left"
            >
              {item.name}
            </button>
          ))}
          
          {/* Remaining items - WITH text-white */}
          {navItems.length > 3 && (
            <div className="mt-2 border-t border-white/10 pt-2">
              {navItems.slice(3).map((item) => (
                <button
                  key={item.name}
                  onClick={() => handleNavigation(item)}
                  className="text-lg font-medium text-white hover:text-amber-400 transition-colors py-2 border-b border-white/10 text-left w-full"
                >
                  {item.name}
                </button>
              ))}
            </div>
          )}
          
          {/* Auth section - WITH text-white */}
          {isAuthenticated ? (
            <>
              <button 
                onClick={handleLogout}
                className="text-lg font-medium text-white hover:text-red-400 transition-colors py-2 border-b border-white/10 text-left"
              >
                Logout
              </button>
            </>
          ) : (
            <>
              <button
                onClick={() => {
                  navigate('/login');
                  setMobileMenuOpen(false);
                }}
                className="text-lg font-medium text-white hover:text-amber-400 transition-colors py-2 border-b border-white/10 text-left"
              >
                Login
              </button>
              <button
                onClick={() => {
                  navigate('/register');
                  setMobileMenuOpen(false);
                }}
                className="bg-amber-600 hover:bg-amber-700 text-white px-5 py-3 rounded-full font-semibold transition-all text-center mt-2"
              >
                Sign Up
              </button>
            </>
          )}
        </div>
      </motion.div>
    </>
  );
};

export default Header;