// server/models/Order.js
const mongoose = require('mongoose');

const orderSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  items: [
    {
      product: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Product',
        required: true
      },
      quantity: {
        type: Number,
        required: true,
        min: 1
      },
      price: {
        type: Number,
        required: true
      }
    }
  ],
  totalAmount: {
    type: Number,
    required: true
  },
  discountAmount: {
    type: Number,
    default: 0
  },
  appliedCoupon: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Coupon'
  },
  orderType: {
    type: String,
    enum: ['dine-in', 'delivery'],
    required: true,
    default: 'delivery'
  },
  tableNumber: {
    type: Number
  },
  location: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Location'
  },
  deliveryAddress: {
    
    coordinates: {
      lat: Number,
      lng: Number
    }
  },
  deliveryDistance: {
    type: Number
  },
  paymentStatus: {
    type: String,
    enum: ['pending', 'paid', 'failed'],
    default: 'pending'
  },
  orderStatus: {
    type: String,
    enum: ['pending', 'confirmed', 'preparing', 'ready', 'delivered', 'cancelled'],
    default: 'pending'
  },
  createdAt: {
    type: Date,
    default: Date.now
  },
  
});

module.exports = mongoose.model('Order', orderSchema);