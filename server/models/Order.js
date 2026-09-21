const mongoose = require('mongoose');

const orderItemSchema = new mongoose.Schema({
  product: { type: mongoose.Schema.Types.ObjectId, ref: 'Product', required: true },
  name: { type: String, required: true },
  image: { type: String, default: '' },
  size: { type: String, default: '', trim: true },
  quantity: { type: Number, required: true, min: 1 },
  type: { type: String, enum: ['sale', 'rent'], required: true },
  rentalDuration: { type: Number, default: 0 },
  rentalUnit: { type: String, enum: ['day', 'week', 'month', ''], default: '' },
  itemPrice: { type: Number, required: true },
}, { _id: false });

const orderSchema = new mongoose.Schema({
  user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  items: [orderItemSchema],
  shippingAddress: {
    street: { type: String, required: true },
    city: { type: String, required: true },
    state: { type: String, required: true },
    pincode: { type: String, required: true },
  },
  totalPrice: { type: Number, required: true },
  paymentStatus: { type: String, enum: ['pending', 'paid', 'failed'], default: 'pending' },
  paymentId: { type: String, default: '' },
  deliveryStatus: { type: String, enum: ['processing', 'shipped', 'delivered', 'returned'], default: 'processing' },
  rentalReturnDate: { type: Date },
  returnRequest: {
    productId: { type: String, default: '' },
    issue: { type: String, default: '' },
    requestedAt: { type: Date },
  },
}, { timestamps: true });

module.exports = mongoose.model('Order', orderSchema);
