// src/pages/admin/AdminAddLocation.jsx
import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import axios from 'axios';
import toast from 'react-hot-toast';
import { ArrowLeft, Save, LocateFixed, Loader2 } from 'lucide-react';

const AdminAddLocation = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [detectingLocation, setDetectingLocation] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    address: '',
    coordinates: {
      lat: 19.0777,
      lng: 72.8777
    },
    deliveryRadius: 10
  });

  const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';

  useEffect(() => {
    if (id) {
      fetchLocation();
    }
  }, [id]);

  const fetchLocation = async () => {
    try {
      const response = await axios.get(`${API_URL}/locations/${id}`);
      setFormData(response.data);
    } catch (error) {
      console.error('Fetch location error:', error);
      toast.error('Failed to load location');
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    if (name === 'lat' || name === 'lng') {
      setFormData(prev => ({
        ...prev,
        coordinates: {
          ...prev.coordinates,
          [name]: parseFloat(value) || 0
        }
      }));
    } else {
      setFormData(prev => ({
        ...prev,
        [name]: value
      }));
    }
  };

  const detectCurrentLocation = () => {
    if (!navigator.geolocation) {
      toast.error('Geolocation is not supported by your browser');
      return;
    }

    setDetectingLocation(true);
    toast.loading('Detecting your location...');

    navigator.geolocation.getCurrentPosition(
      (position) => {
        toast.dismiss();
        setFormData(prev => ({
          ...prev,
          coordinates: {
            lat: position.coords.latitude,
            lng: position.coords.longitude
          }
        }));
        toast.success('Location detected successfully!');
        setDetectingLocation(false);
      },
      (error) => {
        toast.dismiss();
        console.error('Geolocation error:', error);
        toast.error('Unable to detect location. Please enter manually.');
        setDetectingLocation(false);
      }
    );
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      if (id) {
        await axios.put(`${API_URL}/locations/${id}`, formData);
        toast.success('Location updated successfully');
      } else {
        await axios.post(`${API_URL}/locations`, formData);
        toast.success('Location created successfully');
      }
      navigate('/admin/locations');
    } catch (error) {
      console.error('Location save error:', error);
      toast.error('Failed to save location');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-black text-white pt-20 pb-12">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 max-w-3xl">
        <div className="flex items-center gap-4 mb-8">
          <button
            onClick={() => navigate('/admin/locations')}
            className="p-2 rounded-full hover:bg-gray-800 transition-colors"
          >
            <ArrowLeft className="w-6 h-6" />
          </button>
          <h1 className="text-3xl md:text-4xl font-bold bg-gradient-to-r from-blue-400 to-amber-500 bg-clip-text text-transparent">
            {id ? 'Edit Location' : 'Add New Location'}
          </h1>
        </div>

        <form onSubmit={handleSubmit} className="bg-gray-900/80 rounded-2xl p-6 backdrop-blur-sm border border-gray-800 space-y-6">
          <div>
            <label className="block text-sm font-medium text-gray-300 mb-2">
              Location Name <span className="text-red-400">*</span>
            </label>
            <input
              name="name"
              value={formData.name}
              onChange={handleChange}
              placeholder="e.g., BrewHeaven Main"
              className="w-full px-4 py-3 bg-gray-800 border border-gray-700 rounded-xl focus:outline-none focus:border-blue-500 text-white"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-300 mb-2">
              Address <span className="text-red-400">*</span>
            </label>
            <input
              name="address"
              value={formData.address}
              onChange={handleChange}
              placeholder="123 Coffee Lane, Mumbai"
              className="w-full px-4 py-3 bg-gray-800 border border-gray-700 rounded-xl focus:outline-none focus:border-blue-500 text-white"
              required
            />
          </div>

          <div>
            <div className="flex items-center justify-between mb-2">
              <label className="block text-sm font-medium text-gray-300">
                Coordinates <span className="text-red-400">*</span>
              </label>
              <button
                type="button"
                onClick={detectCurrentLocation}
                disabled={detectingLocation}
                className="flex items-center gap-2 text-blue-400 hover:text-blue-300 text-sm transition-colors disabled:opacity-50"
              >
                {detectingLocation ? (
                  <>
                    <Loader2 className="w-4 h-4 animate-spin" />
                    Detecting...
                  </>
                ) : (
                  <>
                    <LocateFixed className="w-4 h-4" />
                    Detect Location
                  </>
                )}
              </button>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm text-gray-400 mb-1">Latitude</label>
                <input
                  name="lat"
                  type="number"
                  step="any"
                  value={formData.coordinates.lat}
                  onChange={handleChange}
                  placeholder="19.0777"
                  className="w-full px-4 py-3 bg-gray-800 border border-gray-700 rounded-xl focus:outline-none focus:border-blue-500 text-white"
                />
              </div>
              <div>
                <label className="block text-sm text-gray-400 mb-1">Longitude</label>
                <input
                  name="lng"
                  type="number"
                  step="any"
                  value={formData.coordinates.lng}
                  onChange={handleChange}
                  placeholder="72.8777"
                  className="w-full px-4 py-3 bg-gray-800 border border-gray-700 rounded-xl focus:outline-none focus:border-blue-500 text-white"
                />
              </div>
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-300 mb-2">
              Delivery Radius (km)
            </label>
            <input
              name="deliveryRadius"
              type="number"
              value={formData.deliveryRadius}
              onChange={handleChange}
              placeholder="10"
              className="w-full px-4 py-3 bg-gray-800 border border-gray-700 rounded-xl focus:outline-none focus:border-blue-500 text-white"
            />
          </div>

          <div className="flex gap-4 pt-4">
            <button
              type="submit"
              disabled={loading}
              className="flex-1 bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-xl font-semibold transition-all transform hover:scale-105 disabled:opacity-50"
            >
              {loading ? 'Saving...' : id ? 'Update Location' : 'Create Location'}
            </button>
            <button
              type="button"
              onClick={() => navigate('/admin/locations')}
              className="flex-1 bg-gray-800 hover:bg-gray-700 text-white px-6 py-3 rounded-xl font-semibold transition-all"
            >
              Cancel
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default AdminAddLocation;