import { useState, useEffect, useCallback } from 'react';
import { useParams, Link, useNavigate, useSearchParams } from 'react-router-dom';
import { HiOutlineStar, HiOutlineShoppingCart, HiOutlineHeart, HiHeart, HiOutlineClock, HiOutlineTag } from 'react-icons/hi';
import { getProductById, getProductReviews, createReview, addToWishlist, removeFromWishlist, getWishlist, getRelatedProducts, getMyOrders } from '../utils/api';
import { useCart } from '../context/CartContext';
import { useAuth } from '../context/AuthContext';
import { formatPrice, calculateRentalPrice } from '../utils/helpers';
import { useRecentlyViewed } from '../hooks/useRecentlyViewed';
import ProductCard from '../components/ProductCard';
import toast, { Toaster } from 'react-hot-toast';

const DEFAULT_PRODUCT_RATING = 3.8;
const requiresSizeSelection = (category) => ['clothing', 'clothes', 'footwear'].includes(String(category || '').trim().toLowerCase());
const getRecentlyViewedPrice = (item) => {
  const canBuy = item.isAvailableForSale !== false && item.type !== 'rent';
  const canRent = item.isAvailableForRent === true || item.type === 'rent';

  if (canBuy) return item.salePrice || item.price || 0;
  if (canRent) return item.rentPricePerDay || item.price || 0;
  return item.salePrice || item.price || item.rentPricePerDay || 0;
};
const getSizeOptions = (product) => {
  if (Array.isArray(product?.sizeQuantities) && product.sizeQuantities.length > 0) {
    return product.sizeQuantities.map((entry) => entry.size);
  }

  return product?.sizes || [];
};

