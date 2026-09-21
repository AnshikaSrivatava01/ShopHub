import { Link } from 'react-router-dom';
import { HiOutlineMail, HiOutlinePhone } from 'react-icons/hi';

export default function Footer() {
  return (
    <footer className="bg-surface-900 text-surface-200 mt-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          {/* Brand */}
          <div className="md:col-span-1">
            <div className="flex items-center gap-2 mb-4">
              <div className="w-9 h-9 bg-gradient-to-br from-primary-400 to-primary-600 rounded-xl flex items-center justify-center text-white font-bold text-lg">S</div>
              <span className="text-xl font-bold text-white">ShopHub</span>
            </div>
            <p className="text-surface-200/60 text-sm leading-relaxed">India&apos;s premier platform for buying &amp; renting premium clothes, accessories and footwear.</p>
          </div>

          {/* Quick Links */}
          <div>
            <h3 className="text-white font-semibold mb-4">Quick Links</h3>
            <div className="flex flex-col gap-2">
              <Link to="/products" className="text-sm text-surface-200/60 hover:text-primary-400 transition-colors">All Products</Link>
              <Link to="/products?type=sale" className="text-sm text-surface-200/60 hover:text-primary-400 transition-colors">Buy Products</Link>
              <Link to="/rentals" className="text-sm text-surface-200/60 hover:text-primary-400 transition-colors">Rent Products</Link>
              <Link to="/orders" className="text-sm text-surface-200/60 hover:text-primary-400 transition-colors">Track Orders</Link>
            </div>
          </div>

          {/* Categories */}
          <div>
            <h3 className="text-white font-semibold mb-4">Categories</h3>
            <div className="flex flex-col gap-2">
              {['Clothes', 'Accessories', 'Footwear', 'Bags'].map(cat => (
                <Link key={cat} to={`/products?category=${cat}`} className="text-sm text-surface-200/60 hover:text-primary-400 transition-colors">{cat}</Link>
              ))}
            </div>
          </div>

          {/* Contact */}
          <div>
            <h3 className="text-white font-semibold mb-4">Contact Us</h3>
            <div className="flex flex-col gap-3">
              <a href="mailto:support@shophub.in" className="flex items-center gap-2 text-sm text-surface-200/60 hover:text-primary-400 transition-colors">
                <HiOutlineMail className="w-4 h-4" /> support@shophub.in
              </a>
              <a href="tel:+917079690128" className="flex items-center gap-2 text-sm text-surface-200/60 hover:text-primary-400 transition-colors">
                <HiOutlinePhone className="w-4 h-4" /> +91 70796 90128
              </a>
              <p className="text-sm text-surface-200/60 mt-2">Ranchi, Jharkhand 834001<br/>India</p>
            </div>
          </div>
        </div>

        <div className="border-t border-surface-200/10 mt-10 pt-6 flex flex-col sm:flex-row items-center justify-between gap-4">
          <p className="text-sm text-surface-200/40">© 2026 ShopHub. All rights reserved. Prices in ₹ (INR)</p>
          <div className="flex items-center gap-4">
            <span className="text-xs px-3 py-1 rounded-full bg-surface-800 text-surface-200/50">Visa</span>
            <span className="text-xs px-3 py-1 rounded-full bg-surface-800 text-surface-200/50">Mastercard</span>
            <span className="text-xs px-3 py-1 rounded-full bg-surface-800 text-surface-200/50">UPI</span>
            <span className="text-xs px-3 py-1 rounded-full bg-surface-800 text-surface-200/50">Stripe</span>
          </div>
        </div>
      </div>
    </footer>
  );
}
