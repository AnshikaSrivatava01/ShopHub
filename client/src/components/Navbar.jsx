import { useState, useEffect } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { HiOutlineShoppingCart, HiOutlineUser, HiOutlineSearch, HiMenuAlt3, HiX, HiOutlineHeart, HiOutlineViewGrid } from 'react-icons/hi';
import { useAuth } from '../context/AuthContext';
import { useCart } from '../context/CartContext';

export default function Navbar() {
  const { user, logout, isAdmin } = useAuth();
  const { totalItems } = useCart();
  const [menuOpen, setMenuOpen] = useState(false);
  const [search, setSearch] = useState('');
  const [userMenu, setUserMenu] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  useEffect(() => {
    setMenuOpen(false);
    setUserMenu(false);
  }, [location.pathname]);

  const handleSearch = (e) => {
    e.preventDefault();
    if (search.trim()) {
      navigate(`/products?search=${encodeURIComponent(search.trim())}`);
      setSearch('');
    }
  };

  const navLinks = [
    { name: 'Men', path: '/products?gender=Men' },
    { name: 'Women', path: '/products?gender=Women' },
    { name: 'Kids', path: '/products?gender=Kids' },
    { name: 'Rentals', path: '/rentals' },
  ];

  const targetCategories = [
    { name: 'Fashion', path: '/products?category=Clothes', image: 'https://images.unsplash.com/photo-1445205170230-053b83016050?w=150&h=150&fit=crop' },
    { name: 'Beauty', path: '/products?category=Beauty', image: 'https://images.unsplash.com/photo-1617897903246-719242758050?w=150&h=150&fit=crop' },
    { name: 'Footwear', path: '/products?category=Footwear', image: 'https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=150&h=150&fit=crop' },
    { name: 'Homeliving', path: '/products?category=Homeliving', image: 'https://images.unsplash.com/photo-1616486338812-3dadae4b4ace?w=150&h=150&fit=crop' },
    { name: 'Accessories', path: '/products?category=Accessories', image: 'https://images.unsplash.com/photo-1611591437281-460bfbe1220a?w=150&h=150&fit=crop' },
    { name: 'Bags', path: '/products?category=Bags', image: 'https://images.unsplash.com/photo-1590874103328-eac38a683ce7?w=150&h=150&fit=crop' },
  ];

  return (
    <nav className={`fixed top-0 inset-x-0 z-50 transition-all duration-300 w-full border-b ${scrolled ? 'bg-white/95 backdrop-blur-md border-surface-200 shadow-sm py-3' : 'bg-white/50 backdrop-blur-md border-transparent py-5'}`}>
      <div className="w-full px-4 sm:px-6 lg:px-12 xl:px-20">
        <div className="flex items-center justify-between gap-6 md:gap-8">
          
          {/* Left Side: Logo & Categories */}
          <div className="flex items-center gap-8 lg:gap-10">
            {/* Logo */}
            <Link to="/" className="flex items-center gap-2.5 group shrink-0">
              <div className={`w-9 h-9 rounded-xl flex items-center justify-center text-white font-black text-sm transition-colors ${scrolled ? 'bg-primary-600 shadow-md shadow-primary-500/20' : 'bg-surface-900 group-hover:bg-primary-600'}`}>
                S
              </div>
              <span className="text-xl sm:text-2xl font-black tracking-tight text-surface-900 group-hover:text-primary-600 transition-colors">
                ShopHub
              </span>
            </Link>

            {/* Desktop Navigation Links */}
            <div className="hidden lg:flex items-center gap-6 xl:gap-8">
              {navLinks.map((link) => (
                <Link 
                  key={link.name} 
                  to={link.path} 
                  className="text-sm font-semibold text-surface-500 hover:text-surface-900 transition-colors whitespace-nowrap"
                >
                  {link.name}
                </Link>
              ))}
              <div className="relative group">
                <Link to="/products" className="text-sm font-semibold text-surface-500 hover:text-surface-900 transition-colors whitespace-nowrap flex items-center gap-1 py-4">
                  All Products
                  <svg className="w-4 h-4 text-surface-400 group-hover:text-surface-900 transition-colors" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                  </svg>
                </Link>
                <div className="absolute top-[80%] -left-[16rem] xl:-left-[8rem] mt-2 w-max bg-white rounded-[2rem] shadow-[0_30px_60px_-15px_rgba(0,0,0,0.15)] border border-surface-100 p-8 opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-300 z-50 group-hover:translate-y-0 translate-y-3 origin-top">
                  <div className="flex items-center justify-between gap-6 lg:gap-10">
                    {targetCategories.map((item, idx) => (
                      <Link key={item.name} to={item.path} className="group/item flex flex-col items-center gap-4 w-24">
                        <div className="w-24 h-24 rounded-3xl overflow-hidden bg-surface-50 group-hover/item:shadow-xl shadow-surface-900/10 transition-all duration-300 group-hover/item:-translate-y-2 ring-1 ring-surface-100">
                          <img src={item.image} alt={item.name} className="w-full h-full object-cover group-hover/item:scale-110 transition-transform duration-500" />
                        </div>
                        <span className={`text-base font-bold ${idx === 0 ? 'text-rose-500' : 'text-surface-800'} group-hover/item:text-primary-600 transition-colors`}>
                          {item.name}
                        </span>
                      </Link>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Right Side: Search, Wishlist, Cart & Auth */}
          <div className="flex items-center gap-2 sm:gap-3">
            
            {/* Search Bar */}
            <form onSubmit={handleSearch} className="hidden md:flex relative w-44 lg:w-56 xl:w-64">
              <input
                type="text" 
                value={search} 
                onChange={(e) => setSearch(e.target.value)}
                placeholder="Search products..."
                className="w-full pl-4 pr-10 py-2 bg-surface-50 rounded-full border border-surface-200 focus:bg-white focus:outline-none focus:ring-2 focus:ring-primary-500/30 focus:border-primary-400 text-sm font-medium transition-all"
              />
              <button type="submit" className="absolute inset-y-0 right-0 pr-3.5 flex items-center text-surface-400 hover:text-primary-500 transition-colors">
                <HiOutlineSearch className="w-[18px] h-[18px]" />
              </button>
            </form>

            {/* Icon Actions */}
            <div className="flex items-center gap-0.5">
              <Link to="/wishlist" className="hidden sm:flex p-2 rounded-full hover:bg-surface-100 text-surface-500 hover:text-red-500 transition-colors" aria-label="Wishlist">
                <HiOutlineHeart className="w-5 h-5" />
              </Link>
              
              <Link to="/cart" className="flex p-2 rounded-full hover:bg-surface-100 text-surface-500 hover:text-primary-600 transition-colors relative" aria-label="Cart">
                <HiOutlineShoppingCart className="w-5 h-5" />
                {totalItems > 0 && (
                  <span className="absolute -top-0.5 -right-0.5 w-4.5 h-4.5 bg-primary-600 text-white text-[10px] font-bold rounded-full flex items-center justify-center shadow-sm ring-2 ring-white">
                    {totalItems}
                  </span>
                )}
              </Link>
            </div>

            {/* Divider */}
            <div className="hidden sm:block w-px h-6 bg-surface-200 mx-1" />

            {/* User Area / Auth */}
            {user ? (
              <div className="flex items-center gap-1">
                {isAdmin && (
                  <Link
                    to="/admin"
                    className="hidden sm:inline-flex items-center gap-2 px-3 py-2 rounded-full bg-primary-50 text-primary-700 hover:bg-primary-100 transition-colors text-xs font-bold tracking-wide uppercase"
                    aria-label="Admin Panel"
                  >
                    <HiOutlineViewGrid className="w-4 h-4" />
                    Admin
                  </Link>
                )}
                <Link to={isAdmin ? '/admin' : '/account'} className="flex p-2 rounded-full hover:bg-surface-100 text-surface-500 hover:text-primary-600 transition-colors" aria-label={isAdmin ? 'Admin Panel' : 'My Account'}>
                  {isAdmin ? <HiOutlineViewGrid className="w-5 h-5" /> : <HiOutlineUser className="w-5 h-5" />}
                </Link>
              </div>
            ) : (
              <Link to="/login" className="flex p-2 rounded-full hover:bg-surface-100 text-surface-500 hover:text-primary-600 transition-colors" aria-label="Login">
                <HiOutlineUser className="w-5 h-5" />
              </Link>
            )}

            {/* Mobile Menu Toggle */}
            <button onClick={() => setMenuOpen(!menuOpen)} className="lg:hidden ml-0.5 p-2 rounded-xl text-surface-600 hover:bg-surface-100 transition-colors">
              {menuOpen ? <HiX className="w-6 h-6" /> : <HiMenuAlt3 className="w-6 h-6" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Menu */}
      {menuOpen && (
        <div className="lg:hidden absolute top-full left-0 right-0 bg-white border-b border-surface-200 shadow-xl overflow-y-auto max-h-[80vh]">
          <div className="p-4 flex flex-col gap-2">
            {/* Mobile Search */}
            <form onSubmit={handleSearch} className="md:hidden mb-2">
              <div className="relative">
                <input 
                  type="text" 
                  value={search} 
                  onChange={(e) => setSearch(e.target.value)} 
                  placeholder="Search products..." 
                  className="w-full pl-4 pr-11 py-3 rounded-xl border border-surface-200 bg-surface-50 focus:outline-none focus:ring-2 focus:ring-primary-500 font-medium text-base" 
                />
                <button type="submit" className="absolute inset-y-0 right-0 pr-4 flex items-center text-surface-400 hover:text-primary-500">
                  <HiOutlineSearch className="w-5 h-5" />
                </button>
              </div>
            </form>
            
            {/* Mobile Wishlist Link */}
            <Link to="/wishlist" className="sm:hidden flex items-center gap-3 px-4 py-3 rounded-xl text-base font-bold text-surface-800 hover:bg-surface-50 transition-colors">
              <HiOutlineHeart className="w-5 h-5 text-red-400" /> Wishlist
            </Link>

            {/* Category Links */}
            <div className="space-y-1 border-t border-surface-100 pt-3 mt-1">
              <p className="text-xs font-bold uppercase tracking-wider text-surface-400 px-4 mb-2">All Products</p>
              {targetCategories.map(link => (
                <Link key={link.name} to={link.path} className="flex items-center gap-3 px-4 py-3 rounded-xl text-base font-bold text-surface-800 hover:bg-surface-50 transition-colors">
                  <img src={link.image} alt={link.name} className="w-10 h-10 object-cover rounded-lg border border-surface-200 shadow-sm" />
                  {link.name}
                </Link>
              ))}
              <div className="border-t border-surface-100 my-2"></div>
              <Link to="/products" className="px-4 py-3 rounded-xl text-base font-bold text-primary-600 hover:bg-surface-50 transition-colors block">
                View All Products &rarr;
              </Link>
            </div>
            
            {/* Mobile Auth Buttons */}
            {!user && (
              <div className="grid grid-cols-2 gap-3 mt-4 pt-3 border-t border-surface-100 px-1">
                <Link to="/login" className="px-4 py-3 bg-surface-100 text-surface-900 rounded-xl text-center font-bold hover:bg-surface-200 transition-colors">Log In</Link>
                <Link to="/register" className="px-4 py-3 bg-surface-900 text-white rounded-xl text-center font-bold hover:bg-primary-600 transition-colors">Sign Up</Link>
              </div>
            )}

            {/* Mobile Admin Link */}
            {user && isAdmin && (
              <div className="mt-3 pt-3 border-t border-surface-100 px-1">
                <Link to="/admin" className="flex items-center gap-3 px-4 py-3 rounded-xl text-base font-bold text-primary-700 bg-primary-50 hover:bg-primary-100 transition-colors">
                  <HiOutlineViewGrid className="w-5 h-5" />
                  Open Admin Panel
                </Link>
              </div>
            )}
          </div>
        </div>
      )}
    </nav>
  );
}
