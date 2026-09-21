import { Link } from 'react-router-dom';
import { HiOutlineHeart, HiHeart, HiStar } from 'react-icons/hi';
import { formatPrice } from '../utils/helpers';
import { useState } from 'react';

const FALLBACK_IMG = 'https://images.unsplash.com/photo-1441986300917-64674bd600d8?w=500&h=500&fit=crop';

export default function ProductCard({ product, onWishlistToggle, isWishlisted }) {
  const [imgError, setImgError] = useState(false);
  const imgSrc = (!imgError && (product.images?.[0] || product.image)) || FALLBACK_IMG;
  const displayPrice = product.salePrice || product.price || 0;
  const canBuy = product.isAvailableForSale !== false && product.type !== 'rent';
  const canRent = product.isAvailableForRent === true || product.type === 'rent';

  return (
    <div className="product-card group">
      {/* Image Area */}
      <Link to={`/products/${product._id}`} className="product-card__img-wrap">
        <img
          src={imgSrc}
          alt={product.name}
          className="product-card__img"
          loading="lazy"
          onError={() => setImgError(true)}
        />

        {/* Badges */}
        <div className="product-card__badges">
          {product.type === 'rent' && (
            <span className="product-card__badge product-card__badge--rent">For Rent</span>
          )}
          {product.type === 'buy' && (
            <span className="product-card__badge product-card__badge--sale">For Sale</span>
          )}
        </div>

        {/* Stock state */}
        {product.stock === 0 && (
          <span className="product-card__low-stock bg-red-500/90">
            Out of stock
          </span>
        )}

        {product.stock < 5 && product.stock > 0 && (
          <span className="product-card__low-stock">
            Only {product.stock} left
          </span>
        )}

        {/* Wishlist */}
        {onWishlistToggle && (
          <button
            onClick={(e) => { e.preventDefault(); e.stopPropagation(); onWishlistToggle(product._id); }}
            className="product-card__wishlist"
            title="Add to Wishlist"
          >
            {isWishlisted
              ? <HiHeart className="w-5 h-5 text-red-500" />
              : <HiOutlineHeart className="w-5 h-5 text-gray-500 group-hover:text-red-400 transition-colors" />
            }
          </button>
        )}
      </Link>

      {/* Info Area */}
      <div className="product-card__info">
        <p className="product-card__category">{product.category}</p>

        <Link to={`/products/${product._id}`}>
          <h3 className="product-card__name">{product.name}</h3>
        </Link>

        {/* Rating */}
        <div className="product-card__rating">
          <div className="product-card__stars">
            {[...Array(5)].map((_, i) => (
              <HiStar
                key={i}
                className={`w-3.5 h-3.5 ${i < Math.round(product.avgRating || 0) ? 'text-amber-400' : 'text-gray-200'}`}
              />
            ))}
          </div>
          <span className="product-card__rating-text">
            {product.avgRating ? product.avgRating.toFixed(1) : 'New'}
            {product.numReviews > 0 && ` (${product.numReviews})`}
          </span>
        </div>

        {/* Price */}
        <div className="product-card__price-row">
          <span className="product-card__price">{formatPrice(displayPrice)}</span>
          {canRent && !canBuy && (
            <span className="product-card__rent-label">/ day</span>
          )}
        </div>

        {product.stock === 0 && (
          <p className="mt-2 text-sm font-semibold text-red-500">Out of stock</p>
        )}

        <Link
          to={`/products/${product._id}`}
          className="product-card__cta mt-4"
        >
          View Details
        </Link>
      </div>
    </div>
  );
}
