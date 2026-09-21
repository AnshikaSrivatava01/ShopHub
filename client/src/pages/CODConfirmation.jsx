import { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { getMyOrders } from '../utils/api';
import { formatPrice } from '../utils/helpers';
import { HiOutlineCheckCircle, HiOutlinePhone, HiOutlineLocationMarker, HiOutlineClock } from 'react-icons/hi';

export default function CODConfirmation() {
  const navigate = useNavigate();
  const [order, setOrder] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    getMyOrders()
      .then(res => {
        const latestOrder = res.data[0];
        setOrder(latestOrder);
      })
      .catch(() => {
        navigate('/orders');
      })
      .finally(() => setLoading(false));
  }, [navigate]);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="w-10 h-10 border-2 border-surface-200 border-t-primary-600 rounded-full animate-spin"></div>
      </div>
    );
  }

  if (!order) {
    return (
      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-20 text-center">
        <h2 className="text-2xl font-bold text-surface-800 mb-4">Order not found</h2>
        <Link to="/orders" className="text-primary-600 font-medium">← View all orders</Link>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 to-blue-50 py-12 px-4 sm:px-6">
      <div className="max-w-3xl mx-auto">
        {/* Success Header */}
        <div className="text-center mb-12">
          <div className="flex justify-center mb-6">
            <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center animate-bounce">
              <HiOutlineCheckCircle className="w-12 h-12 text-green-600" />
            </div>
          </div>
          <h1 className="text-4xl font-bold text-surface-900 mb-3">Order Confirmed! ✅</h1>
          <p className="text-lg text-surface-600">Your order has been successfully placed. Payment will be collected on delivery.</p>
        </div>

        {/* Order Details Card */}
        <div className="bg-white rounded-3xl shadow-xl p-8 mb-8 border border-surface-100">
          <div className="mb-8">
            <p className="text-xs font-bold text-surface-500 uppercase tracking-wider mb-2">Order ID</p>
            <p className="text-2xl font-bold text-surface-900 font-mono">{order._id}</p>
          </div>

          <div className="grid md:grid-cols-2 gap-8 mb-8 pb-8 border-b border-surface-200">
            {/* Left Column */}
            <div className="space-y-6">
              {/* Shipping Address */}
              <div>
                <div className="flex items-center gap-3 mb-3">
                  <HiOutlineLocationMarker className="w-5 h-5 text-primary-600" />
                  <h3 className="font-bold text-surface-900">Delivery Address</h3>
                </div>
                <div className="bg-surface-50 rounded-2xl p-4 text-sm text-surface-700">
                  <p className="font-semibold">{order.shippingAddress?.street}</p>
                  <p>{order.shippingAddress?.city}, {order.shippingAddress?.state} {order.shippingAddress?.pincode}</p>
                </div>
              </div>

              {/* Delivery Time */}
              <div>
                <div className="flex items-center gap-3 mb-3">
                  <HiOutlineClock className="w-5 h-5 text-primary-600" />
                  <h3 className="font-bold text-surface-900">Expected Delivery</h3>
                </div>
                <p className="text-sm text-surface-700 bg-surface-50 rounded-2xl p-4">
                  <span className="font-semibold">3-5 Business Days</span><br/>
                  <span className="text-xs text-surface-600">We'll send you tracking updates via email and SMS</span>
                </p>
              </div>
            </div>

            {/* Right Column */}
            <div className="space-y-6">
              {/* Payment Method */}
              <div>
                <p className="text-xs font-bold text-surface-500 uppercase tracking-wider mb-3">Payment Method</p>
                <div className="bg-amber-50 rounded-2xl p-4 border border-amber-200">
                  <p className="font-bold text-amber-900 text-lg">💵 Cash on Delivery</p>
                  <p className="text-sm text-amber-700 mt-2">Amount to pay on delivery: <span className="font-bold text-lg">{formatPrice(order.totalPrice)}</span></p>
                </div>
              </div>

              {/* Contact */}
              <div>
                <div className="flex items-center gap-3 mb-3">
                  <HiOutlinePhone className="w-5 h-5 text-primary-600" />
                  <h3 className="font-bold text-surface-900">Need Help?</h3>
                </div>
                <p className="text-sm text-surface-700 bg-surface-50 rounded-2xl p-4">
                  Call us at <span className="font-bold">+91 70796 90128</span><br/>
                  or email <span className="font-bold">support@shophub.in</span>
                </p>
              </div>
            </div>
          </div>

          {/* Order Summary */}
          <div className="mb-8">
            <h3 className="font-bold text-surface-900 mb-4">Order Summary</h3>
            <div className="space-y-3 mb-4 pb-4 border-b border-surface-200">
              {order.items?.map((item, idx) => (
                <div key={idx} className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    {item.image && <img src={item.image} alt={item.name} className="w-12 h-12 rounded-lg object-cover" />}
                    <div>
                      <p className="font-medium text-surface-800">{item.name}</p>
                      <p className="text-xs text-surface-600">
                        {item.type === 'sale' ? `Qty: ${item.quantity}` : `${item.rentalDuration} ${item.rentalUnit}(s)`}
                      </p>
                    </div>
                  </div>
                  <p className="font-semibold text-surface-900">{formatPrice(item.itemPrice)}</p>
                </div>
              ))}
            </div>
            <div className="space-y-2">
              <div className="flex justify-between text-sm text-surface-600">
                <span>Subtotal</span>
                <span>{formatPrice(order.totalPrice * 0.9)}</span>
              </div>
              <div className="flex justify-between text-sm text-surface-600">
                <span>Shipping</span>
                <span className="text-green-600">Free</span>
              </div>
              <div className="flex justify-between text-lg font-bold pt-2 border-t border-surface-200">
                <span>Total</span>
                <span className="text-primary-600">{formatPrice(order.totalPrice)}</span>
              </div>
            </div>
          </div>

          {/* What's Next */}
          <div className="bg-blue-50 rounded-2xl p-6 border border-blue-200">
            <h3 className="font-bold text-blue-900 mb-3">📋 What's Next?</h3>
            <ul className="space-y-2 text-sm text-blue-800">
              <li className="flex gap-2"><span>✓</span> <span>You'll receive an order confirmation email shortly</span></li>
              <li className="flex gap-2"><span>✓</span> <span>Our delivery partner will contact you before arrival</span></li>
              <li className="flex gap-2"><span>✓</span> <span>You can track your order in the "Orders" section</span></li>
              <li className="flex gap-2"><span>✓</span> <span>Pay the amount on delivery</span></li>
            </ul>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <Link to="/orders" className="px-8 py-3 bg-primary-600 text-white rounded-xl font-semibold hover:bg-primary-700 transition-colors text-center">
            Track Order
          </Link>
          <Link to="/products" className="px-8 py-3 bg-surface-900 text-white rounded-xl font-semibold hover:bg-surface-800 transition-colors text-center">
            Continue Shopping
          </Link>
        </div>
      </div>
    </div>
  );
}