export default function ProductDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const { user } = useAuth();
  const { addItem } = useCart();
  const { recentlyViewed, addToRecentlyViewed } = useRecentlyViewed();
  const [product, setProduct] = useState(null);
  const [reviews, setReviews] = useState([]);
  const [related, setRelated] = useState([]);
  const [loading, setLoading] = useState(true);
  const [tab, setTab] = useState('buy');
  const [rentalDuration, setRentalDuration] = useState(1);
  const [rentalUnit, setRentalUnit] = useState('day');
  const [quantity, setQuantity] = useState(1);
  const [isWishlisted, setIsWishlisted] = useState(false);
  const [reviewForm, setReviewForm] = useState({ rating: 0, comment: '' });
  const [showReviewForm, setShowReviewForm] = useState(false);
  const [selectedImage, setSelectedImage] = useState(0);
  const [selectedSize, setSelectedSize] = useState('');
  const [canReview, setCanReview] = useState(false);
  const [reviewEligibilityMessage, setReviewEligibilityMessage] = useState('Order this product to write a review.');
  const requestedMode = searchParams.get('mode') || '';

  useEffect(() => {
    setLoading(true);
    setSelectedImage(0);
    setShowReviewForm(false);
    setSelectedSize('');
    Promise.all([getProductById(id), getProductReviews(id), getRelatedProducts(id)])
      .then(([pRes, rRes, relRes]) => {
        setProduct(pRes.data);
        const p = pRes.data;
        const availableForSale = p.isAvailableForSale !== false && p.type !== 'rent';
        const availableForRent = p.isAvailableForRent === true || p.type === 'rent';
        if (requestedMode === 'rent' && availableForRent) {
          setTab('rent');
        } else if (requestedMode === 'buy' && availableForSale) {
          setTab('buy');
        } else if (!availableForSale && availableForRent) {
          setTab('rent');
        }
        setReviews(rRes.data);
        setRelated(relRes.data);
        addToRecentlyViewed(pRes.data);
      })
      .catch(() => {}).finally(() => setLoading(false));
    if (user) {
      getWishlist().then(res => {
        setIsWishlisted(res.data.some(p => p._id === id));
      }).catch(() => {});
    } else {
      setCanReview(false);
      setReviewEligibilityMessage('Login and order this product to write a review.');
    }
  }, [id, user, requestedMode]);

  useEffect(() => {
    if (!user) {
      setCanReview(false);
      setReviewEligibilityMessage('Login and order this product to write a review.');
      return;
    }

    const hasReviewedProduct = reviews.some((review) => String(review.user?._id) === String(user._id));
    if (hasReviewedProduct) {
      setCanReview(false);
      setReviewEligibilityMessage('You have already reviewed this product.');
      return;
    }

    getMyOrders().then((res) => {
      const hasOrderedProduct = res.data.some((order) =>
        ['delivered', 'returned'].includes(String(order.deliveryStatus || '').trim().toLowerCase())
        && order.items?.some((item) => String(item.product) === String(id))
      );

      if (hasOrderedProduct) {
        setCanReview(true);
        setReviewEligibilityMessage('You can review this product because you ordered it.');
        return;
      }

      setCanReview(false);
      setReviewEligibilityMessage('Only customers who ordered this product can write a review.');
    }).catch(() => {
      setCanReview(false);
      setReviewEligibilityMessage('We could not verify your orders right now.');
    });
  }, [id, user, reviews]);

  const handleAddToCart = () => {
    if (!product) return;
    if (requiresSizeSelection(product.category) && !selectedSize) {
      toast.error('Please select a size before adding this item');
      return;
    }
    if (tab === 'buy') {
      addItem(product, 'sale', quantity, 1, 'day', selectedSize);
      toast.success('Added to cart for purchase!');
    } else {
      addItem(product, 'rent', quantity, rentalDuration, rentalUnit, selectedSize);
      toast.success(`Added to cart for ${rentalDuration} ${rentalUnit}(s) rental!`);
    }
    navigate('/cart');
  };

  const handlePrimaryPurchase = () => {
    if (!product) return;
    if (requiresSizeSelection(product.category) && !selectedSize) {
      toast.error('Please select a size before continuing');
      return;
    }

    if (tab === 'buy') {
      addItem(product, 'sale', quantity, 1, 'day', selectedSize);
      toast.success('Proceeding to checkout');
    } else {
      addItem(product, 'rent', quantity, rentalDuration, rentalUnit, selectedSize);
      toast.success('Proceeding to checkout');
    }

    navigate('/checkout');
  };

  const handleWishlist = async () => {
    if (!user) return toast.error('Please login first');
    try {
      if (isWishlisted) { await removeFromWishlist(id); setIsWishlisted(false); toast.success('Removed from wishlist'); }
      else { await addToWishlist(id); setIsWishlisted(true); toast.success('Added to wishlist'); }
    } catch { toast.error('Failed to update wishlist'); }
  };

  const handleReview = async (e) => {
    e.preventDefault();
    if (!user) return toast.error('Please login first');
    if (!reviewForm.rating) return toast.error('Please select a rating');
    try {
      const res = await createReview({ product: id, ...reviewForm });
      setReviews([res.data, ...reviews]);
      setShowReviewForm(false);
      setReviewForm({ rating: 0, comment: '' });
      setCanReview(false);
      setReviewEligibilityMessage('You have already reviewed this product.');
      toast.success('Review submitted!');
      const pRes = await getProductById(id);
      setProduct(pRes.data);
    } catch (err) { toast.error(err.response?.data?.message || 'Error submitting review'); }
  };

  const rentalTotal = product ? calculateRentalPrice(product, rentalDuration, rentalUnit) : 0;
  const FALLBACK_IMG = 'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=800';
  const images = product?.images?.length > 0 ? product.images : (product?.image ? [product.image] : [FALLBACK_IMG]);
  const displayPrice = product?.salePrice || product?.price || 0;
  const displayRating = product?.avgRating || DEFAULT_PRODUCT_RATING;
  const handleImgError = useCallback((e) => { e.target.src = FALLBACK_IMG; }, []);
  const filteredRecent = recentlyViewed.filter(p => p._id !== id);
  const sizeOptions = getSizeOptions(product);

  if (loading) return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 py-8">
      <div className="grid md:grid-cols-2 gap-8">
        <div className="aspect-square skeleton rounded-2xl"></div>
        <div className="space-y-4"><div className="h-8 skeleton rounded w-3/4"></div><div className="h-4 skeleton rounded w-1/2"></div><div className="h-24 skeleton rounded"></div><div className="h-12 skeleton rounded w-1/3"></div></div>
      </div>
    </div>
  );

  if (!product) return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 py-20 text-center">
      <h2 className="text-2xl font-bold text-surface-800">Product not found</h2>
      <Link to="/products" className="text-primary-600 hover:text-primary-700 mt-4 inline-block">← Back to Products</Link>
    </div>
  );

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 py-8">
      <Toaster position="top-right" />
      {/* Breadcrumb */}
      <div className="flex items-center gap-2 text-sm text-surface-700/60 mb-6">
        <Link to="/" className="hover:text-primary-600">Home</Link>
        <span>/</span>
        <Link to="/products" className="hover:text-primary-600">Products</Link>
        <span>/</span>
        <Link to={`/products?category=${product.category}`} className="hover:text-primary-600">{product.category}</Link>
        <span>/</span>
        <span className="text-surface-800 font-medium truncate">{product.name}</span>
      </div>

      <div className="grid md:grid-cols-2 gap-10 animate-fade-in-up">
        {/* ─── Image Gallery ─── */}
        <div>
          {/* Main Image */}
          <div className="aspect-square bg-surface-100 rounded-3xl overflow-hidden shadow-lg mb-4 group relative">
            <img
              src={images[selectedImage]}
              alt={product.name}
              className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
              onError={handleImgError}
            />
          </div>
          {/* Thumbnails */}
          {images.length > 1 && (
            <div className="flex gap-3 overflow-x-auto pb-2">
              {images.map((img, idx) => (
                <button
                  key={idx}
                  onClick={() => setSelectedImage(idx)}
                  className={`w-20 h-20 flex-shrink-0 rounded-xl overflow-hidden border-2 transition-all duration-200 ${
                    idx === selectedImage
                      ? 'border-primary-500 ring-2 ring-primary-200 shadow-md'
                      : 'border-surface-200 hover:border-surface-300 opacity-60 hover:opacity-100'
                  }`}
                >
                  <img src={img} alt={`${product.name} ${idx + 1}`} className="w-full h-full object-cover" onError={handleImgError} />
                </button>
              ))}
            </div>
          )}
        </div>

        {/* Details */}
        <div>
          <span className="inline-block px-3 py-1 bg-primary-50 text-primary-600 text-sm font-medium rounded-lg">{product.category}</span>
          <h1 className="text-3xl font-bold text-surface-900 mt-3">{product.name}</h1>

          {/* Rating */}
          <div className="flex items-center gap-2 mt-3">
            <div className="flex items-center">
              {[...Array(5)].map((_, i) => (
                <HiOutlineStar key={i} className={`w-5 h-5 ${i < Math.round(displayRating) ? 'text-accent-500 fill-accent-500' : 'text-surface-200'}`} />
              ))}
            </div>
            <span className="text-sm text-surface-700/60">{displayRating.toFixed(1)} ({product.numReviews} reviews)</span>
          </div>

          <p className="text-surface-700/70 mt-4 leading-relaxed">{product.description}</p>

          {sizeOptions.length > 0 && (
            <div className="mt-5">
              <p className="text-sm font-semibold text-surface-900 mb-2">Available Sizes</p>
              <div className="flex flex-wrap gap-2">
                {sizeOptions.map((size) => (
                  <span
                    key={size}
                    className="inline-flex items-center px-3 py-1.5 rounded-xl border border-surface-200 bg-white text-sm font-medium text-surface-800"
                  >
                    {size}
                  </span>
                ))}
              </div>
            </div>
          )}

          <div className="mt-4">
            <span className={`inline-block px-3 py-1 rounded-full text-sm font-medium ${product.stock > 0 ? 'bg-green-50 text-green-700' : 'bg-red-50 text-red-700'}`}>
              {product.stock > 0 ? `${product.stock} in stock` : 'Out of stock'}
            </span>
          </div>

          {/* Buy / Rent Tabs */}
          <div className="mt-6 bg-surface-50 rounded-2xl p-5 border border-surface-200">
            <div className="flex gap-2 mb-5">
              {(product.isAvailableForSale !== false && product.type !== 'rent') && (
                <button onClick={() => setTab('buy')} className={`flex-1 flex items-center justify-center gap-2 py-2.5 rounded-xl text-sm font-semibold transition-all ${tab === 'buy' ? 'bg-white text-primary-700 shadow-md' : 'text-surface-700/60 hover:text-surface-700'}`}>
                  <HiOutlineTag className="w-4 h-4" /> Buy
                </button>
              )}
              {(product.isAvailableForRent === true || product.type === 'rent') && (
                <button onClick={() => setTab('rent')} className={`flex-1 flex items-center justify-center gap-2 py-2.5 rounded-xl text-sm font-semibold transition-all ${tab === 'rent' ? 'bg-white text-primary-700 shadow-md' : 'text-surface-700/60 hover:text-surface-700'}`}>
                  <HiOutlineClock className="w-4 h-4" /> Rent
                </button>
              )}
            </div>

            {tab === 'buy' ? (
              <div>
                {requiresSizeSelection(product.category) && sizeOptions.length > 0 && (
                  <div className="mb-4">
                    <p className="text-sm font-semibold text-surface-900 mb-2">Select Size</p>
                    <select
                      value={selectedSize}
                      onChange={(e) => setSelectedSize(e.target.value)}
                      className="w-full px-3 py-3 rounded-xl border border-surface-200 text-sm focus:ring-2 focus:ring-primary-400 focus:outline-none bg-white"
                    >
                      <option value="">Choose a size</option>
                      {sizeOptions.map((size) => (
                        <option key={size} value={size}>
                          {size}
                        </option>
                      ))}
                    </select>
                  </div>
                )}

                <div className="flex items-baseline gap-2">
                  <span className="text-3xl font-bold text-surface-900">{formatPrice(displayPrice)}</span>
                </div>
                <div className="flex items-center gap-3 mt-4">
                  <span className="text-sm text-surface-700/60">Qty:</span>
                  <div className="flex items-center border border-surface-200 rounded-xl overflow-hidden">
                    <button onClick={() => setQuantity(Math.max(1, quantity - 1))} className="px-3 py-1.5 hover:bg-surface-100 text-lg">−</button>
                    <span className="px-4 py-1.5 font-medium border-x border-surface-200">{quantity}</span>
                    <button onClick={() => setQuantity(quantity + 1)} className="px-3 py-1.5 hover:bg-surface-100 text-lg">+</button>
                  </div>
                </div>
                <p className="text-lg font-semibold mt-3 text-surface-900">Total: {formatPrice(displayPrice * quantity)}</p>
              </div>
            ) : (
              <div>
                {requiresSizeSelection(product.category) && sizeOptions.length > 0 && (
                  <div className="mb-4">
                    <p className="text-sm font-semibold text-surface-900 mb-2">Select Size</p>
                    <select
                      value={selectedSize}
                      onChange={(e) => setSelectedSize(e.target.value)}
                      className="w-full px-3 py-3 rounded-xl border border-surface-200 text-sm focus:ring-2 focus:ring-primary-400 focus:outline-none bg-white"
                    >
                      <option value="">Choose a size</option>
                      {sizeOptions.map((size) => (
                        <option key={size} value={size}>
                          {size}
                        </option>
                      ))}
                    </select>
                  </div>
                )}

                <div className="grid grid-cols-3 gap-2 mb-4">
                  <div className="text-center p-2 rounded-xl bg-white border border-surface-200">
                    <p className="text-xs text-surface-700/50">Per Day</p>
                    <p className="font-bold text-surface-900">{formatPrice(product.rentPricePerDay)}</p>
                  </div>
                  <div className="text-center p-2 rounded-xl bg-white border border-surface-200">
                    <p className="text-xs text-surface-700/50">Per Week</p>
                    <p className="font-bold text-surface-900">{formatPrice(product.rentPricePerWeek)}</p>
                  </div>
                  <div className="text-center p-2 rounded-xl bg-white border border-surface-200">
                    <p className="text-xs text-surface-700/50">Per Month</p>
                    <p className="font-bold text-surface-900">{formatPrice(product.rentPricePerMonth)}</p>
                  </div>
                </div>
                <div className="flex items-center gap-3 mb-3">
                  <select value={rentalUnit} onChange={(e) => setRentalUnit(e.target.value)} className="px-3 py-2 rounded-xl border border-surface-200 text-sm focus:outline-none focus:ring-2 focus:ring-primary-400 bg-white">
                    <option value="day">Days</option>
                    <option value="week">Weeks</option>
                    <option value="month">Months</option>
                  </select>
                  <div className="flex items-center border border-surface-200 rounded-xl overflow-hidden">
                    <button onClick={() => setRentalDuration(Math.max(1, rentalDuration - 1))} className="px-3 py-1.5 hover:bg-surface-100 text-lg">−</button>
                    <span className="px-4 py-1.5 font-medium border-x border-surface-200">{rentalDuration}</span>
                    <button onClick={() => setRentalDuration(rentalDuration + 1)} className="px-3 py-1.5 hover:bg-surface-100 text-lg">+</button>
                  </div>
                </div>
                <div className="bg-blue-50 border border-blue-100 p-3 rounded-xl mb-3 text-sm text-blue-800">
                  <span className="font-semibold">Note:</span> An extra amount of ₹1,000 will be taken as a security deposit per item and will be returned as the product is received back to us.
                </div>
                <p className="text-lg font-semibold text-surface-900">Total: {formatPrice(rentalTotal)}</p>
              </div>
            )}

            <div className="flex gap-3 mt-5">
              <button onClick={handlePrimaryPurchase} disabled={product.stock === 0} className="flex-1 flex items-center justify-center gap-2 py-3 bg-gradient-to-r from-primary-500 to-primary-700 text-white rounded-xl font-semibold hover:shadow-lg hover:shadow-primary-500/30 transform hover:-translate-y-0.5 transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed">
                <HiOutlineShoppingCart className="w-5 h-5" /> {tab === 'buy' ? 'Buy Now' : 'Rent Now'}
              </button>
              <button onClick={handleAddToCart} disabled={product.stock === 0} className="flex-1 flex items-center justify-center gap-2 py-3 border border-primary-200 text-primary-700 bg-white rounded-xl font-semibold hover:bg-primary-50 transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed">
                <HiOutlineShoppingCart className="w-5 h-5" /> Add to Cart
              </button>
              <button onClick={handleWishlist} className={`p-3 rounded-xl border transition-all ${isWishlisted ? 'bg-red-50 border-red-200 text-red-500' : 'border-surface-200 text-surface-700/50 hover:border-red-200 hover:text-red-400'}`}>
                {isWishlisted ? <HiHeart className="w-5 h-5" /> : <HiOutlineHeart className="w-5 h-5" />}
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* ─── Related Products ─── */}
      {related.length > 0 && (
        <section className="mt-20">
          <h2 className="text-2xl font-bold text-surface-900 mb-8">You May Also Like</h2>
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-5">
            {related.map(p => (
              <ProductCard key={p._id} product={p} />
            ))}
          </div>
        </section>
      )}

      {/* ─── Recently Viewed ─── */}
      {filteredRecent.length > 0 && (
        <section className="mt-20">
          <h2 className="text-2xl font-bold text-surface-900 mb-8">Recently Viewed</h2>
          <div className="flex gap-4 overflow-x-auto pb-4">
            {filteredRecent.slice(0, 6).map(p => (
              <Link key={p._id} to={`/products/${p._id}`} className="flex-shrink-0 w-40 group">
                <div className="aspect-square rounded-2xl overflow-hidden bg-surface-100 mb-2 shadow-sm group-hover:shadow-md transition-all">
                  <img src={p.images?.[0] || p.image || ''} alt={p.name} className="w-full h-full object-cover group-hover:scale-105 transition-transform" />
                </div>
                <p className="text-sm font-semibold text-surface-800 truncate group-hover:text-primary-600 transition-colors">{p.name}</p>
                <p className="text-sm font-bold text-primary-600">{formatPrice(getRecentlyViewedPrice(p))}</p>
              </Link>
            ))}
          </div>
        </section>
      )}

      {/* ─── Reviews ─── */}
      <section className="mt-20">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-2xl font-bold text-surface-900">Reviews ({reviews.length})</h2>
          {user && canReview && (
            <button onClick={() => setShowReviewForm(!showReviewForm)} className="px-4 py-2 text-sm font-medium text-primary-600 hover:bg-primary-50 rounded-xl transition-colors">
              {showReviewForm ? 'Cancel' : 'Write a Review'}
            </button>
          )}
        </div>

        <p className="text-sm text-surface-700/60 mb-4">{reviewEligibilityMessage}</p>

        {showReviewForm && (
          <form onSubmit={handleReview} className="bg-white rounded-2xl p-6 shadow-md mb-8 animate-fade-in">
            <div className="mb-4">
              <label className="block text-sm font-medium text-surface-700 mb-2">Rating</label>
              <div className="flex gap-1">
                {[1, 2, 3, 4, 5].map(star => (
                  <button key={star} type="button" onClick={() => setReviewForm({ ...reviewForm, rating: star })}>
                    <HiOutlineStar className={`w-7 h-7 ${star <= reviewForm.rating ? 'text-accent-500 fill-accent-500' : 'text-surface-200'}`} />
                  </button>
                ))}
              </div>
            </div>
            <div className="mb-4">
              <label className="block text-sm font-medium text-surface-700 mb-2">Comment</label>
              <textarea value={reviewForm.comment} onChange={(e) => setReviewForm({ ...reviewForm, comment: e.target.value })} rows={3} required className="w-full px-4 py-2.5 rounded-xl border border-surface-200 focus:outline-none focus:ring-2 focus:ring-primary-400 text-sm" placeholder="Share your experience..." />
            </div>
            <button type="submit" className="px-6 py-2.5 bg-primary-600 text-white rounded-xl text-sm font-medium hover:bg-primary-700 transition-colors">Submit Review</button>
          </form>
        )}

        <div className="space-y-4">
          {reviews.map(review => (
            <div key={review._id} className="bg-white rounded-2xl p-5 shadow-sm border border-surface-100">
              <div className="flex items-center justify-between mb-2">
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 bg-gradient-to-br from-primary-400 to-primary-600 text-white rounded-full flex items-center justify-center text-sm font-bold">{review.user?.name?.[0] || '?'}</div>
                  <div>
                    <p className="font-medium text-surface-800 text-sm">{review.user?.name || 'User'}</p>
                    <div className="flex items-center gap-1">
                      {[...Array(5)].map((_, i) => (
                        <HiOutlineStar key={i} className={`w-3.5 h-3.5 ${i < review.rating ? 'text-accent-500 fill-accent-500' : 'text-surface-200'}`} />
                      ))}
                    </div>
                  </div>
                </div>
                <span className="text-xs text-surface-700/50">{new Date(review.createdAt).toLocaleDateString('en-IN')}</span>
              </div>
              <p className="text-sm text-surface-700/70 ml-11">{review.comment}</p>
            </div>
          ))}
          {reviews.length === 0 && <p className="text-center text-surface-700/50 py-8">No reviews yet. Be the first to review!</p>}
        </div>
      </section>
    </div>
  );
}
