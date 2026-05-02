// server/controllers/couponController.js
const Coupon = require('../models/Coupon');

// Get all active coupons
exports.getAllCoupons = async (req, res) => {
  try {
    const coupons = await Coupon.find({ isActive: true })
      .populate('applicableProducts')
      .populate('comboProducts.product')
      .sort({ createdAt: -1 });
    res.json(coupons);
  } catch (error) {
    console.error('Get coupons error:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

// Get single coupon
exports.getCouponById = async (req, res) => {
  try {
    const coupon = await Coupon.findById(req.params.id)
      .populate('applicableProducts')
      .populate('comboProducts.product');
    if (!coupon) {
      return res.status(404).json({ message: 'Coupon not found' });
    }
    res.json(coupon);
  } catch (error) {
    console.error('Get coupon error:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

// Create coupon (admin only)
exports.createCoupon = async (req, res) => {
  try {
    const {
      code,
      type,
      value,
      minOrderAmount,
      maxDiscount,
      description,
      validUntil,
      usageLimit,
      applicableProducts,
      comboProducts,
      comboPrice,
      image
    } = req.body;

    // Check if coupon code already exists
    const existingCoupon = await Coupon.findOne({ code: code.toUpperCase() });
    if (existingCoupon) {
      return res.status(400).json({ message: 'Coupon code already exists' });
    }

    const coupon = new Coupon({
      code: code.toUpperCase(),
      type,
      value,
      minOrderAmount: minOrderAmount || 0,
      maxDiscount: maxDiscount || 0,
      description,
      validUntil: new Date(validUntil),
      usageLimit: usageLimit || 0,
      applicableProducts: applicableProducts || [],
      comboProducts: comboProducts || [],
      comboPrice: comboPrice || 0,
      image: image || ''
    });

    await coupon.save();
    res.status(201).json({ message: 'Coupon created successfully', coupon });
  } catch (error) {
    console.error('Create coupon error:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

// Update coupon (admin only)
exports.updateCoupon = async (req, res) => {
  try {
    const { id } = req.params;
    const updates = req.body;

    const coupon = await Coupon.findByIdAndUpdate(
      id,
      updates,
      { new: true, runValidators: true }
    );

    if (!coupon) {
      return res.status(404).json({ message: 'Coupon not found' });
    }

    res.json({ message: 'Coupon updated successfully', coupon });
  } catch (error) {
    console.error('Update coupon error:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

// Delete coupon (admin only)
exports.deleteCoupon = async (req, res) => {
  try {
    const { id } = req.params;
    const coupon = await Coupon.findByIdAndDelete(id);
    if (!coupon) {
      return res.status(404).json({ message: 'Coupon not found' });
    }
    res.json({ message: 'Coupon deleted successfully' });
  } catch (error) {
    console.error('Delete coupon error:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

// Validate coupon
exports.validateCoupon = async (req, res) => {
  try {
    const { code, cartTotal, productIds } = req.body;

    const coupon = await Coupon.findOne({
      code: code.toUpperCase(),
      isActive: true,
      validFrom: { $lte: new Date() },
      validUntil: { $gte: new Date() }
    });

    if (!coupon) {
      return res.status(404).json({ message: 'Invalid or expired coupon' });
    }

    // Check usage limit
    if (coupon.usageLimit > 0 && coupon.usedCount >= coupon.usageLimit) {
      return res.status(400).json({ message: 'Coupon usage limit exceeded' });
    }

    // Check minimum order amount
    if (cartTotal < coupon.minOrderAmount) {
      return res.status(400).json({ 
        message: `Minimum order amount of ₹${coupon.minOrderAmount} required` 
      });
    }

    // Calculate discount
    let discount = 0;
    if (coupon.type === 'percentage') {
      discount = (cartTotal * coupon.value) / 100;
      if (coupon.maxDiscount > 0 && discount > coupon.maxDiscount) {
        discount = coupon.maxDiscount;
      }
    } else if (coupon.type === 'fixed') {
      discount = coupon.value;
    } else if (coupon.type === 'combo') {
      // For combo, use comboPrice if set, otherwise calculate
      if (coupon.comboPrice > 0) {
        discount = cartTotal - coupon.comboPrice;
        if (discount < 0) discount = 0;
      }
    }

    res.json({
      valid: true,
      coupon,
      discount: Math.round(discount * 100) / 100,
      finalTotal: Math.round((cartTotal - discount) * 100) / 100
    });
  } catch (error) {
    console.error('Validate coupon error:', error);
    res.status(500).json({ message: 'Server error' });
  }
};
