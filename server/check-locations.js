// server/check-locations.js
const mongoose = require('mongoose');
require('dotenv').config();
const Location = require('./models/Location');

async function checkLocations() {
  try {
    await mongoose.connect(process.env.MONGODB_URI);
    console.log('✅ Connected to MongoDB');
    
    const locations = await Location.find();
    console.log(`📍 Found ${locations.length} locations`);
    
    if (locations.length > 0) {
      console.log('✅ First location details:');
      console.log('  - ID:', locations[0]._id.toString());
      console.log('  - Name:', locations[0].name);
      console.log('  - Address:', locations[0].address);
      console.log('  - Tables count:', locations[0].tables.length);
      console.log('  - Tables:', locations[0].tables.map(t => t.tableNumber).join(', '));
    } else {
      console.log('❌ No locations found! Create one first.');
    }
    
    process.exit(0);
  } catch (error) {
    console.error('❌ Error:', error);
    process.exit(1);
  }
}

checkLocations();