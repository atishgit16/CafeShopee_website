// server/test-mongo.js
const mongoose = require('mongoose');
require('dotenv').config();

console.log('🔍 Testing MongoDB Connection...');
console.log('MONGODB_URI:', process.env.MONGODB_URI);

async function test() {
  try {
    await mongoose.connect(process.env.MONGODB_URI);
    console.log('✅ SUCCESS! Connected to MongoDB Atlas!');
    console.log('Database:', mongoose.connection.name);
    process.exit(0);
  } catch (error) {
    console.error('❌ FAILED! Connection Error:', error.message);
    console.error('Error code:', error.code);
    process.exit(1);
  }
}

test();