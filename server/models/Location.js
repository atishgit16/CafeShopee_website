// server/models/Location.js
const mongoose = require('mongoose');

const locationSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true
  },
  address: {
    type: String,
    required: true
  },
  coordinates: {
    lat: {
      type: Number,
      required: true
    },
    lng: {
      type: Number,
      required: true
    }
  },
  deliveryRadius: {
    type: Number,
    default: 10 // in kilometers
  },
  isActive: {
    type: Boolean,
    default: true
  },
  tables: [{
    tableNumber: {
      type: Number,
      required: true
    },
    capacity: {
      type: Number,
      default: 4
    },
    isAvailable: {
      type: Boolean,
      default: true
    },
    isReserved: {
      type: Boolean,
      default: false
    },
    reservedBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User'
    },
    reservedAt: {
      type: Date
    }
  }],
  createdAt: {
    type: Date,
    default: Date.now
  }
});

module.exports = mongoose.model('Location', locationSchema);