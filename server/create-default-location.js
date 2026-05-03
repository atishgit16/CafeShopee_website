// server/create-default-location.js
const mongoose = require('mongoose');
require('dotenv').config();
const Location = require('./models/Location');

async function createDefaultLocation() {
  try {
    await mongoose.connect(process.env.MONGODB_URI);
    console.log('✅ Connected to MongoDB');
    
    // Check if location already exists
    const existing = await Location.findOne({ name: 'BrewHeaven Main' });
    if (existing) {
      console.log('✅ Location already exists:', existing._id);
      process.exit(0);
    }
    
    const defaultLocation = new Location({
      name: 'BrewHeaven Main',
      address: '123 Coffee Lane, Mumbai',
      coordinates: {
        lat: 19.0777,
        lng: 72.8777
      },
      deliveryRadius: 10,
      isActive: true,
      tables: [
        { tableNumber: 1, capacity: 4 },
        { tableNumber: 2, capacity: 4 },
        { tableNumber: 3, capacity: 6 },
        { tableNumber: 4, capacity: 4 },
        { tableNumber: 5, capacity: 2 }
      ]
    });
    
    await defaultLocation.save();
    console.log('✅ Default location created!');
    console.log('📍 ID:', defaultLocation._id.toString());
    console.log('📍 Coordinates:', defaultLocation.coordinates);
    
    process.exit(0);
  } catch (error) {
    console.error('❌ Error:', error);
    process.exit(1);
  }
}

createDefaultLocation();