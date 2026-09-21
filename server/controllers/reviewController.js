const Review = require('../models/Review');
const Product = require('../models/Product');
const Order = require('../models/Order');

const DEFAULT_PRODUCT_RATING = 3.8;

const syncProductRatingSummary = async (productId) => {
  const reviews = await Review.find({ product: productId });
  const avg = reviews.length > 0
    ? reviews.reduce((sum, review) => sum + review.rating, 0) / reviews.length
    : DEFAULT_PRODUCT_RATING;

  await Product.findByIdAndUpdate(productId, {
    avgRating: Math.round(avg * 10) / 10,
    numReviews: reviews.length,
  });
};

// POST /api/reviews
exports.createReview = async (req, res) => {
  try {
    const { product, rating, comment } = req.body;
    const existing = await Review.findOne({ user: req.user._id, product });
    if (existing) {
      return res.status(400).json({ message: 'You have already reviewed this product' });
    }

    const hasOrderedProduct = await Order.exists({
      user: req.user._id,
      'items.product': product,
      deliveryStatus: { $in: ['delivered', 'returned'] },
    });

    if (!hasOrderedProduct) {
      return res.status(403).json({ message: 'You can review only products you have ordered' });
    }

    const review = await Review.create({ user: req.user._id, product, rating, comment });
    await syncProductRatingSummary(product);

    const populated = await review.populate('user', 'name');
    res.status(201).json(populated);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// GET /api/reviews/my
exports.getMyReviews = async (req, res) => {
  try {
    const reviews = await Review.find({ user: req.user._id }).sort({ createdAt: -1 });
    res.json(reviews);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// GET /api/reviews/:productId
exports.getProductReviews = async (req, res) => {
  try {
    const reviews = await Review.find({ product: req.params.productId })
      .populate('user', 'name')
      .sort({ createdAt: -1 });
    res.json(reviews);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// DELETE /api/reviews/:id
exports.deleteReview = async (req, res) => {
  try {
    const review = await Review.findById(req.params.id);
    if (!review) return res.status(404).json({ message: 'Review not found' });
    if (review.user.toString() !== req.user._id.toString() && req.user.role !== 'admin') {
      return res.status(403).json({ message: 'Not authorized' });
    }
    const productId = review.product;
    await review.deleteOne();
    await syncProductRatingSummary(productId);

    res.json({ message: 'Review removed' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
