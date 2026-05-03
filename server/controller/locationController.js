// server/controllers/locationController.js
const Location = require('../models/Location');

// Get all active locations
exports.getAllLocations = async (req, res) => {
  try {
    const locations = await Location.find({ isActive: true });
    res.json(locations);
  } catch (error) {
    console.error('Get locations error:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

// Get location by ID
exports.getLocationById = async (req, res) => {
  try {
    const location = await Location.findById(req.params.id);
    if (!location) {
      return res.status(404).json({ message: 'Location not found' });
    }
    res.json(location);
  } catch (error) {
    console.error('Get location error:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

// Create location (admin only)
exports.createLocation = async (req, res) => {
  try {
    const { name, address, coordinates, deliveryRadius } = req.body;
    
    // Use Mumbai default if coordinates not provided
    const location = new Location({
      name,
      address,
      coordinates: coordinates || { lat: 19.0777, lng: 72.8777 },
      deliveryRadius: deliveryRadius || 10
    });

    await location.save();
    res.status(201).json({ message: 'Location created successfully', location });
  } catch (error) {
    console.error('Create location error:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

// Update location (admin only)
exports.updateLocation = async (req, res) => {
  try {
    const { id } = req.params;
    const updates = req.body;

    const location = await Location.findByIdAndUpdate(
      id,
      updates,
      { new: true, runValidators: true }
    );

    if (!location) {
      return res.status(404).json({ message: 'Location not found' });
    }

    res.json({ message: 'Location updated successfully', location });
  } catch (error) {
    console.error('Update location error:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

// Delete location (admin only)
exports.deleteLocation = async (req, res) => {
  try {
    const { id } = req.params;
    const location = await Location.findByIdAndDelete(id);
    if (!location) {
      return res.status(404).json({ message: 'Location not found' });
    }
    res.json({ message: 'Location deleted successfully' });
  } catch (error) {
    console.error('Delete location error:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

// Get available tables for a location
exports.getAvailableTables = async (req, res) => {
  try {
    const { id } = req.params;
    const location = await Location.findById(id);
    if (!location) {
      return res.status(404).json({ message: 'Location not found' });
    }

    const availableTables = location.tables.filter(table => 
      table.isAvailable && !table.isReserved
    );

    res.json(availableTables);
  } catch (error) {
    console.error('Get tables error:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

// Reserve table
exports.reserveTable = async (req, res) => {
  try {
    const { id, tableNumber } = req.params;
    const { userId } = req.body;

    const location = await Location.findById(id);
    if (!location) {
      return res.status(404).json({ message: 'Location not found' });
    }

    const table = location.tables.find(t => t.tableNumber === parseInt(tableNumber));
    if (!table) {
      return res.status(404).json({ message: 'Table not found' });
    }

    if (!table.isAvailable || table.isReserved) {
      return res.status(400).json({ message: 'Table is not available' });
    }

    table.isReserved = true;
    table.reservedBy = userId;
    table.reservedAt = new Date();

    await location.save();
    res.json({ message: 'Table reserved successfully', table });
  } catch (error) {
    console.error('Reserve table error:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

// Add table to location (admin only)
exports.addTable = async (req, res) => {
  try {
    const { id } = req.params;
    const { tableNumber, capacity } = req.body;

    const location = await Location.findById(id);
    if (!location) {
      return res.status(404).json({ message: 'Location not found' });
    }

    // Check if table number already exists
    const existingTable = location.tables.find(t => t.tableNumber === parseInt(tableNumber));
    if (existingTable) {
      return res.status(400).json({ message: 'Table number already exists' });
    }

    location.tables.push({
      tableNumber: parseInt(tableNumber),
      capacity: capacity || 4,
      isAvailable: true,
      isReserved: false
    });

    await location.save();
    res.json({ message: 'Table added successfully', location });
  } catch (error) {
    console.error('Add table error:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

// Remove table (admin only)
exports.removeTable = async (req, res) => {
  try {
    const { id, tableNumber } = req.params;

    const location = await Location.findById(id);
    if (!location) {
      return res.status(404).json({ message: 'Location not found' });
    }

    location.tables = location.tables.filter(t => t.tableNumber !== parseInt(tableNumber));
    await location.save();
    res.json({ message: 'Table removed successfully', location });
  } catch (error) {
    console.error('Remove table error:', error);
    res.status(500).json({ message: 'Server error' });
  }
};