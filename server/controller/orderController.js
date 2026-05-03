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
    console.log('📝 Order request received');
    console.log('  - Body:', req.body);
    console.log('  - User ID:', req.user.id);
    console.log('  - Order Type:', req.body.orderType);
    console.log('  - Location ID:', req.body.locationId);
    console.log('  - Table Number:', req.body.tableNumber);
    console.log('  - Delivery Coordinates:', req.body.deliveryCoordinates);
    
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
    console.log('🛒 Cart found:', cart ? 'Yes' : 'No');
    console.log('📦 Cart items count:', cart?.items?.length || 0);
    
    if (!cart || cart.items.length === 0) {
      console.log('❌ Cart is empty');
      return res.status(400).json({ message: 'Cart is empty' });
    }

    // Validate order type
    console.log('🔍 Validating order type:', orderType);
    if (!orderType || !['dine-in', 'delivery'].includes(orderType)) {
      console.log('❌ Invalid order type:', orderType);
      return res.status(400).json({ message: 'Invalid order type' });
    }

    let location = null;
    let table = null;
    let distance = 0;

    // Dine-in validation
    if (orderType === 'dine-in') {
      console.log('📍 Processing dine-in order');
      console.log('  - Table:', tableNumber);
      console.log('  - Location:', locationId);
      
      if (!tableNumber || !locationId) {
        console.log('❌ Missing table number or location');
        return res.status(400).json({ message: 'Table number and location are required for dine-in' });
      }

      // Check if table is available
      location = await Location.findById(locationId);
      console.log('📍 Location found:', location ? 'Yes' : 'No');
      
      if (!location) {
        console.log('❌ Location not found:', locationId);
        return res.status(404).json({ message: 'Location not found' });
      }

      table = location.tables.find(t => t.tableNumber === parseInt(tableNumber));
      console.log('🪑 Table found:', table ? 'Yes' : 'No');
      
      if (!table) {
        console.log('❌ Table not found:', tableNumber);
        return res.status(404).json({ message: 'Table not found' });
      }

      console.log('  - Table available:', table.isAvailable);
      console.log('  - Table reserved:', table.isReserved);
      
      if (!table.isAvailable || table.isReserved) {
        console.log('❌ Table is not available');
        return res.status(400).json({ message: 'Table is not available' });
      }

      // Reserve the table
      table.isReserved = true;
      table.reservedBy = req.user.id;
      table.reservedAt = new Date();
      await location.save();
      console.log('✅ Table reserved successfully');
    }

    // Delivery validation (removed distance check - only detect location and save)
    if (orderType === 'delivery') {
      console.log('🚚 Processing delivery order');
      console.log('  - Coordinates:', deliveryCoordinates);
      
      if (!deliveryCoordinates) {
        console.log('❌ Missing delivery coordinates');
        return res.status(400).json({ message: 'Delivery coordinates are required' });
      }

      // Get the cafe location (default location)
      const cafeLocation = await Location.findOne({ isActive: true });
      console.log('📍 Cafe location found:', cafeLocation ? 'Yes' : 'No');
      
      if (!cafeLocation) {
        console.log('❌ Cafe location not found');
        return res.status(400).json({ message: 'Cafe location not found' });
      }

      // Calculate distance (for logging only, no validation)
      distance = calculateDistance(
        cafeLocation.coordinates.lat,
        cafeLocation.coordinates.lng,
        deliveryCoordinates.lat,
        deliveryCoordinates.lng
      );
      console.log('📏 Distance from cafe:', distance.toFixed(2), 'km');
      console.log('  - Cafe coordinates:', cafeLocation.coordinates);
      console.log('  - Delivery coordinates:', deliveryCoordinates);
      
      // ✅ DISTANCE VALIDATION REMOVED - allowing all deliveries
    }

    // Calculate totals with coupon
    let totalAmount = cart.totalPrice;
    let discountAmount = 0;
    let appliedCoupon = null;

    if (coupon) {
      console.log('🎫 Applying coupon:', coupon.code);
      const validCoupon = await Coupon.findOne({ 
        code: coupon.code.toUpperCase(),
        isActive: true,
        validFrom: { $lte: new Date() },
        validUntil: { $gte: new Date() }
      });

      console.log('  - Coupon valid:', validCoupon ? 'Yes' : 'No');
      
      if (validCoupon) {
        if (validCoupon.usageLimit > 0 && validCoupon.usedCount >= validCoupon.usageLimit) {
          console.log('❌ Coupon usage limit exceeded');
          return res.status(400).json({ message: 'Coupon usage limit exceeded' });
        }

        if (totalAmount < validCoupon.minOrderAmount) {
          console.log('❌ Minimum order amount not met');
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
        console.log('✅ Coupon applied, discount:', discountAmount);
      }
    }

    const finalTotal = Math.round((totalAmount - discountAmount) * 100) / 100;
    console.log('💰 Final total:', finalTotal);

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
        coordinates: deliveryCoordinates
      };
      orderData.deliveryDistance = distance;
    }

    const order = new Order(orderData);
    await order.save();
    console.log('✅ Order saved with ID:', order._id);

    // Clear cart
    cart.items = [];
    cart.totalPrice = 0;
    await cart.save();
    console.log('✅ Cart cleared');

  res.status(201).json({ 
  message: 'Order created successfully', 
  order,
  discountAmount,
  finalTotal,
  redirectTo: `/order-success?orderId=${order._id}`
});

  } catch (error) {
    console.error('❌ Create order error:', error);
    console.error('  - Error name:', error.name);
    console.error('  - Error message:', error.message);
    console.error('  - Error stack:', error.stack);
    res.status(500).json({ message: 'Server error', error: error.message });
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

// Get order tracking (basic timeline)
exports.getOrderTracking = async (req, res) => {
  try {
    const { orderId } = req.params;
    
    const order = await Order.findById(orderId)
      .populate('items.product')
      .populate('location');
    
    if (!order) {
      return res.status(404).json({ message: 'Order not found' });
    }
    
    // Check if user is authorized
    if (order.user._id.toString() !== req.user.id && req.user.role !== 'admin') {
      return res.status(403).json({ message: 'Unauthorized' });
    }
    
    // Create tracking timeline
    const trackingTimeline = [];
    
    trackingTimeline.push({
      status: 'Order Received',
      description: 'Your order has been received and is being processed.',
      timestamp: order.createdAt,
      completed: true
    });
    
    if (order.orderStatus === 'confirmed' || order.orderStatus === 'processing' || 
        order.orderStatus === 'preparing' || order.orderStatus === 'ready' || 
        order.orderStatus === 'delivered') {
      trackingTimeline.push({
        status: 'Order Confirmed',
        description: 'Your order has been confirmed by the cafe.',
        timestamp: order.createdAt,
        completed: true
      });
    }
    
    if (order.orderStatus === 'preparing' || order.orderStatus === 'ready' || 
        order.orderStatus === 'delivered') {
      trackingTimeline.push({
        status: 'Preparing',
        description: 'Your order is being prepared by our chefs.',
        timestamp: order.createdAt,
        completed: true
      });
    }
    
    if (order.orderStatus === 'ready' || order.orderStatus === 'delivered') {
      trackingTimeline.push({
        status: 'Ready',
        description: 'Your order is ready!',
        timestamp: order.createdAt,
        completed: true
      });
    }
    
    if (order.orderStatus === 'delivered') {
      trackingTimeline.push({
        status: 'Delivered',
        description: 'Your order has been delivered successfully!',
        timestamp: order.createdAt,
        completed: true
      });
    }
    
    res.json({
      order,
      trackingTimeline,
      currentStatus: order.orderStatus
    });
  } catch (error) {
    console.error('Get order tracking error:', error);
    res.status(500).json({ message: 'Server error' });
  }
};