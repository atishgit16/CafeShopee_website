import React from "react";

const Footer = () => {
  return (
    <footer className="bg-black text-gray-400 pt-12 pb-6 px-6 border-t border-gray-800">
      <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-4 gap-8">

        {/* Brand */}
        <div>
          <h2 className="text-2xl font-bold text-white">BrewHeaven ☕</h2>
          <p className="mt-3 text-sm">
            Experience handcrafted coffee, cozy vibes, and a premium café culture.
          </p>
        </div>

        {/* Quick Links */}
        <div>
          <h3 className="text-white font-semibold mb-3">Quick Links</h3>
          <ul className="space-y-2 text-sm">
            <li><a href="/" className="hover:text-white transition">Home</a></li>
            <li><a href="/menu" className="hover:text-white transition">Menu</a></li>
            <li><a href="/about" className="hover:text-white transition">About Us</a></li>
            <li><a href="/contact" className="hover:text-white transition">Contact</a></li>
          </ul>
        </div>

        {/* Contact */}
        <div>
          <h3 className="text-white font-semibold mb-3">Contact</h3>
          <p className="text-sm">Mumbai, India</p>
          <p className="text-sm">+91 98765 43210</p>
          <p className="text-sm">hello@brewheaven.com</p>
        </div>

        {/* Social */}
        <div>
          <h3 className="text-white font-semibold mb-3">Follow Us</h3>
          <div className="flex space-x-4 text-lg">
            <a href="#" className="hover:text-white transition">🌐</a>
            <a href="#" className="hover:text-white transition">📸</a>
            <a href="#" className="hover:text-white transition">🐦</a>
          </div>
        </div>

      </div>

      {/* Bottom */}
      <div className="mt-10 text-center text-sm border-t border-gray-800 pt-4">
        <p>© {new Date().getFullYear()} BrewHeaven Cafe. All rights reserved.</p>
        <p className="mt-1 text-xs text-gray-500">
          Crafted with ☕ and passion in Mumbai.
        </p>
      </div>
    </footer>
  );
};

export default Footer;