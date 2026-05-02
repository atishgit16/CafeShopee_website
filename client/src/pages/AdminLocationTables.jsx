// src/pages/admin/AdminLocationTables.jsx
import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import axios from 'axios';
import toast from 'react-hot-toast';
import { ArrowLeft, Plus, Trash2, Table } from 'lucide-react';

const AdminLocationTables = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [location, setLocation] = useState(null);
  const [loading, setLoading] = useState(true);
  const [tableNumber, setTableNumber] = useState('');
  const [capacity, setCapacity] = useState(4);
  const [addingTable, setAddingTable] = useState(false);

  const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';

  useEffect(() => {
    fetchLocation();
  }, [id]);

  const fetchLocation = async () => {
    try {
      const response = await axios.get(`${API_URL}/locations/${id}`);
      setLocation(response.data);
    } catch (error) {
      console.error('Fetch location error:', error);
      toast.error('Failed to load location');
    } finally {
      setLoading(false);
    }
  };

  const handleAddTable = async (e) => {
    e.preventDefault();
    setAddingTable(true);

    try {
      await axios.post(`${API_URL}/locations/${id}/tables`, {
        tableNumber: parseInt(tableNumber),
        capacity: parseInt(capacity)
      });
      toast.success('Table added successfully');
      setTableNumber('');
      setCapacity(4);
      fetchLocation();
    } catch (error) {
      console.error('Add table error:', error);
      toast.error('Failed to add table');
    } finally {
      setAddingTable(false);
    }
  };

  const handleRemoveTable = async (tableNumber) => {
    if (!window.confirm(`Remove Table ${tableNumber}?`)) return;
    try {
      await axios.delete(`${API_URL}/locations/${id}/tables/${tableNumber}`);
      toast.success('Table removed successfully');
      fetchLocation();
    } catch (error) {
      console.error('Remove table error:', error);
      toast.error('Failed to remove table');
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-black text-white flex items-center justify-center pt-20">
        <div className="text-center">
          <div className="text-4xl mb-4 animate-pulse">📍</div>
          <div className="text-xl text-gray-400 animate-pulse">Loading tables...</div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-black text-white pt-20 pb-12">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 max-w-3xl">
        <div className="flex items-center justify-between mb-8">
          <div className="flex items-center gap-4">
            <button
              onClick={() => navigate('/admin/locations')}
              className="p-2 rounded-full hover:bg-gray-800 transition-colors"
            >
              <ArrowLeft className="w-6 h-6" />
            </button>
            <h1 className="text-3xl md:text-4xl font-bold bg-gradient-to-r from-blue-400 to-amber-500 bg-clip-text text-transparent">
              Manage Tables - {location?.name}
            </h1>
          </div>
        </div>

        <div className="bg-gray-900/80 rounded-2xl p-6 backdrop-blur-sm border border-gray-800">
          <h2 className="text-xl font-bold mb-4">Add New Table</h2>
          <form onSubmit={handleAddTable} className="flex gap-4 mb-6">
            <div className="flex-1">
              <label className="block text-sm text-gray-400 mb-1">Table Number</label>
              <input
                type="number"
                value={tableNumber}
                onChange={(e) => setTableNumber(e.target.value)}
                placeholder="1"
                className="w-full px-4 py-2 bg-gray-800 border border-gray-700 rounded-xl focus:outline-none focus:border-blue-500 text-white"
                required
              />
            </div>
            <div className="flex-1">
              <label className="block text-sm text-gray-400 mb-1">Capacity</label>
              <input
                type="number"
                value={capacity}
                onChange={(e) => setCapacity(e.target.value)}
                placeholder="4"
                className="w-full px-4 py-2 bg-gray-800 border border-gray-700 rounded-xl focus:outline-none focus:border-blue-500 text-white"
                required
              />
            </div>
            <div className="flex items-end">
              <button
                type="submit"
                disabled={addingTable}
                className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-xl font-semibold transition-all disabled:opacity-50"
              >
                {addingTable ? 'Adding...' : 'Add'}
              </button>
            </div>
          </form>

          <h2 className="text-xl font-bold mb-4">Existing Tables</h2>
          <div className="grid grid-cols-3 gap-3">
            {location?.tables?.map((table) => (
              <div
                key={table.tableNumber}
                className="bg-gray-800/50 rounded-xl p-4 border border-gray-700"
              >
                <div className="flex justify-between items-center">
                  <div>
                    <p className="font-bold text-lg">Table {table.tableNumber}</p>
                    <p className="text-sm text-gray-400">Capacity: {table.capacity}</p>
                    <p className={`text-xs ${table.isAvailable ? 'text-green-400' : 'text-red-400'}`}>
                      {table.isAvailable ? 'Available' : 'Reserved'}
                    </p>
                  </div>
                  <button
                    onClick={() => handleRemoveTable(table.tableNumber)}
                    className="p-1 bg-red-600/20 hover:bg-red-600 rounded-full transition-colors"
                  >
                    <Trash2 className="w-4 h-4 text-red-400" />
                  </button>
                </div>
              </div>
            ))}
          </div>

          {location?.tables?.length === 0 && (
            <div className="text-center py-8 text-gray-500">
              <Table className="w-12 h-12 mx-auto mb-2 text-gray-600" />
              <p>No tables added yet</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default AdminLocationTables;