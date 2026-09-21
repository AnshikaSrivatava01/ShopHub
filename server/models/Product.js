const mongoose = require('mongoose');

const requiresSizes = (category) => ['clothing', 'clothes', 'footwear'].includes(String(category || '').trim().toLowerCase());
const normalizeSizeValue = (value) => String(value || '').trim();

const sizeQuantitySchema = new mongoose.Schema({
  size: { type: String, required: true, trim: true },
  quantity: { type: Number, required: true, min: 0, default: 0 },
}, { _id: false });

const productSchema = new mongoose.Schema({
  name: { type: String, required: true, trim: true },
  description: { type: String, default: '' },
  category: { type: String, required: true, trim: true },
  gender: { type: String, enum: ['Men', 'Women', 'Kids', 'Unisex'], default: 'Unisex' },
  sizes: {
    type: [String],
    default: [],
    set: (sizes) => {
      if (!Array.isArray(sizes)) return [];
      return [...new Set(
        sizes
          .map((size) => String(size || '').trim())
          .filter(Boolean)
      )];
    },
    validate: {
      validator(value) {
        return !requiresSizes(this.category) || value.length > 0;
      },
      message: 'At least one size is required for clothing and footwear products',
    },
  },
  sizeQuantities: {
    type: [sizeQuantitySchema],
    default: [],
    validate: {
      validator(value) {
        if (!requiresSizes(this.category)) return true;
        return Array.isArray(value)
          && value.length > 0
          && value.every((entry) => normalizeSizeValue(entry?.size) && Number(entry?.quantity) >= 0);
      },
      message: 'At least one size quantity is required for clothing and footwear products',
    },
  },

  // Pricing
  price: { type: Number, min: 0, default: 0 },
  salePrice: { type: Number, min: 0, default: 0 },

  // Rental pricing
  rentPricePerDay: { type: Number, min: 0, default: 0 },
  rentPricePerWeek: { type: Number, min: 0, default: 0 },
  rentPricePerMonth: { type: Number, min: 0, default: 0 },

  // Type & availability
  type: { type: String, enum: ['buy', 'rent'], default: 'buy' },
  isAvailableForSale: { type: Boolean, default: true },
  isAvailableForRent: { type: Boolean, default: false },

  // Stock
  stock: { type: Number, required: true, default: 0, min: 0 },

  // Images — supports array of URLs; `image` kept for backward compat
  image: { type: String, default: '' },
  images: { type: [String], default: [] },

  // Ratings
  avgRating: { type: Number, default: 3.8, min: 0, max: 5 },
  numReviews: { type: Number, default: 0 },
}, { timestamps: true });

productSchema.pre('validate', function syncSizesAndStock(next) {
  if (requiresSizes(this.category)) {
    const normalizedSizeQuantities = [...new Map(
      (Array.isArray(this.sizeQuantities) ? this.sizeQuantities : [])
        .map((entry) => {
          const size = normalizeSizeValue(entry?.size);
          const quantity = Math.max(0, Number(entry?.quantity) || 0);
          return size ? [size, { size, quantity }] : null;
        })
        .filter(Boolean)
    ).values()];

    this.sizeQuantities = normalizedSizeQuantities;
    this.sizes = normalizedSizeQuantities.map((entry) => entry.size);
    this.stock = normalizedSizeQuantities.reduce((sum, entry) => sum + Number(entry.quantity || 0), 0);
  } else {
    this.sizeQuantities = [];
    this.sizes = [];
    this.stock = Math.max(0, Number(this.stock) || 0);
  }

  next();
});

productSchema.index({ name: 'text', description: 'text', category: 'text' });

module.exports = mongoose.model('Product', productSchema);
