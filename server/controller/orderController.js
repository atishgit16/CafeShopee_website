// server/controllers/orderController.js
const Order = require('../models/Order');
const Cart = require('../models/Cart');
const Coupon = require('../models/Coupon');
const Location = require('../models/Location');

// Helper function to calculate distance between two coordinates (Haversine formula)
function calculateDistance(lat1, lon1, lat2, lon2) {
  const R = 6371; // Radius of the earth in km
  const dLat = (lat2 - lat1) * Math.PI / 180;
  const dLon = (lon2 - lon1) * Math.PI / 180;
  const a = 
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos(lat1 * Math.PI / 180) * Math.cos(lat2 * Math.PI / 180) * 
    Math.sin(dLon / 2) * Math.sin(dLon / 2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  const d = R * c; // Distance in km
  return d;
}

// Create order
exports.createOrder = async (req, res) => {
  try {
    const { 
      address, 
      paymentMethod, 
      coupon, 
      orderType, 
      tableNumber,
      locationId,
      deliveryCoordinates 
    } = req.body;

    // Get user cart
    const cart = await Cart.findOne({ user: req.user.id }).populate('items.product');
    if (!cart || cart.items.length === 0) {
      return res.status(400).json({ message: 'Cart is empty' });
    }

    // Validate order type
    if (!orderType || !['dine-in', 'delivery'].includes(orderType)) {
      return res.status(400).json({ message: 'Invalid order type' });
    }

    // Dine-in validation
    if (orderType === 'dine-in') {
      if (!tableNumber || !locationId) {
        return res.status(400).json({ message: 'Table number and location are required for dine-in' });
      }

      // Check if table is available
      const location = await Location.findById(locationId);
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

      // Reserve the table
      table.isReserved = true;
      table.reservedBy = req.user.id;
      table.reservedAt = new Date();
      await location.save();
    }

    // Delivery validation
    if (orderType === 'delivery') {
      if (!address || !deliveryCoordinates) {
        return res.status(400).json({ message: 'Delivery address and coordinates are required' });
      }

      // Get the cafe location (default location)
      const cafeLocation = await Location.findOne({ isActive: true });
      if (!cafeLocation) {
        return res.status(400).json({ message: 'Cafe location not found' });
      }

      // Calculate distance
      const distance = calculateDistance(
        cafeLocation.coordinates.lat,
        cafeLocation.coordinates.lng,
        deliveryCoordinates.lat,
        deliveryCoordinates.lng
      );

      // Check if within delivery radius
      if (distance > (cafeLocation.deliveryRadius || 10)) {
        return res.status(400).json({ 
          message: `Delivery not available for this location (${distance.toFixed(1)}km away). Maximum delivery radius is ${cafeLocation.deliveryRadius || 10}km.` 
        });
      }
    }

    // Calculate totals with coupon
    let totalAmount = cart.totalPrice;
    let discountAmount = 0;
    let appliedCoupon = null;

    if (coupon) {
      const validCoupon = await Coupon.findOne({ 
        code: coupon.code.toUpperCase(),
        isActive: true,
        validFrom: { $lte: new Date() },
        validUntil: { $gte: new Date() }
      });

      if (validCoupon) {
        if (validCoupon.usageLimit > 0 && validCoupon.usedCount >= validCoupon.usageLimit) {
          return res.status(400).json({ message: 'Coupon usage limit exceeded' });
        }

        if (totalAmount < validCoupon.minOrderAmount) {
          return res.status(400).json({ 
            message: `Minimum order amount of ₹${validCoupon.minOrderAmount} required for this coupon` 
          });
        }

        if (validCoupon.type === 'percentage') {
          discountAmount = (totalAmount * validCoupon.value) / 100;
          if (validCoupon.maxDiscount > 0 && discountAmount > validCoupon.maxDiscount) {
            discountAmount = validCoupon.maxDiscount;
          }
        } else if (validCoupon.type === 'fixed') {
          discountAmount = validCoupon.value;
          if (discountAmount > totalAmount) {
            discountAmount = totalAmount;
          }
        }

        validCoupon.usedCount += 1;
        await validCoupon.save();
        appliedCoupon = validCoupon._id;
      }
    }

    const finalTotal = Math.round((totalAmount - discountAmount) * 100) / 100;

    // Create order items
    const orderItems = cart.items.map(item => ({
      product: item.product._id,
      quantity: item.quantity,
      price: item.product.price
    }));

    // Create order
    const orderData = {
      user: req.user.id,
      items: orderItems,
      totalAmount: finalTotal,
      discountAmount: discountAmount,
      appliedCoupon: appliedCoupon,
      orderType: orderType,
      paymentStatus: 'pending',
      orderStatus: 'pending'
    };

    if (orderType === 'dine-in') {
      orderData.tableNumber = parseInt(tableNumber);
      orderData.location = locationId;
    }

    if (orderType === 'delivery') {
      orderData.deliveryAddress = {
        street: address.street,
        city: address.city,
        state: address.state,
        zipCode: address.zipCode,
        country: address.country,
        phone: address.phone,
        coordinates: deliveryCoordinates
      };
      orderData.deliveryDistance = distance;
    }

    const order = new Order(orderData);
    await order.save();

    // Clear cart
    cart.items = [];
    cart.totalPrice = 0;
    await cart.save();

    res.status(201).json({ 
      message: 'Order created successfully', 
      order,
      discountAmount,
      finalTotal,
      redirectTo: '/order-success'
    });
  } catch (error) {
    console.error('Create order error:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

// Get user orders
exports.getUserOrders = async (req, res) => {
  try {
    const orders = await Order.find({ user: req.user.id })
      .populate('items.product')
      .populate('appliedCoupon')
      .populate('location')
      .sort({ createdAt: -1 });
    res.json(orders);
  } catch (error) {
    console.error('Get orders error:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

// Get single order
exports.getOrderById = async (req, res) => {
  try {
    const order = await Order.findById(req.params.id)
      .populate('items.product')
      .populate('user', 'name email')
      .populate('appliedCoupon')
      .populate('location');

    if (!order) {
      return res.status(404).json({ message: 'Order not found' });
    }

    if (order.user._id.toString() !== req.user.id && req.user.role !== 'admin') {
      return res.status(403).json({ message: 'Unauthorized' });
    }

    res.json(order);
  } catch (error) {
    console.error('Get order error:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

// Get all orders (admin only)
exports.getAllOrders = async (req, res) => {
  try {
    const orders = await Order.find()
      .populate('items.product')
      .populate('user', 'name email')
      .populate('appliedCoupon')
      .populate('location')
      .sort({ createdAt: -1 });
    res.json(orders);
  } catch (error) {
    console.error('Get all orders error:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

// Update order status (admin only)
exports.updateOrderStatus = async (req, res) => {
  try {
    const { id } = req.params;
    const { orderStatus, paymentStatus } = req.body;

    const order = await Order.findById(id);
    if (!order) {
      return res.status(404).json({ message: 'Order not found' });
    }

    if (orderStatus) order.orderStatus = orderStatus;
    if (paymentStatus) order.paymentStatus = paymentStatus;

    await order.save();
    res.json({ message: 'Order updated successfully', order });
  } catch (error) {
    console.error('Update order error:', error);
    res.status(500).json({ message: 'Server error' });
  }
};