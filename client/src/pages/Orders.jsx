import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import toast from 'react-hot-toast';
import { createReview, getMyOrders, getMyReviews, requestOrderReturn } from '../utils/api';
import { formatPrice, getStatusColor, getStatusLabel } from '../utils/helpers';
import { HiOutlineCheckCircle, HiOutlineTruck, HiOutlineClipboardCheck, HiOutlineCube, HiOutlineHome } from 'react-icons/hi';

const trackingSteps = [
  { key: 'Ordered', label: 'Ordered', icon: HiOutlineClipboardCheck },
  { key: 'Confirmed', label: 'Confirmed', icon: HiOutlineCube },
  { key: 'Shipped', label: 'Shipped', icon: HiOutlineTruck },
  { key: 'Out for Delivery', label: 'Out for Delivery', icon: HiOutlineHome },
  { key: 'Delivered', label: 'Delivered', icon: HiOutlineCheckCircle },
];

function getStepIndex(status) {
  const normalizedStatus = String(status || '').trim().toLowerCase();
  const map = {
    pending: 0,
    ordered: 0,
    confirmed: 1,
    processing: 1,
    shipped: 2,
    'out for delivery': 3,
    delivered: 4,
    cancelled: -1,
    returned: -1,
  };
  return map[normalizedStatus] ?? 0;
}

function OrderTracker({ status }) {
  const currentStep = getStepIndex(status);
  const normalizedStatus = String(status || '').trim().toLowerCase();
  const isCancelled = normalizedStatus === 'cancelled';
  const isReturned = normalizedStatus === 'returned';

  if (isReturned) {
    return (
      <div className="flex items-center gap-2 mt-4 px-4 py-3 bg-purple-50 rounded-xl border border-purple-100">
        <span className="text-purple-500 text-lg">↺</span>
        <span className="text-sm font-semibold text-purple-700">Order Returned</span>
      </div>
    );
  }

  if (isCancelled) {
    return (
      <div className="flex items-center gap-2 mt-4 px-4 py-3 bg-red-50 rounded-xl border border-red-100">
        <span className="text-red-500 text-lg">✕</span>
        <span className="text-sm font-semibold text-red-600">Order Cancelled</span>
      </div>
    );
  }

  return (
    <div className="mt-5">
      <div className="flex items-center justify-between relative">
        <div className="absolute top-5 left-[10%] right-[10%] h-0.5 bg-surface-200 z-0"></div>
        <div
          className="absolute top-5 left-[10%] h-0.5 bg-primary-500 z-[1] transition-all duration-700"
          style={{ width: `${Math.max(0, (currentStep / (trackingSteps.length - 1)) * 80)}%` }}
        ></div>

        {trackingSteps.map((step, idx) => {
          const Icon = step.icon;
          const isCompleted = idx <= currentStep;
          const isCurrent = idx === currentStep;
          return (
            <div key={step.key} className="flex flex-col items-center z-10 relative" style={{ flex: 1 }}>
              <div className={`w-10 h-10 rounded-full flex items-center justify-center transition-all duration-500 ${
                isCompleted
                  ? isCurrent
                    ? 'bg-primary-600 text-white ring-4 ring-primary-100 shadow-lg shadow-primary-400/30'
                    : 'bg-primary-500 text-white'
                  : 'bg-white text-surface-300 border-2 border-surface-200'
              }`}>
                <Icon className="w-5 h-5" />
              </div>
              <span className={`text-[10px] sm:text-xs font-semibold mt-2 text-center leading-tight ${
                isCompleted ? 'text-primary-700' : 'text-surface-400'
              }`}>{step.label}</span>
            </div>
          );
        })}
      </div>
    </div>
  );
}

