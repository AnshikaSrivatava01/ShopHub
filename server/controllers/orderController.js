const Order = require('../models/Order');
const Product = require('../models/Product');

const requiresSizeSelection = (category) => ['clothing', 'clothes', 'footwear'].includes(String(category || '').trim().toLowerCase());
const isLegacyDemoPayment = (paymentId) => String(paymentId || '').trim().startsWith('demo_');
const isReturnedStatus = (status) => String(status || '').trim().toLowerCase() === 'returned';

const adjustProductInventory = async (productId, quantityDelta, size = '') => {
  const normalizedSize = String(size || '').trim();
  const product = await Product.findById(productId);
  if (!product) return;

  if (normalizedSize && Array.isArray(product.sizeQuantities) && product.sizeQuantities.length > 0) {
    const sizeEntry = product.sizeQuantities.find((entry) => entry.size === normalizedSize);
    if (sizeEntry) {
      sizeEntry.quantity = Math.max(0, Number(sizeEntry.quantity || 0) + quantityDelta);
    }
  } else {
    product.stock = Math.max(0, Number(product.stock || 0) + quantityDelta);
  }

  await product.save();
};

const adjustOrderInventory = async (items, delta, onlyProductId = '') => {
  const normalizedOnlyProductId = String(onlyProductId || '').trim();

  for (const item of items) {
    if (normalizedOnlyProductId && String(item.product) !== normalizedOnlyProductId) {
      continue;
    }

    await adjustProductInventory(item.product, delta * Number(item.quantity || 0), item.size);
  }
};

const normalizeLegacyCodPayment = async (order) => {
  if (!order) return order;
  if (isLegacyDemoPayment(order.paymentId) && order.paymentStatus === 'paid') {
    order.paymentId = '';
    order.paymentStatus = 'pending';
    await order.save();
  }
  return order;
};

