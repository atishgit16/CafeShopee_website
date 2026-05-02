// src/pages/admin/AdminAddLocation.jsx
import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import axios from 'axios';
import toast from 'react-hot-toast';
import { ArrowLeft, MapPin, LocateFixed, Loader2, AlertCircle } from 'lucide-react';

const AdminAddLocation = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [detectingLocation, setDetectingLocation] = useState(false);
  const [locationError, setLocationError] = useState(null);
  const [formData, setFormData] = useState({
    name: '',
    address: '',
    coordinates: {
      lat: '',
      lng: ''
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
    if (name.startsWith('coord.')) {
      const field = name.split('.')[1];
      setFormData(prev => ({
        ...prev,
        coordinates: {
          ...prev.coordinates,
          [field]: parseFloat(value) || ''
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
    setDetectingLocation(true);
    setLocationError(null);
    
    // Check if geolocation is supported
    if (!navigator.geolocation) {
      setLocationError('Geolocation is not supported by your browser');
      toast.error('Geolocation is not supported by your browser');
      setDetectingLocation(false);
      return;
    }

    navigator.geolocation.getCurrentPosition(
      (position) => {
        const { latitude, longitude } = position.coords;
        setFormData(prev => ({
          ...prev,
          coordinates: {
            lat: latitude,
            lng: longitude
          }
        }));
        toast.success('Location detected successfully!');
        setDetectingLocation(false);
      },
      (error) => {
        console.error('Geolocation error:', error);
        let errorMessage = 'Failed to detect location.';
        
        switch(error.code) {
          case error.PERMISSION_DENIED:
            errorMessage = 'Location access denied. Please allow location access in your browser settings.';
            break;
          case error.POSITION_UNAVAILABLE:
            errorMessage = 'Location information is unavailable. Please try again or enter coordinates manually.';
            break;
          case error.TIMEOUT:
            errorMessage = 'Location request timed out. Please try again or enter coordinates manually.';
            break;
          default:
            errorMessage = 'An unknown error occurred. Please enter coordinates manually.';
        }
        
        setLocationError(errorMessage);
        toast.error(errorMessage);
        setDetectingLocation(false);
      },
      {
        enableHighAccuracy: true,
        timeout: 15000,
        maximumAge: 0
      }
    );
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      // Validate coordinates
      if (!formData.coordinates.lat || !formData.coordinates.lng) {
        toast.error('Please provide coordinates for the location');
        setLoading(false);
        return;
      }

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
      toast.error(error.response?.data?.message || 'Failed to save location');
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
              placeholder="e.g., BrewHeaven Andheri"
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
              placeholder="e.g., 123 Main Street, Andheri East"
              className="w-full px-4 py-3 bg-gray-800 border border-gray-700 rounded-xl focus:outline-none focus:border-blue-500 text-white"
              required
            />
          </div>

          {/* Coordinates Section */}
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
                    Detect Current Location
                  </>
                )}
              </button>
            </div>

            {/* Error Message */}
            {locationError && (
              <div className="bg-red-500/10 border border-red-500/30 rounded-xl p-3 mb-3">
                <div className="flex items-start gap-2">
                  <AlertCircle className="w-4 h-4 text-red-400 mt-0.5" />
                  <p className="text-sm text-red-400">{locationError}</p>
                </div>
              </div>
            )}

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm text-gray-400 mb-1">Latitude</label>
                <input
                  name="coord.lat"
                  type="number"
                  step="any"
                  value={formData.coordinates.lat}
                  onChange={handleChange}
                  placeholder="19.0760"
                  className="w-full px-4 py-3 bg-gray-800 border border-gray-700 rounded-xl focus:outline-none focus:border-blue-500 text-white"
                  required
                />
              </div>
              <div>
                <label className="block text-sm text-gray-400 mb-1">Longitude</label>
                <input
                  name="coord.lng"
                  type="number"
                  step="any"
                  value={formData.coordinates.lng}
                  onChange={handleChange}
                  placeholder="72.8777"
                  className="w-full px-4 py-3 bg-gray-800 border border-gray-700 rounded-xl focus:outline-none focus:border-blue-500 text-white"
                  required
                />
              </div>
            </div>
            <p className="text-xs text-gray-500 mt-2">
              <MapPin className="w-3 h-3 inline mr-1" />
              Click "Detect Current Location" to auto-fill coordinates
            </p>
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
            <p className="text-xs text-gray-500 mt-1">
              Maximum delivery distance from this location (default: 10km)
            </p>
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