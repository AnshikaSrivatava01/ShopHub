const Coupon = require('../models/Coupon');

// POST /api/coupons/validate
exports.validateCoupon = async (req, res) => {
  try {
    const { code, orderTotal } = req.body;
    if (!code || typeof code !== 'string') {
      return res.status(400).json({ message: 'Coupon code is required' });
    }

    const normalizedOrderTotal = Number(orderTotal);
    if (!Number.isFinite(normalizedOrderTotal) || normalizedOrderTotal < 0) {
      return res.status(400).json({ message: 'A valid order total is required' });
    }

    const coupon = await Coupon.findOne({ code: code.toUpperCase(), isActive: true });
    if (!coupon) return res.status(404).json({ message: 'Invalid coupon code' });
    if (coupon.expiresAt < new Date()) return res.status(400).json({ message: 'Coupon has expired' });
    if (coupon.usageLimit > 0 && coupon.usedCount >= coupon.usageLimit) return res.status(400).json({ message: 'Coupon usage limit reached' });
    if (normalizedOrderTotal < coupon.minOrder) return res.status(400).json({ message: `Minimum order of ₹${coupon.minOrder} required` });

    let discount = 0;
    if (coupon.discountType === 'percentage') {
      discount = (normalizedOrderTotal * coupon.discountValue) / 100;
      if (coupon.maxDiscount > 0) discount = Math.min(discount, coupon.maxDiscount);
    } else {
      discount = coupon.discountValue;
    }
    discount = Math.min(discount, normalizedOrderTotal); // can't exceed order total

    res.json({ discount, code: coupon.code, discountType: coupon.discountType, discountValue: coupon.discountValue });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// GET /api/coupons (admin)
exports.getAllCoupons = async (req, res) => {
  try {
    const coupons = await Coupon.find({}).sort({ createdAt: -1 });
    res.json(coupons);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// POST /api/coupons (admin)
exports.createCoupon = async (req, res) => {
  try {
    const coupon = await Coupon.create(req.body);
    res.status(201).json(coupon);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// DELETE /api/coupons/:id (admin)
exports.deleteCoupon = async (req, res) => {
  try {
    await Coupon.findByIdAndDelete(req.params.id);
    res.json({ message: 'Coupon deleted' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

if (require.main === module) {
  console.log('couponController.js exports Express handlers and is intended to be used via routes.');
}
