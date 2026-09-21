import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useCart } from '../context/CartContext';
import { useAuth } from '../context/AuthContext';
import { createOrder, validateCoupon } from '../utils/api';
import { formatPrice } from '../utils/helpers';
import toast, { Toaster } from 'react-hot-toast';
import { HiOutlineTag, HiOutlineX } from 'react-icons/hi';

export default function Checkout() {
  const { items, getItemPrice, cartSubtotal, securityDeposit, totalPrice, clearCart } = useCart();
  const { user } = useAuth();
  const navigate = useNavigate();
  const [address, setAddress] = useState({ street: '', city: '', state: '', pincode: '' });
  const [processing, setProcessing] = useState(false);
  const [couponCode, setCouponCode] = useState('');
  const [couponLoading, setCouponLoading] = useState(false);
  const [appliedCoupon, setAppliedCoupon] = useState(null);
  const [discount, setDiscount] = useState(0);

  const finalTotal = Math.max(0, totalPrice - discount);

  if (items.length === 0) {
    return (
      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-20 text-center">
        <h2 className="text-2xl font-bold text-surface-800 mb-4">No items in cart</h2>
        <Link to="/products" className="text-primary-600 font-medium">← Back to Products</Link>
      </div>
    );
  }

  const handleApplyCoupon = async () => {
    if (!couponCode.trim()) return toast.error('Enter a coupon code');
    setCouponLoading(true);
    try {
      const res = await validateCoupon(couponCode, totalPrice);
      setDiscount(res.data.discount);
      setAppliedCoupon(res.data);
      toast.success(`Coupon applied! You save ${formatPrice(res.data.discount)}`);
    } catch (err) {
      toast.error(err.response?.data?.message || 'Invalid coupon');
    } finally {
      setCouponLoading(false);
    }
  };

  const handleRemoveCoupon = () => {
    setDiscount(0);
    setAppliedCoupon(null);
    setCouponCode('');
    toast.success('Coupon removed');
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!address.street || !address.city || !address.state || !address.pincode) return toast.error('Fill all address fields');
    setProcessing(true);
    try {
      const orderItems = items.map(item => ({
        product: item.product._id, name: item.product.name,
        image: item.product.images?.[0] || '', size: item.size || '', quantity: item.quantity,
        type: item.type, rentalDuration: item.rentalDuration,
        rentalUnit: item.rentalUnit, itemPrice: getItemPrice(item),
      }));
      await createOrder({ items: orderItems, shippingAddress: address, totalPrice: finalTotal, couponCode: appliedCoupon?.code });
      clearCart();
      toast.success('Order placed successfully! 🎉');
      setTimeout(() => navigate('/cod-confirmation'), 1500);
    } catch (err) { toast.error(err.response?.data?.message || 'Failed to place order'); }
    finally { setProcessing(false); }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 py-8">
      <Toaster position="top-right" />
      <h1 className="text-3xl font-bold text-surface-900 mb-8">Checkout</h1>
      <form onSubmit={handleSubmit}>
        <div className="grid lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2 space-y-6">
            <div className="bg-white rounded-2xl p-6 shadow-md border border-surface-100">
              <h2 className="text-lg font-bold text-surface-900 mb-5">Shipping Address</h2>
              <div className="grid gap-4">
                <div>
                  <label className="block text-sm font-medium text-surface-700 mb-1.5">Street</label>
                  <input type="text" required value={address.street} onChange={(e) => setAddress({...address, street: e.target.value})} className="w-full px-4 py-2.5 rounded-xl border border-surface-200 focus:outline-none focus:ring-2 focus:ring-primary-400 text-sm" placeholder="123 Main Street" />
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-surface-700 mb-1.5">City</label>
                    <input type="text" required value={address.city} onChange={(e) => setAddress({...address, city: e.target.value})} className="w-full px-4 py-2.5 rounded-xl border border-surface-200 focus:outline-none focus:ring-2 focus:ring-primary-400 text-sm" placeholder="Ranchi" />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-surface-700 mb-1.5">State</label>
                    <input type="text" required value={address.state} onChange={(e) => setAddress({...address, state: e.target.value})} className="w-full px-4 py-2.5 rounded-xl border border-surface-200 focus:outline-none focus:ring-2 focus:ring-primary-400 text-sm" placeholder="Jharkhand" />
                  </div>
                </div>
                <div className="w-1/2">
                  <label className="block text-sm font-medium text-surface-700 mb-1.5">PIN Code</label>
                  <input type="text" required value={address.pincode} onChange={(e) => setAddress({...address, pincode: e.target.value})} className="w-full px-4 py-2.5 rounded-xl border border-surface-200 focus:outline-none focus:ring-2 focus:ring-primary-400 text-sm" placeholder="834010" />
                </div>
              </div>
            </div>
            <div className="bg-white rounded-2xl p-6 shadow-md border border-surface-100">
              <h2 className="text-lg font-bold text-surface-900 mb-3">Payment</h2>
              <div className="bg-primary-50 rounded-xl p-4 border border-primary-100">
                <p className="text-sm text-primary-700 font-medium">💳 Demo Mode</p>
                <p className="text-xs text-primary-600/70 mt-1">In production, Stripe card input appears here.</p>
              </div>
              <div className="mt-4 bg-amber-50 rounded-xl p-4 border border-amber-200">
                <p className="text-sm font-semibold text-amber-900 mb-2">⚠️ Payment Gateway Under Development</p>
                <p className="text-xs text-amber-800">Currently, all products are available for purchase via <strong>Cash on Delivery (COD)</strong> only. Online payment methods will be available soon.</p>
              </div>
            </div>
          </div>
          <div className="lg:col-span-1">
            <div className="bg-white rounded-2xl p-6 shadow-md border border-surface-100 sticky top-24">
              <h3 className="text-lg font-bold text-surface-900 mb-4">Order Summary</h3>
              <div className="space-y-3 max-h-64 overflow-y-auto mb-4">
                {items.map(item => (
                  <div key={item.key} className="flex items-center gap-3 text-sm">
                    <img src={item.product.images?.[0] || ''} alt="" className="w-12 h-12 rounded-lg object-cover bg-surface-100" />
                    <div className="flex-1 min-w-0">
                      <p className="font-medium text-surface-800 truncate">{item.product.name}</p>
                      <p className="text-surface-700/50 text-xs">{item.type === 'sale' ? `Buy × ${item.quantity}` : `Rent ${item.rentalDuration} ${item.rentalUnit}(s)`}</p>
                      {item.size && <p className="text-surface-700/60 text-xs">Size: {item.size}</p>}
                    </div>
                    <p className="font-semibold">{formatPrice(getItemPrice(item))}</p>
                  </div>
                ))}
              </div>

              {/* Coupon Code Input */}
              <div className="border-t border-surface-100 pt-4 mb-4">
                <label className="block text-xs font-bold text-surface-500 uppercase tracking-wider mb-2">Coupon Code</label>
                {appliedCoupon ? (
                  <div className="flex items-center gap-2 p-3 bg-green-50 rounded-xl border border-green-100">
                    <HiOutlineTag className="w-4 h-4 text-green-600" />
                    <div className="flex-1">
                      <p className="text-sm font-bold text-green-700">{appliedCoupon.code}</p>
                      <p className="text-xs text-green-600">You save {formatPrice(discount)}</p>
                    </div>
                    <button type="button" onClick={handleRemoveCoupon} className="p-1 hover:bg-green-100 rounded-lg transition-colors">
                      <HiOutlineX className="w-4 h-4 text-green-600" />
                    </button>
                  </div>
                ) : (
                  <div className="flex gap-2">
                    <input
                      type="text"
                      value={couponCode}
                      onChange={(e) => setCouponCode(e.target.value.toUpperCase())}
                      className="flex-1 px-3 py-2 rounded-xl border border-surface-200 focus:outline-none focus:ring-2 focus:ring-primary-400 text-sm font-semibold uppercase tracking-wider"
                      placeholder="ENTER CODE"
                    />
                    <button type="button" onClick={handleApplyCoupon} disabled={couponLoading} className="px-4 py-2 bg-surface-900 text-white rounded-xl text-sm font-bold hover:bg-primary-600 transition-all disabled:opacity-50">
                      {couponLoading ? '...' : 'Apply'}
                    </button>
                  </div>
                )}
              </div>

              <div className="border-t border-surface-100 pt-4 space-y-2 text-sm">
                <div className="flex justify-between"><span className="text-surface-700/60">Subtotal</span><span>{formatPrice(cartSubtotal)}</span></div>
                {securityDeposit > 0 && (
                  <div className="flex justify-between"><span className="text-surface-700/60">Security Deposit (Refundable)</span><span>{formatPrice(securityDeposit)}</span></div>
                )}
                {discount > 0 && (
                  <div className="flex justify-between text-green-600"><span>Discount</span><span>−{formatPrice(discount)}</span></div>
                )}
                <div className="flex justify-between"><span className="text-surface-700/60">Shipping</span><span className="text-green-600">Free</span></div>
                <div className="flex justify-between text-lg font-bold pt-2 border-t border-surface-100"><span>Total</span><span>{formatPrice(finalTotal)}</span></div>
              </div>
              <button type="submit" disabled={processing} className="w-full mt-6 py-3 bg-gradient-to-r from-primary-500 to-primary-700 text-white rounded-xl font-semibold hover:shadow-lg transition-all disabled:opacity-50">
                {processing ? 'Processing...' : `Place Order (COD) - ${formatPrice(finalTotal)}`}
              </button>
            </div>
          </div>
        </div>
      </form>
    </div>
  );
}
