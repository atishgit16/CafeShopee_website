// src/components/Footer.jsx
import React from 'react';
import { Link } from 'react-router-dom';
import { 
  MapPin, 
  Phone, 
  Mail, 
  Send 
} from 'lucide-react';

const Footer = () => {
  const currentYear = new Date().getFullYear();

  return (
<footer className="bg-black text-gray-300 border-t border-gray-800 pt-16 pb-8 relative z-50">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {/* Brand */}
          <div className="space-y-4">
            <h2 className="text-2xl font-bold bg-gradient-to-r from-amber-400 to-amber-600 bg-clip-text text-transparent">
              BrewHeaven
            </h2>
            <p className="text-sm leading-relaxed">
              Experience handcrafted coffee, cozy vibes, and a premium café culture.
            </p>
          </div>

          {/* Quick Links */}
          <div>
            <h3 className="text-white font-bold text-lg mb-4">Quick Links</h3>
            <ul className="space-y-2">
              <li><Link to="/" className="text-gray-400 hover:text-amber-400 transition-colors">Home</Link></li>
              <li><Link to="/menu" className="text-gray-400 hover:text-amber-400 transition-colors">Menu</Link></li>
              <li><Link to="/about" className="text-gray-400 hover:text-amber-400 transition-colors">About</Link></li>
              <li><Link to="/contact" className="text-gray-400 hover:text-amber-400 transition-colors">Contact</Link></li>
            </ul>
          </div>

          {/* Contact Info */}
          <div>
            <h3 className="text-white font-bold text-lg mb-4">Contact</h3>
            <ul className="space-y-2 text-sm">
              <li className="flex items-center gap-2">
                <MapPin className="w-4 h-4 text-amber-400" />
                <span>Mumbai, India</span>
              </li>
              <li className="flex items-center gap-2">
                <Phone className="w-4 h-4 text-amber-400" />
                <span>+91 98765 43210</span>
              </li>
              <li className="flex items-center gap-2">
                <Mail className="w-4 h-4 text-amber-400" />
                <span>hello@brewheaven.com</span>
              </li>
            </ul>
          </div>

          {/* Newsletter */}
          <div>
            <h3 className="text-white font-bold text-lg mb-4">Newsletter</h3>
            <p className="text-sm text-gray-400 mb-3">Subscribe for updates</p>
            <form className="flex gap-2">
              <input
                type="email"
                placeholder="Your email"
                className="flex-1 px-4 py-2 bg-gray-800 border border-gray-700 rounded-xl focus:outline-none focus:border-amber-500 text-white text-sm"
                required
              />
              <button 
                type="submit"
                className="px-4 py-2 bg-amber-600 hover:bg-amber-700 rounded-xl transition-colors"
              >
                <Send className="w-4 h-4 text-white" />
              </button>
            </form>
          </div>
        </div>

        {/* Bottom */}
        <div className="border-t border-gray-800 mt-12 pt-6 text-center">
          <p className="text-sm text-gray-400">
            © {currentYear} <span className="text-amber-400">BrewHeaven</span> Cafe. All rights reserved.
          </p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;