export default function Orders() {
  const [orders, setOrders] = useState([]);
  const [reviewsByProduct, setReviewsByProduct] = useState({});
  const [loading, setLoading] = useState(true);
  const [returningOrderId, setReturningOrderId] = useState('');
  const [submittingReviewKey, setSubmittingReviewKey] = useState('');
  const [returnForm, setReturnForm] = useState({
    orderId: '',
    productId: '',
    issue: '',
  });
  const [reviewForms, setReviewForms] = useState({});

  useEffect(() => {
    Promise.all([getMyOrders(), getMyReviews()])
      .then(([ordersRes, reviewsRes]) => {
        setOrders(ordersRes.data);
        setReviewsByProduct(
          reviewsRes.data.reduce((acc, review) => {
            acc[String(review.product)] = review;
            return acc;
          }, {})
        );
      })
      .catch(() => {})
      .finally(() => setLoading(false));
  }, []);

  const setReviewFormValue = (itemKey, nextValues) => {
    setReviewForms((prev) => ({
      ...prev,
      [itemKey]: {
        rating: prev[itemKey]?.rating || 0,
        comment: prev[itemKey]?.comment || '',
        ...nextValues,
      },
    }));
  };

  const openReturnModal = (order) => {
    setReturnForm({
      orderId: order._id,
      productId: order.items?.[0]?.product || '',
      issue: '',
    });
  };

  const closeReturnModal = () => {
    setReturnForm({
      orderId: '',
      productId: '',
      issue: '',
    });
  };

  const handleReturnOrder = async () => {
    try {
      if (!returnForm.productId) return toast.error('Select a product');
      if (!returnForm.issue.trim()) return toast.error('Enter the issue for the return');

      setReturningOrderId(returnForm.orderId);
      const res = await requestOrderReturn(returnForm.orderId, {
        productId: returnForm.productId,
        issue: returnForm.issue.trim(),
      });
      setOrders((prev) => prev.map((order) => (
        order._id === returnForm.orderId ? { ...order, ...res.data } : order
      )));
      closeReturnModal();
      toast.success('Return initiated');
    } catch (error) {
      toast.error(error.response?.data?.message || 'Failed to request return');
    } finally {
      setReturningOrderId('');
    }
  };

  const handleReviewSubmit = async (orderId, item) => {
    const itemKey = `${orderId}:${String(item.product)}`;
    const reviewForm = reviewForms[itemKey] || { rating: 0, comment: '' };

    if (!reviewForm.rating) {
      return toast.error('Select a star rating before submitting');
    }

    if (!reviewForm.comment.trim()) {
      return toast.error('Write a short review before submitting');
    }

    try {
      setSubmittingReviewKey(itemKey);
      const res = await createReview({
        product: item.product,
        rating: reviewForm.rating,
        comment: reviewForm.comment.trim(),
      });

      setReviewsByProduct((prev) => ({
        ...prev,
        [String(item.product)]: res.data,
      }));
      toast.success('Rating submitted');
    } catch (error) {
      toast.error(error.response?.data?.message || 'Failed to submit rating');
    } finally {
      setSubmittingReviewKey('');
    }
  };

  const selectedOrder = orders.find((order) => order._id === returnForm.orderId);
  const selectedItem = selectedOrder?.items.find((item) => String(item.product) === returnForm.productId);

  if (loading) return <div className="max-w-7xl mx-auto px-4 sm:px-6 py-8"><div className="space-y-4">{[...Array(3)].map((_, i) => <div key={i} className="h-32 skeleton rounded-2xl"></div>)}</div></div>;

  return (
    <>
      {returnForm.orderId && (
        <div className="fixed inset-0 z-50 bg-black/40 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="w-full max-w-lg bg-white rounded-3xl shadow-2xl border border-surface-100 p-6">
            <div className="flex items-start justify-between gap-4 mb-5">
              <div>
                <h2 className="text-xl font-bold text-surface-900">Initiate Return</h2>
                <p className="text-sm text-surface-500 mt-1">Share the product and issue so we can process your return.</p>
              </div>
              <button
                type="button"
                onClick={closeReturnModal}
                className="w-9 h-9 rounded-full border border-surface-200 text-surface-500 hover:bg-surface-50"
              >
                ×
              </button>
            </div>

            <div className="space-y-4">
              <div className="rounded-2xl border border-amber-200 bg-amber-50 px-4 py-3">
                <p className="text-sm font-medium text-amber-800">
                  Return pickup will be arranged within 1-2 days after you submit this request.
                </p>
              </div>

              <div>
                <label className="block text-sm font-semibold text-surface-800 mb-2">Product</label>
                <select
                  value={returnForm.productId}
                  onChange={(e) => setReturnForm((prev) => ({ ...prev, productId: e.target.value }))}
                  className="w-full px-4 py-3 rounded-2xl border border-surface-200 focus:outline-none focus:ring-2 focus:ring-primary-400"
                >
                  {selectedOrder?.items.map((item) => (
                    <option key={String(item.product)} value={String(item.product)}>
                      {item.name}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-sm font-semibold text-surface-800 mb-2">Product ID</label>
                <input
                  value={returnForm.productId}
                  readOnly
                  className="w-full px-4 py-3 rounded-2xl border border-surface-200 bg-surface-50 text-surface-600 focus:outline-none"
                />
              </div>

              {selectedItem && (
                <div className="flex items-center gap-3 p-3 rounded-2xl bg-surface-50 border border-surface-100">
                  <img src={selectedItem.image || ''} alt="" className="w-14 h-14 rounded-xl object-cover bg-surface-100" />
                  <div className="min-w-0">
                    <p className="text-sm font-semibold text-surface-800 truncate">{selectedItem.name}</p>
                    <p className="text-xs text-surface-500">
                      {selectedItem.type === 'sale' ? `Buy × ${selectedItem.quantity}` : `Rent ${selectedItem.rentalDuration} ${selectedItem.rentalUnit}(s) × ${selectedItem.quantity}`}
                    </p>
                  </div>
                </div>
              )}

              <div>
                <label className="block text-sm font-semibold text-surface-800 mb-2">Issue</label>
                <textarea
                  rows={4}
                  value={returnForm.issue}
                  onChange={(e) => setReturnForm((prev) => ({ ...prev, issue: e.target.value }))}
                  placeholder="Describe the issue with the product"
                  className="w-full px-4 py-3 rounded-2xl border border-surface-200 focus:outline-none focus:ring-2 focus:ring-primary-400 resize-none"
                />
              </div>
            </div>

            <div className="flex justify-end gap-3 mt-6">
              <button
                type="button"
                onClick={closeReturnModal}
                className="px-4 py-2.5 rounded-2xl border border-surface-200 text-surface-700 font-semibold hover:bg-surface-50"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={handleReturnOrder}
                disabled={returningOrderId === returnForm.orderId}
                className="px-5 py-2.5 rounded-2xl bg-primary-600 text-white font-semibold hover:bg-primary-700 disabled:opacity-60 disabled:cursor-not-allowed"
              >
                {returningOrderId === returnForm.orderId ? 'Submitting...' : 'Submit Return'}
              </button>
            </div>
          </div>
        </div>
      )}

      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-8">
        <h1 className="text-3xl font-bold text-surface-900 mb-8">My Orders</h1>
        {orders.length === 0 ? (
          <div className="text-center py-16">
            <div className="text-6xl mb-4">📦</div>
            <h3 className="text-xl font-semibold text-surface-800 mb-2">No orders yet</h3>
            <p className="text-surface-700/60 mb-4">Start shopping to see your orders here</p>
            <Link to="/products" className="text-primary-600 font-medium">Browse Products →</Link>
          </div>
        ) : (
          <div className="space-y-6">
            {orders.map((order) => (
              <div key={order._id} className="bg-white rounded-2xl p-6 shadow-sm border border-surface-100 animate-fade-in">
                <div className="flex flex-wrap items-center justify-between gap-3 mb-4">
                  <div>
                    <p className="text-sm font-bold text-surface-800">Order #{order._id.slice(-8).toUpperCase()}</p>
                    <p className="text-xs text-surface-400">{new Date(order.createdAt).toLocaleDateString('en-IN', { day: 'numeric', month: 'long', year: 'numeric' })}</p>
                  </div>
                  <div className="flex gap-2">
                    <span className={`px-3 py-1 rounded-full text-xs font-medium ${getStatusColor(order.paymentStatus)}`}>{getStatusLabel(order.paymentStatus)}</span>
                    <span className={`px-3 py-1 rounded-full text-xs font-medium ${getStatusColor(order.deliveryStatus)}`}>{getStatusLabel(order.deliveryStatus)}</span>
                  </div>
                </div>

                <div className="space-y-3">
                  {order.items.map((item, i) => {
                    const itemKey = `${order._id}:${String(item.product)}`;
                    const selectedRating = reviewForms[itemKey]?.rating || 0;
                    const existingReview = reviewsByProduct[String(item.product)];
                    const canRate = ['delivered', 'returned'].includes(String(order.deliveryStatus || '').trim().toLowerCase());

                    return (
                      <div key={i} className="rounded-2xl border border-surface-100 bg-surface-50/50 p-4">
                        <div className="flex items-center gap-3 text-sm">
                          <img src={item.image || ''} alt="" className="w-12 h-12 rounded-lg object-cover bg-surface-100" />
                          <div className="flex-1 min-w-0">
                            <p className="font-medium text-surface-800 truncate">{item.name}</p>
                            <p className="text-xs text-surface-400">
                              {item.type === 'sale' ? `Buy × ${item.quantity}` : `Rent ${item.rentalDuration} ${item.rentalUnit}(s) × ${item.quantity}`}
                            </p>
                            <p className="text-[11px] text-surface-400 mt-1">Product ID: {String(item.product)}</p>
                          </div>
                          <span className="font-medium">{formatPrice(item.itemPrice)}</span>
                        </div>

                        {canRate && (
                          <div className="mt-4 rounded-2xl border border-surface-200 bg-white p-4">
                            {existingReview ? (
                              <div>
                                <p className="text-sm font-semibold text-surface-800">Your rating</p>
                                <div className="flex items-center gap-1 mt-2 text-lg text-amber-500">
                                  {[1, 2, 3, 4, 5].map((star) => (
                                    <span key={star}>{star <= existingReview.rating ? '★' : '☆'}</span>
                                  ))}
                                </div>
                                <p className="text-sm text-surface-700 mt-2">{existingReview.comment}</p>
                              </div>
                            ) : (
                              <div>
                                <p className="text-sm font-semibold text-surface-800">Rate this product</p>
                                <p className="text-xs text-surface-500 mt-1">Your rating will be reflected on the product page.</p>
                                <div className="flex items-center gap-2 mt-3">
                                  {[1, 2, 3, 4, 5].map((star) => (
                                    <button
                                      key={star}
                                      type="button"
                                      onClick={() => setReviewFormValue(itemKey, { rating: star })}
                                      className={`text-2xl transition-colors ${star <= selectedRating ? 'text-amber-500' : 'text-surface-300'}`}
                                    >
                                      ★
                                    </button>
                                  ))}
                                </div>
                                <textarea
                                  rows={3}
                                  value={reviewForms[itemKey]?.comment || ''}
                                  onChange={(e) => setReviewFormValue(itemKey, { comment: e.target.value })}
                                  placeholder="Share your experience with this product"
                                  className="w-full mt-3 px-4 py-3 rounded-2xl border border-surface-200 focus:outline-none focus:ring-2 focus:ring-primary-400 resize-none"
                                />
                                <div className="flex justify-end mt-3">
                                  <button
                                    type="button"
                                    onClick={() => handleReviewSubmit(order._id, item)}
                                    disabled={submittingReviewKey === itemKey}
                                    className="px-4 py-2 rounded-xl bg-primary-600 text-white text-sm font-semibold hover:bg-primary-700 disabled:opacity-60 disabled:cursor-not-allowed"
                                  >
                                    {submittingReviewKey === itemKey ? 'Submitting...' : 'Submit Rating'}
                                  </button>
                                </div>
                              </div>
                            )}
                          </div>
                        )}
                      </div>
                    );
                  })}
                </div>

                <OrderTracker status={order.deliveryStatus} />

                <div className="flex items-center justify-between mt-5 pt-4 border-t border-surface-100">
                  <div>
                    {order.rentalReturnDate && (
                      <p className="text-xs text-primary-600">Return by: {new Date(order.rentalReturnDate).toLocaleDateString('en-IN')}</p>
                    )}
                    {order.returnRequest?.requestedAt && (
                      <>
                        <p className="text-xs text-purple-600 mt-1">
                          Return initiated on {new Date(order.returnRequest.requestedAt).toLocaleDateString('en-IN')}
                        </p>
                        <p className="text-xs text-purple-600/80 mt-1">
                          Return pickup will be taken within 1-2 days.
                        </p>
                      </>
                    )}
                  </div>
                  <div className="flex items-center gap-3">
                    {order.deliveryStatus === 'delivered' && (
                      <button
                        type="button"
                        onClick={() => openReturnModal(order)}
                        className="px-4 py-2 rounded-xl border border-primary-200 text-primary-700 text-sm font-semibold hover:bg-primary-50 transition-colors"
                      >
                        Return Order
                      </button>
                    )}
                    <p className="font-bold text-surface-900">Total: {formatPrice(order.totalPrice)}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </>
  );
}
