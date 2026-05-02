// src/pages/Contact.jsx
import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { MapPin, Phone, Mail, Clock, Send, Loader2 } from 'lucide-react';
import axios from 'axios';
import toast from 'react-hot-toast';

const Contact = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    subject: '',
    message: ''
  });
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';
      const response = await axios.post(`${API_URL}/contact`, formData);
      toast.success('Message sent successfully! Thank you for reaching out.');
      setFormData({
        name: '',
        email: '',
        phone: '',
        subject: '',
        message: ''
      });
    } catch (error) {
      console.error('Contact form error:', error);
      toast.error(error.response?.data?.message || 'Failed to send message. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-black to-gray-900 text-white pt-20 pb-12">
      {/* Hero Section */}
      <div className="relative py-16 bg-gradient-to-r from-amber-900/30 to-black">
        <div className="container mx-auto px-4 text-center">
          <motion.h1 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="text-4xl md:text-6xl font-bold mb-4 bg-gradient-to-r from-amber-400 to-amber-600 bg-clip-text text-transparent"
          >
            Contact Us
          </motion.h1>
          <motion.p 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.1 }}
            className="text-xl text-gray-300 max-w-2xl mx-auto"
          >
            Have a question, suggestion, or just want to say hello? We'd love to hear from you.
          </motion.p>
        </div>
      </div>

      {/* Main Content */}
      <div className="container mx-auto px-4 py-12">
        <div className="grid lg:grid-cols-2 gap-12">
          {/* Contact Information */}
          <div className="space-y-8">
            <div>
              <h2 className="text-2xl font-bold mb-6 text-amber-400">Get in Touch</h2>
              <p className="text-gray-300 mb-6">
                Visit us at our café, give us a call, or send us an email. We're always happy to help!
              </p>
            </div>

            {/* Contact Cards */}
            <div className="space-y-4">
              <div className="flex items-start gap-4 p-4 bg-gray-900/60 rounded-xl backdrop-blur-sm border border-gray-800 hover:border-amber-500/30 transition-all">
                <div className="p-3 bg-amber-500/20 rounded-full">
                  <MapPin className="w-6 h-6 text-amber-400" />
                </div>
                <div>
                  <h3 className="font-semibold">Address</h3>
                  <p className="text-gray-400">097 Coffee Lane, Brewtown,<br />Shiv Krupa Building H Wing Andheri, Mumbai 400 069</p>
                </div>
              </div>

              <div className="flex items-start gap-4 p-4 bg-gray-900/60 rounded-xl backdrop-blur-sm border border-gray-800 hover:border-amber-500/30 transition-all">
                <div className="p-3 bg-amber-500/20 rounded-full">
                  <Phone className="w-6 h-6 text-amber-400" />
                </div>
                <div>
                  <h3 className="font-semibold">Phone</h3>
                  <p className="text-gray-400">+91 32746 24887</p>
                </div>
              </div>

              <div className="flex items-start gap-4 p-4 bg-gray-900/60 rounded-xl backdrop-blur-sm border border-gray-800 hover:border-amber-500/30 transition-all">
                <div className="p-3 bg-amber-500/20 rounded-full">
                  <Mail className="w-6 h-6 text-amber-400" />
                </div>
                <div>
                  <h3 className="font-semibold">Email</h3>
                  <p className="text-gray-400">hello@brewheaven.com</p>
                </div>
              </div>

              <div className="flex items-start gap-4 p-4 bg-gray-900/60 rounded-xl backdrop-blur-sm border border-gray-800 hover:border-amber-500/30 transition-all">
                <div className="p-3 bg-amber-500/20 rounded-full">
                  <Clock className="w-6 h-6 text-amber-400" />
                </div>
                <div>
                  <h3 className="font-semibold">Working Hours</h3>
                  <p className="text-gray-400">Monday - Friday: 7:00 AM - 8:00 PM<br />Saturday - Sunday: 8:00 AM - 9:00 PM</p>
                </div>
              </div>
            </div>

            {/* Google Maps */}
            <div className="bg-gray-900/60 rounded-2xl overflow-hidden border border-gray-800 h-64">
              <iframe
                src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3769.6328235490046!2d72.84938797499123!3d19.123757332090715!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x3be7c82b45195a29%3A0x9f5c6c8886a28949!2sShiv%20Krupa%20Building%20H%20Wing!5e0!3m2!1sen!2sus!4v1777747983862!5m2!1sen!2sus" 
                width="100%"
                height="100%"
                style={{ border: 0 }}
                allowFullScreen=""
                loading="lazy"
                referrerPolicy="no-referrer-when-downgrade"
                className="w-full h-full"
              />
            </div>
          </div>

          {/* Contact Form */}
          <div className="bg-gray-900/80 backdrop-blur-sm rounded-2xl p-6 md:p-8 border border-gray-800 shadow-2xl">
            <h2 className="text-2xl font-bold mb-6 text-amber-400">Send Us a Message</h2>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">
                  Your Name <span className="text-red-400">*</span>
                </label>
                <input
                  type="text"
                  name="name"
                  value={formData.name}
                  onChange={handleChange}
                  required
                  className="w-full px-4 py-3 bg-gray-800 border border-gray-700 rounded-xl focus:outline-none focus:border-amber-500 text-white transition-colors"
                  placeholder="your name"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">
                  Email Address <span className="text-red-400">*</span>
                </label>
                <input
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  required
                  className="w-full px-4 py-3 bg-gray-800 border border-gray-700 rounded-xl focus:outline-none focus:border-amber-500 text-white transition-colors"
                  placeholder="youremail@example.com"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">
                  Phone Number
                </label>
                <input
                  type="tel"
                  name="phone"
                  value={formData.phone}
                  onChange={handleChange}
                  className="w-full px-4 py-3 bg-gray-800 border border-gray-700 rounded-xl focus:outline-none focus:border-amber-500 text-white transition-colors"
                  placeholder="+1 234 567 890"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">
                  Subject <span className="text-red-400">*</span>
                </label>
                <input
                  type="text"
                  name="subject"
                  value={formData.subject}
                  onChange={handleChange}
                  required
                  className="w-full px-4 py-3 bg-gray-800 border border-gray-700 rounded-xl focus:outline-none focus:border-amber-500 text-white transition-colors"
                  placeholder="How can we help you?"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">
                  Message <span className="text-red-400">*</span>
                </label>
                <textarea
                  name="message"
                  value={formData.message}
                  onChange={handleChange}
                  required
                  rows="4"
                  className="w-full px-4 py-3 bg-gray-800 border border-gray-700 rounded-xl focus:outline-none focus:border-amber-500 text-white transition-colors resize-none"
                  placeholder="Write your message here..."
                />
              </div>

              <button
                type="submit"
                disabled={loading}
                className="w-full bg-amber-600 hover:bg-amber-700 text-white py-3 rounded-xl font-semibold transition-all transform hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
              >
                {loading ? (
                  <>
                    <Loader2 className="w-5 h-5 animate-spin" />
                    Sending...
                  </>
                ) : (
                  <>
                    <Send className="w-5 h-5" />
                    Send Message
                  </>
                )}
              </button>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Contact;