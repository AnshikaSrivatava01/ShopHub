import { useState, useEffect } from 'react';
import { getWishlist, removeFromWishlist } from '../utils/api';
import { useAuth } from '../context/AuthContext';
import ProductCard from '../components/ProductCard';
import toast, { Toaster } from 'react-hot-toast';

export default function Wishlist() {
  const { user } = useAuth();
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (user) getWishlist().then(res => setItems(res.data)).catch(() => {}).finally(() => setLoading(false));
    else setLoading(false);
  }, [user]);

  const handleToggle = async (productId) => {
    try {
      await removeFromWishlist(productId);
      setItems(prev => prev.filter(p => p._id !== productId));
      toast.success('Removed from wishlist');
    } catch { toast.error('Failed'); }
  };

  if (loading) return <div className="max-w-7xl mx-auto px-4 sm:px-6 py-8"><div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">{[...Array(4)].map((_, i) => <div key={i} className="h-64 skeleton rounded-2xl"></div>)}</div></div>;

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 py-8">
      <Toaster position="top-right" />
      <h1 className="text-3xl font-bold text-surface-900 mb-8">My Wishlist</h1>
      {items.length > 0 ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {items.map(p => <ProductCard key={p._id} product={p} onWishlistToggle={handleToggle} isWishlisted={true} />)}
        </div>
      ) : (
        <div className="text-center py-16">
          <div className="text-6xl mb-4">❤️</div>
          <h3 className="text-xl font-semibold text-surface-800 mb-2">Wishlist is empty</h3>
          <p className="text-surface-700/60">Save products you love for later</p>
        </div>
      )}
    </div>
  );
}
