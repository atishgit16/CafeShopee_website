// src/pages/admin/AdminLocations.jsx
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import toast from 'react-hot-toast';
import { 
  Plus, 
  Edit, 
  Trash2, 
  MapPin, 
  Search,
  ArrowLeft,
  Table
} from 'lucide-react';

const AdminLocations = () => {
  const [locations, setLocations] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const navigate = useNavigate();

  const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';

  useEffect(() => {
    fetchLocations();
  }, []);

  const fetchLocations = async () => {
    try {
      const response = await axios.get(`${API_URL}/locations`);
      setLocations(response.data);
    } catch (error) {
      console.error('Fetch locations error:', error);
      toast.error('Failed to load locations');
    } finally {
      setLoading(false);
    }
  };

  const deleteLocation = async (id) => {
    if (!window.confirm('Are you sure you want to delete this location?')) return;
    try {
      await axios.delete(`${API_URL}/locations/${id}`);
      toast.success('Location deleted successfully');
      fetchLocations();
    } catch (error) {
      console.error('Delete location error:', error);
      toast.error('Failed to delete location');
    }
  };

  const filteredLocations = locations.filter(location =>
    location.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    location.address.toLowerCase().includes(searchTerm.toLowerCase())
  );

  if (loading) {
    return (
      <div className="min-h-screen bg-black text-white flex items-center justify-center pt-20">
        <div className="text-center">
          <div className="text-4xl mb-4 animate-pulse">📍</div>
          <div className="text-xl text-gray-400 animate-pulse">Loading locations...</div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-black text-white pt-20 pb-12">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between mb-8">
          <div className="flex items-center gap-4">
            <button
              onClick={() => navigate('/admin')}
              className="p-2 rounded-full hover:bg-gray-800 transition-colors"
            >
              <ArrowLeft className="w-6 h-6" />
            </button>
            <h1 className="text-3xl md:text-4xl font-bold bg-gradient-to-r from-amber-400 to-amber-600 bg-clip-text text-transparent">
              Location Management
            </h1>
          </div>
          <button
            onClick={() => navigate('/admin/add-location')}
            className="bg-amber-600 hover:bg-amber-700 text-white px-4 py-2 rounded-full text-sm font-semibold transition-all flex items-center gap-2"
          >
            <Plus className="w-4 h-4" />
            Add Location
          </button>
        </div>

        <div className="bg-gray-900/80 rounded-2xl p-6 backdrop-blur-sm border border-gray-800">
          <div className="relative mb-6">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-500" />
            <input
              type="text"
              placeholder="Search locations..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-3 bg-gray-800 border border-gray-700 rounded-xl focus:outline-none focus:border-amber-500 text-white"
            />
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredLocations.map((location) => (
              <div
                key={location._id}
                className="group bg-gray-800/50 rounded-2xl p-6 border border-gray-700 hover:border-amber-500/30 transition-all"
              >
                <div className="flex justify-between items-start mb-4">
                  <div>
                    <h3 className="text-xl font-bold text-amber-400">{location.name}</h3>
                    <p className="text-sm text-gray-400">{location.address}</p>
                    <p className="text-xs text-gray-500">
                      Delivery Radius: {location.deliveryRadius || 10}km
                    </p>
                    <p className="text-xs text-gray-500">
                      Tables: {location.tables?.length || 0}
                    </p>
                  </div>
                  <div className="flex gap-2">
                    <button
                      onClick={() => navigate(`/admin/edit-location/${location._id}`)}
                      className="p-2 bg-gray-700 rounded-full hover:bg-amber-600 transition-colors"
                    >
                      <Edit className="w-4 h-4" />
                    </button>
                    <button
                      onClick={() => deleteLocation(location._id)}
                      className="p-2 bg-gray-700 rounded-full hover:bg-red-600 transition-colors"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>
                <div className="flex items-center gap-4">
                  <MapPin className="w-4 h-4 text-gray-400" />
                  <span className="text-xs text-gray-400">
                    {location.coordinates?.lat}, {location.coordinates?.lng}
                  </span>
                </div>
                <button
                  onClick={() => navigate(`/admin/location/${location._id}/tables`)}
                  className="mt-4 w-full bg-gray-700 hover:bg-gray-600 text-white py-2 rounded-xl text-sm font-semibold transition-all"
                >
                  <Table className="w-4 h-4 inline mr-2" />
                  Manage Tables
                </button>
              </div>
            ))}
          </div>

          {filteredLocations.length === 0 && (
            <div className="text-center py-12">
              <MapPin className="w-16 h-16 mx-auto text-gray-600 mb-4" />
              <p className="text-gray-400">No locations found</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default AdminLocations;