// POST /api/orders
exports.createOrder = async (req, res) => {
  try {
    const { items, shippingAddress, totalPrice, paymentId } = req.body;
    if (!items || items.length === 0) {
      return res.status(400).json({ message: 'No order items' });
    }

    // Calculate latest rental return date
    let maxReturnDate = null;
    for (const item of items) {
      const product = await Product.findById(item.product).select('category sizes sizeQuantities stock');
      if (!product) {
        return res.status(404).json({ message: 'One or more products were not found' });
      }

      if (requiresSizeSelection(product.category) && !String(item.size || '').trim()) {
        return res.status(400).json({ message: `Size is required for ${product.category} items` });
      }

      if (String(item.size || '').trim() && product.sizes?.length > 0 && !product.sizes.includes(String(item.size).trim())) {
        return res.status(400).json({ message: `Selected size is unavailable for ${item.name}` });
      }

      if (String(item.size || '').trim() && Array.isArray(product.sizeQuantities) && product.sizeQuantities.length > 0) {
        const sizeEntry = product.sizeQuantities.find((entry) => entry.size === String(item.size).trim());
        const availableForSize = Number(sizeEntry?.quantity || 0);
        if (Number(item.quantity) > availableForSize) {
          return res.status(400).json({ message: `Only ${availableForSize} item(s) left in size ${item.size} for ${item.name}` });
        }
      } else if (Number(item.quantity) > Number(product.stock || 0)) {
        return res.status(400).json({ message: `Only ${product.stock} item(s) left in stock for ${item.name}` });
      }

      if (item.type === 'rent' && item.rentalDuration && item.rentalUnit) {
        const now = new Date();
        let days = item.rentalDuration;
        if (item.rentalUnit === 'week') days *= 7;
        if (item.rentalUnit === 'month') days *= 30;
        const returnDate = new Date(now.getTime() + days * 24 * 60 * 60 * 1000);
        if (!maxReturnDate || returnDate > maxReturnDate) maxReturnDate = returnDate;
      }
    }

    const normalizedPaymentId = String(paymentId || '').trim();
    const hasRealPayment = normalizedPaymentId && !normalizedPaymentId.startsWith('demo_');

    const order = await Order.create({
      user: req.user._id,
      items,
      shippingAddress,
      totalPrice,
      paymentId: hasRealPayment ? normalizedPaymentId : '',
      paymentStatus: hasRealPayment ? 'paid' : 'pending',
      rentalReturnDate: maxReturnDate,
    });

    await adjustOrderInventory(items, -1);

    res.status(201).json(order);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// GET /api/orders/my
exports.getMyOrders = async (req, res) => {
  try {
    const orders = await Order.find({ user: req.user._id }).sort({ createdAt: -1 });
    await Promise.all(orders.map(normalizeLegacyCodPayment));
    res.json(orders);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// GET /api/orders/:id
exports.getOrderById = async (req, res) => {
  try {
    const order = await Order.findById(req.params.id).populate('user', 'name email');
    if (!order) return res.status(404).json({ message: 'Order not found' });
    if (order.user._id.toString() !== req.user._id.toString() && req.user.role !== 'admin') {
      return res.status(403).json({ message: 'Not authorized' });
    }
    await normalizeLegacyCodPayment(order);
    res.json(order);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// GET /api/orders (admin)
exports.getAllOrders = async (req, res) => {
  try {
    const orders = await Order.find({}).populate('user', 'name email').sort({ createdAt: -1 });
    await Promise.all(orders.map(normalizeLegacyCodPayment));
    res.json(orders);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// PUT /api/orders/:id/status (admin)
exports.updateOrderStatus = async (req, res) => {
  try {
    const order = await Order.findById(req.params.id);
    if (!order) return res.status(404).json({ message: 'Order not found' });
    const previousStatus = order.deliveryStatus;
    const nextStatus = req.body.deliveryStatus || order.deliveryStatus;

    if (!isReturnedStatus(previousStatus) && isReturnedStatus(nextStatus)) {
      await adjustOrderInventory(order.items, 1);
    }

    if (isReturnedStatus(previousStatus) && !isReturnedStatus(nextStatus)) {
      await adjustOrderInventory(order.items, -1);
    }

    order.deliveryStatus = nextStatus;
    if (req.body.paymentStatus) order.paymentStatus = req.body.paymentStatus;
    const updated = await order.save();
    res.json(updated);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// PUT /api/orders/:id/return
exports.requestOrderReturn = async (req, res) => {
  try {
    const order = await Order.findById(req.params.id);
    if (!order) return res.status(404).json({ message: 'Order not found' });
    const productId = String(req.body.productId || '').trim();
    const issue = String(req.body.issue || '').trim();

    if (order.user.toString() !== req.user._id.toString()) {
      return res.status(403).json({ message: 'Not authorized' });
    }

    if (order.deliveryStatus === 'returned') {
      return res.status(400).json({ message: 'This order has already been returned' });
    }

    if (order.deliveryStatus !== 'delivered') {
      return res.status(400).json({ message: 'Return is available only after delivery' });
    }

    if (!productId) {
      return res.status(400).json({ message: 'Product id is required' });
    }

    if (!issue) {
      return res.status(400).json({ message: 'Please describe the issue' });
    }

    const matchingItem = order.items.find((item) => String(item.product) === productId);
    if (!matchingItem) {
      return res.status(400).json({ message: 'Selected product does not belong to this order' });
    }

    order.deliveryStatus = 'returned';
    order.returnRequest = {
      productId,
      issue,
      requestedAt: new Date(),
    };
    const updated = await order.save();

    await adjustOrderInventory(order.items, 1, matchingItem.product);

    res.json(updated);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// GET /api/orders/stats (admin)
exports.getOrderStats = async (req, res) => {
  try {
    const totalOrders = await Order.countDocuments();
    const totalRevenueResult = await Order.aggregate([
      { $match: { paymentStatus: 'paid' } },
      { $group: { _id: null, total: { $sum: '$totalPrice' } } },
    ]);
    const totalRevenue = totalRevenueResult[0]?.total || 0;
    const recentOrders = await Order.find({}).populate('user', 'name email').sort({ createdAt: -1 }).limit(10);

    // Monthly revenue for last 6 months
    const sixMonthsAgo = new Date();
    sixMonthsAgo.setMonth(sixMonthsAgo.getMonth() - 6);
    const monthlyRevenue = await Order.aggregate([
      { $match: { paymentStatus: 'paid', createdAt: { $gte: sixMonthsAgo } } },
      { $group: { _id: { $dateToString: { format: '%Y-%m', date: '$createdAt' } }, revenue: { $sum: '$totalPrice' }, count: { $sum: 1 } } },
      { $sort: { _id: 1 } },
    ]);

    res.json({ totalOrders, totalRevenue, recentOrders, monthlyRevenue });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
