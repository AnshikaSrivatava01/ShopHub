const Product = require('../models/Product');

const requiresSizes = (category) => ['clothing', 'clothes', 'footwear'].includes(String(category || '').trim().toLowerCase());
const normalizeCategoryValue = (value) => String(value || '').trim().toLowerCase().replace(/['’]/g, '');
const normalizeSizeValue = (value) => String(value || '').trim();

const normalizeProductPayload = (payload) => {
  const normalized = { ...payload };
  const hasSaleFlag = Object.prototype.hasOwnProperty.call(normalized, 'isAvailableForSale');
  const hasRentFlag = Object.prototype.hasOwnProperty.call(normalized, 'isAvailableForRent');

  if (hasSaleFlag || hasRentFlag) {
    const saleEnabled = hasSaleFlag ? Boolean(normalized.isAvailableForSale) : false;
    const rentEnabled = hasRentFlag ? Boolean(normalized.isAvailableForRent) : false;

    if (rentEnabled && !saleEnabled) normalized.type = 'rent';
    else if (saleEnabled || !rentEnabled) normalized.type = 'buy';
  }

  const salePrice = Number(normalized.salePrice) || 0;
  const rentPricePerDay = Number(normalized.rentPricePerDay) || 0;
  const rentPricePerWeek = Number(normalized.rentPricePerWeek) || 0;
  const rentPricePerMonth = Number(normalized.rentPricePerMonth) || 0;

  if (normalized.type === 'rent' && (!normalized.price || Number(normalized.price) <= 0)) {
    normalized.price = rentPricePerDay || (rentPricePerWeek > 0 ? rentPricePerWeek / 7 : 0) || (rentPricePerMonth > 0 ? rentPricePerMonth / 30 : 0) || 0;
  }
  if (normalized.type === 'buy' && (!normalized.price || Number(normalized.price) <= 0)) {
    normalized.price = salePrice || 0;
  }

  const normalizedSizes = Array.isArray(normalized.sizes)
    ? [...new Set(
      normalized.sizes
        .map((size) => normalizeSizeValue(size))
        .filter(Boolean)
    )]
    : [];

  const normalizedSizeQuantities = Array.isArray(normalized.sizeQuantities)
    ? [...new Map(
      normalized.sizeQuantities
        .map((entry) => {
          const size = normalizeSizeValue(entry?.size);
          const quantity = Math.max(0, Number(entry?.quantity) || 0);
          return size ? [size, { size, quantity }] : null;
        })
        .filter(Boolean)
    ).values()]
    : normalizedSizes.map((size) => ({ size, quantity: 0 }));

  normalized.sizeQuantities = normalizedSizeQuantities;
  normalized.sizes = normalizedSizeQuantities.map((entry) => entry.size);

  return normalized;
};

// GET /api/products
exports.getProducts = async (req, res) => {
  try {
    const { search, category, gender, minPrice, maxPrice, type, sort, rating, page = 1, limit = 12 } = req.query;
    const query = {};

    if (search) {
      query.$or = [
        { name: { $regex: search, $options: 'i' } },
        { description: { $regex: search, $options: 'i' } },
      ];
    }
    if (category) {
      const normalizedCategory = normalizeCategoryValue(category);
      if (normalizedCategory === 'footwear') {
        query.category = { $regex: new RegExp('footwear', 'i') };
      } else if (normalizedCategory === 'mens footwear') {
        query.category = { $regex: new RegExp('footwear', 'i') };
        query.gender = { $regex: /^men$/i };
      } else if (normalizedCategory === 'womens footwear') {
        query.category = { $regex: new RegExp('footwear', 'i') };
        query.gender = { $regex: /^women$/i };
      } else if (normalizedCategory === 'kids footwear') {
        query.category = { $regex: new RegExp('footwear', 'i') };
        query.gender = { $regex: /^kids$/i };
      } else {
        query.category = { $regex: new RegExp(`^${category}$`, 'i') };
      }
    }
    if (gender) {
      const g = gender.toLowerCase();
      if (g === 'unisex') {
        query.gender = { $in: [/^unisex$/i, /^men$/i, /^women$/i, /^kids$/i] };
      } else if (g === 'men' || g === 'women' || g === 'kids') {
        query.gender = { $regex: new RegExp(`^${gender}$`, 'i') };
      } else {
        query.gender = { $regex: new RegExp(`^${gender}$`, 'i') };
      }
    }
    if (type) {
      const normalizedType = String(type).toLowerCase();
      if (normalizedType === 'rent' || normalizedType === 'rental') {
        query.$and = query.$and || [];
        query.$and.push({
          $or: [
            { type: { $regex: /^rent$/i } },
            { isAvailableForRent: true },
            { rentPricePerDay: { $gt: 0 } },
            { rentPricePerWeek: { $gt: 0 } },
            { rentPricePerMonth: { $gt: 0 } },
          ],
        });
      } else if (normalizedType === 'buy' || normalizedType === 'sale') {
        query.$and = query.$and || [];
        query.$and.push({
          $or: [
            { type: { $regex: /^buy$/i } },
            { isAvailableForSale: true },
            { salePrice: { $gt: 0 } },
          ],
        });
      } else {
        query.type = { $regex: new RegExp(`^${type}$`, 'i') };
      }
    }
    if (minPrice || maxPrice) {
      const priceCondition = {};
      if (minPrice) priceCondition.$gte = Number(minPrice);
      if (maxPrice) priceCondition.$lte = Number(maxPrice);
      // Check salePrice first (buy products), fall back to price (rent products)
      query.$and = query.$and || [];
      query.$and.push({
        $or: [
          { salePrice: { $gt: 0, ...priceCondition } },
          { salePrice: { $in: [0, null] }, price: priceCondition },
        ],
      });
    }
    if (rating) {
      query.avgRating = { $gte: Number(rating) };
    }

    let sortOption = { createdAt: -1 };
    if (sort === 'rating') sortOption = { avgRating: -1 };
    if (sort === 'newest') sortOption = { createdAt: -1 };

    const skip = (Number(page) - 1) * Number(limit);
    const total = await Product.countDocuments(query);
    
    let products;
    if (sort === 'price_asc' || sort === 'price_desc') {
      const sortDir = sort === 'price_asc' ? 1 : -1;
      products = await Product.aggregate([
        { $match: query },
        { $addFields: { computedPrice: { $cond: [{ $gt: ["$salePrice", 0] }, "$salePrice", "$price"] } } },
        { $sort: { computedPrice: sortDir } },
        { $skip: skip },
        { $limit: Number(limit) }
      ]);
    } else {
      products = await Product.find(query).sort(sortOption).skip(skip).limit(Number(limit));
    }

    res.json({
      products,
      page: Number(page),
      pages: Math.ceil(total / Number(limit)),
      total,
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// GET /api/products/categories
exports.getCategories = async (req, res) => {
  try {
    const categories = await Product.distinct('category');
    res.json(categories);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// GET /api/products/:id
exports.getProductById = async (req, res) => {
  try {
    const product = await Product.findById(req.params.id);
    if (!product) return res.status(404).json({ message: 'Product not found' });
    res.json(product);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// POST /api/products (admin)
exports.createProduct = async (req, res) => {
  try {
    const payload = normalizeProductPayload(req.body);
    if (requiresSizes(payload.category) && payload.sizeQuantities.length === 0) {
      return res.status(400).json({ message: 'Size is required for clothing and footwear products' });
    }
    const product = await Product.create(payload);
    res.status(201).json(product);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// PUT /api/products/:id (admin)
exports.updateProduct = async (req, res) => {
  try {
    const payload = normalizeProductPayload(req.body);
    if (requiresSizes(payload.category) && payload.sizeQuantities.length === 0) {
      return res.status(400).json({ message: 'Size is required for clothing and footwear products' });
    }
    const product = await Product.findById(req.params.id);
    if (!product) return res.status(404).json({ message: 'Product not found' });
    Object.assign(product, payload);
    await product.save();
    res.json(product);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// DELETE /api/products/:id (admin)
exports.deleteProduct = async (req, res) => {
  try {
    const product = await Product.findByIdAndDelete(req.params.id);
    if (!product) return res.status(404).json({ message: 'Product not found' });
    res.json({ message: 'Product removed' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// GET /api/products/:id/related
exports.getRelatedProducts = async (req, res) => {
  try {
    const product = await Product.findById(req.params.id);
    if (!product) return res.status(404).json({ message: 'Product not found' });
    const related = await Product.find({ category: product.category, _id: { $ne: product._id } }).limit(4);
    res.json(related);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
