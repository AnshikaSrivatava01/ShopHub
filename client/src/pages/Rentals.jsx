import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { HiOutlineCursorClick, HiOutlineSparkles, HiOutlineRefresh, HiOutlineCurrencyRupee } from 'react-icons/hi';
import { getProducts } from '../utils/api';
import ProductCard from '../components/ProductCard';

const steps = [
  { num: 1, icon: HiOutlineCursorClick, title: 'Choose', desc: 'Browse our curated collection and pick your designer pieces.' },
  { num: 2, icon: HiOutlineSparkles, title: 'Wear', desc: 'Look stunning at your event. Enjoy your piece for up to 8 days.' },
  { num: 3, icon: HiOutlineRefresh, title: 'Return', desc: 'Pack it up and drop it off. We handle all the dry cleaning.' },
  { num: 4, icon: HiOutlineCurrencyRupee, title: 'Refund', desc: 'Security amount is returned after safe retrieval of the product.' },
];

export default function Rentals() {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    getProducts({ type: 'rent', limit: 24 })
      .then(res => setProducts(res.data.products))
      .catch(() => {})
      .finally(() => setLoading(false));
  }, []);

  return (
    <div className="min-h-screen bg-white text-surface-900 font-sans" style={{ backgroundImage: 'none' }}>

      {/* ─── Hero ─── */}
      <section className="relative w-full h-[50vh] min-h-[400px] flex items-center justify-center overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-b from-black/40 via-black/20 to-black/50 z-10"></div>
        <img
          src="https://images.unsplash.com/photo-1490481651871-ab68de25d43d?w=2000&q=80"
          alt="Luxury Rentals"
          className="absolute inset-0 w-full h-full object-cover object-[center_35%]"
        />
        <div className="relative z-20 text-center px-6 max-w-3xl mx-auto">
          <span className="text-white/80 font-medium tracking-[0.25em] uppercase text-xs">Exclusive Service</span>
          <h1 className="text-3xl sm:text-4xl md:text-5xl font-bold text-white tracking-tight mt-4 mb-5 leading-tight">
            The Rental Vault
          </h1>
          <p className="text-white/80 font-light text-sm md:text-base leading-relaxed max-w-xl mx-auto">
            Access premium designer pieces for a fraction of the retail price. Sustainable, stylish, and smart.
          </p>
        </div>
      </section>

      {/* ─── How It Works ─── */}
      <section className="py-16 md:py-24 bg-gradient-to-b from-white to-surface-50">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12 md:mb-16">
            <h2 className="text-2xl md:text-3xl lg:text-4xl font-bold text-surface-900 tracking-tight mb-4">How it works</h2>
            <p className="text-surface-600 font-light text-base md:text-lg">Four simple steps to your perfect look.</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 md:gap-8">
            {steps.map((step) => {
              const Icon = step.icon;
              return (
                <div
                  key={step.num}
                  className="bg-white rounded-2xl p-8 text-center shadow-sm hover:shadow-xl hover:-translate-y-2 transition-all duration-300 border border-surface-100 group"
                >
                  <div className="w-14 h-14 mx-auto rounded-full bg-surface-100 text-surface-800 flex items-center justify-center mb-5 group-hover:bg-surface-900 group-hover:text-white transition-colors duration-300">
                    <Icon className="w-6 h-6" />
                  </div>
                  <h3 className="text-lg font-bold text-surface-900 mb-3">{step.num}. {step.title}</h3>
                  <p className="text-sm font-light text-surface-600 leading-relaxed">{step.desc}</p>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* ─── Available to Rent ─── */}
      <section className="py-16 md:py-24 bg-white">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12 md:mb-16">
            <h2 className="text-2xl md:text-3xl lg:text-4xl font-bold text-surface-900 tracking-tight mb-4">Available to Rent</h2>
            <p className="text-surface-600 font-light text-base md:text-lg max-w-lg mx-auto">Discover premium styles ready for your next event.</p>
          </div>

          <div>
            {loading ? (
              <div className="flex justify-center py-16">
                <div className="w-10 h-10 border-2 border-surface-200 border-t-surface-900 rounded-full animate-spin"></div>
              </div>
            ) : products.length > 0 ? (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 md:gap-8">
                {products.map(p => (
                  <ProductCard key={p._id} product={p} />
                ))}
              </div>
            ) : (
              <div className="max-w-xl mx-auto bg-surface-50 rounded-2xl p-12 md:p-16 border border-surface-200 text-center">
                <div className="w-16 h-16 mx-auto bg-white rounded-full flex items-center justify-center border border-surface-200 mb-5">
                  <svg className="w-8 h-8 text-surface-300" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M5 3v4M3 5h4M6 17v4m-2-2h4m5-16l2.286 6.857L21 12l-5.714 2.143L13 21l-2.286-6.857L5 12l5.714-2.143L13 3z" />
                  </svg>
                </div>
                <h3 className="text-xl md:text-2xl font-bold text-surface-900 mb-3">The Vault is Empty</h3>
                <p className="text-surface-600 font-light text-base max-w-sm mx-auto">All our premium pieces are currently out or being refreshed. Check back soon!</p>
              </div>
            )}
          </div>
        </div>
      </section>
    </div>
  );
}
