// components/Header.jsx (Enhanced version with additional features)
import React, { useState } from 'react';
import { motion } from 'framer-motion';

const Header = ({ scrolled, scrollToSection, heroRef, aboutRef, menuRef, contactRef }) => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const navItems = ['Home', 'About', 'Menu', 'Contact'];
  const refs = { Home: heroRef, About: aboutRef, Menu: menuRef, Contact: contactRef };

  return (
    <>
      <nav className={`fixed top-0 w-full z-50 transition-all duration-500 ${
        scrolled ? 'bg-black/50 backdrop-blur-lg py-3 shadow-2xl' : 'bg-transparent py-6'
      }`}>
        <div className="container mx-auto px-6 flex justify-between items-center">
          {/* Logo */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8 }}
            className="flex items-center space-x-2"
          >
     <img  onClick={() => scrollToSection(heroRef)}
  src="/logo1.png" 
  alt="BrewHeaven Logo" 
  className="h-20 w-auto object-contain hover:scale-110 transition duration-300"
/>
          </motion.div>

          {/* Desktop Navigation */}
          <div className="hidden md:flex space-x-8 text-lg font-medium">
            {navItems.map((item) => (
              <motion.button
                key={item}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => scrollToSection(refs[item])}
                className="hover:text-amber-400 transition-colors duration-300 relative group"
              >
                {item}
                <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-amber-400 transition-all duration-300 group-hover:w-full"></span>
              </motion.button>
            ))}
          </div>

          {/* Mobile menu button */}
          <div className="md:hidden">
            <button 
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="text-white hover:text-amber-400 transition"
            >
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
              </svg>
            </button>
          </div>

          {/* Order Button */}
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            className="bg-amber-600 hover:bg-amber-700 px-5 py-2 rounded-full font-semibold transition-all shadow-lg hidden sm:block"
          >
            Order Now
          </motion.button>
        </div>
      </nav>

      {/* Mobile Menu */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ 
          opacity: mobileMenuOpen ? 1 : 0,
          y: mobileMenuOpen ? 0 : -20,
          pointerEvents: mobileMenuOpen ? 'auto' : 'none'
        }}
        transition={{ duration: 0.3 }}
        className={`fixed top-16 left-0 right-0 z-40 bg-black/95 backdrop-blur-lg p-4 md:hidden`}
      >
        <div className="flex flex-col space-y-4">
          {navItems.map((item) => (
            <button
              key={item}
              onClick={() => {
                scrollToSection(refs[item]);
                setMobileMenuOpen(false);
              }}
              className="text-lg font-medium hover:text-amber-400 transition-colors py-2 border-b border-white/10"
            >
              {item}
            </button>
          ))}
          <button className="bg-amber-600 hover:bg-amber-700 px-5 py-3 rounded-full font-semibold transition-all">
            Order Now
          </button>
        </div>
      </motion.div>
    </>
  );
};

export default Header;