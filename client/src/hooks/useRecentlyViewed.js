import { useState, useEffect } from 'react';
import { getProductById } from '../utils/api';

const STORAGE_KEY = 'shophub_recently_viewed';
const MAX_ITEMS = 10;
const hasUsablePrice = (item) => [item?.salePrice, item?.price, item?.rentPricePerDay].some((value) => Number(value) > 0);
const normalizeRecentlyViewedProduct = (product) => ({
  _id: product._id,
  name: product.name,
  images: product.images,
  image: product.image,
  salePrice: product.salePrice,
  price: product.price,
  rentPricePerDay: product.rentPricePerDay,
  type: product.type,
  isAvailableForSale: product.isAvailableForSale,
  isAvailableForRent: product.isAvailableForRent,
  category: product.category,
  avgRating: product.avgRating,
});

export function useRecentlyViewed() {
  const [recentlyViewed, setRecentlyViewed] = useState([]);

  useEffect(() => {
    const hydrateStoredRecentlyViewed = async () => {
      const stored = JSON.parse(localStorage.getItem(STORAGE_KEY) || '[]');

      const hydrated = await Promise.all(stored.map(async (item) => {
        if (hasUsablePrice(item)) {
          return item;
        }

        try {
          const res = await getProductById(item._id);
          return normalizeRecentlyViewedProduct(res.data);
        } catch {
          return item;
        }
      }));

      localStorage.setItem(STORAGE_KEY, JSON.stringify(hydrated));
      setRecentlyViewed(hydrated);
    };

    hydrateStoredRecentlyViewed();
  }, []);

  const addToRecentlyViewed = (product) => {
    const stored = JSON.parse(localStorage.getItem(STORAGE_KEY) || '[]');
    // Remove if already exists
    const filtered = stored.filter(p => p._id !== product._id);
    // Add to front
    const updated = [
      normalizeRecentlyViewedProduct(product),
      ...filtered,
    ].slice(0, MAX_ITEMS);
    localStorage.setItem(STORAGE_KEY, JSON.stringify(updated));
    setRecentlyViewed(updated);
  };

  return { recentlyViewed, addToRecentlyViewed };
}
