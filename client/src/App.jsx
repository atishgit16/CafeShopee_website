import React from "react";
import { motion } from "framer-motion";
import "./index.css";
export default function CafeHome() {
  return (
    <div className="min-h-screen bg-black text-white overflow-hidden">
      {/* Transparent Header */}
      <header className="fixed top-0 left-0 w-full z-50 backdrop-blur-md bg-white/10 border-b border-white/10">
        <div className="max-w-7xl mx-auto flex justify-between items-center px-6 py-4">
          <h1 className="text-2xl font-bold tracking-wide">BrewHeaven</h1>
          <nav className="space-x-6 hidden md:flex">
            <a href="#" className="hover:text-amber-400">Home</a>
            <a href="#" className="hover:text-amber-400">Menu</a>
            <a href="#" className="hover:text-amber-400">About</a>
            <a href="#" className="hover:text-amber-400">Contact</a>
          </nav>
        </div>
      </header>

      {/* 3D Banner Section */}
      <section className="h-screen flex items-center justify-center relative">
        <div className="absolute inset-0 bg-gradient-to-br from-black via-gray-900 to-black"></div>

        {/* 3D Floating Card */}
        <motion.div
          initial={{ opacity: 0, y: 100, rotateX: 30 }}
          animate={{ opacity: 1, y: 0, rotateX: 0 }}
          transition={{ duration: 1 }}
          className="relative z-10  "
        >
          
        </motion.div>

        {/* 3D Coffee Circle Effect */}
        <div className="absolute w-[500px] h-[500px] bg-amber-500/20 rounded-full blur-3xl animate-pulse"></div>
      </section>

      {/* Features Section */}
      <section className="py-20 px-6 max-w-7xl mx-auto grid md:grid-cols-3 gap-8">
        {["Fresh Beans", "Cozy Space", "Fast Service"].map((item, i) => (
          <motion.div
            key={i}
            whileHover={{ scale: 1.05, rotateY: 10 }}
            className="bg-white/10 p-6 rounded-2xl border border-white/10 backdrop-blur-md shadow-xl"
          >
            <h3 className="text-xl font-semibold mb-2">{item}</h3>
            <p className="text-gray-400">
              Enjoy top quality {item.toLowerCase()} at our cafe with premium experience.
            </p>
          </motion.div>
        ))}
      </section>

      {/* Footer */}
      <footer className="text-center py-6 border-t border-white/10 text-gray-400">
        © 2026 BrewHeaven Cafe. All rights reserved.
      </footer>
    </div>
  );
}
