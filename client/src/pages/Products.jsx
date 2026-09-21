import { useState, useEffect } from 'react';
import { useSearchParams, Link, useNavigate } from 'react-router-dom';
import { HiOutlineAdjustments, HiOutlineX, HiOutlineHome, HiOutlineChevronDown } from 'react-icons/hi';
import { FiShoppingBag, FiCalendar, FiGrid } from 'react-icons/fi';
import { BiCloset } from 'react-icons/bi';
import { GiRunningShoe, GiDiamondRing, GiLipstick } from 'react-icons/gi';
import { MdOutlineBackpack } from 'react-icons/md';
import { getProducts, getCategories } from '../utils/api';
import ProductCard from '../components/ProductCard';

const categoryBanners = {
  Men: {
    title: 'Men\'s Collection',
    subtitle: 'Discover stylish clothing, accessories & footwear for men',
    image: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=1200&h=400&fit=crop',
    gradient: 'from-slate-700/80 to-slate-600/70',
  },
  Women: {
    title: 'Women\'s Collection',
    subtitle: 'Explore trending fashion, beauty & lifestyle essentials for women',
    image: 'https://images.unsplash.com/photo-1483985988355-763728e1935b?w=1200&h=400&fit=crop',
    gradient: 'from-rose-600/80 to-pink-500/70',
  },
  Kids: {
    title: 'Kids\' Collection',
    subtitle: 'Fun, colorful & comfortable fashion for your little ones',
    image: 'https://images.unsplash.com/photo-1503919545889-aef636e10ad4?w=1200&h=400&fit=crop',
    gradient: 'from-sky-500/80 to-cyan-400/70',
  },
  Clothes: {
    title: 'Fashion & Clothing',
    subtitle: 'Explore our curated collection of premium kurtas, sarees, jackets and more',
    image: 'https://images.unsplash.com/photo-1445205170230-053b83016050?w=1200&h=400&fit=crop',
    gradient: 'from-rose-600/80 to-pink-500/70',
  },
  Accessories: {
    title: 'Accessories',
    subtitle: 'Complete your look with stunning jewellery, bags, sunglasses & scarves',
    image: 'https://images.unsplash.com/photo-1611591437281-460bfbe1220a?w=1200&h=400&fit=crop',
    gradient: 'from-amber-600/80 to-orange-500/70',
  },
  Footwear: {
    title: 'Footwear',
    subtitle: 'Step up your style with formal shoes, heels, sneakers & traditional chappals',
    image: 'https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=1200&h=400&fit=crop',
    gradient: 'from-blue-600/80 to-indigo-500/70',
  },
  Beauty: {
    title: 'Beauty',
    subtitle: 'Discover skincare, makeup, and beauty essentials for every occasion',
    image: 'https://images.unsplash.com/photo-1617897903246-719242758050?w=1200&h=400&fit=crop',
    gradient: 'from-fuchsia-600/80 to-pink-500/70',
  },
  Homeliving: {
    title: 'Home & Living',
    subtitle: 'Transform your space with elegant home décor, lighting & furniture',
    image: 'https://images.unsplash.com/photo-1616486338812-3dadae4b4ace?w=1200&h=400&fit=crop',
    gradient: 'from-emerald-600/80 to-teal-500/70',
  },
  Bags: {
    title: 'Bags & Backpacks',
    subtitle: 'Carry your world in style with premium bags, totes, and backpacks',
    image: 'https://images.unsplash.com/photo-1590874103328-eac38a683ce7?w=1200&h=400&fit=crop',
    gradient: 'from-amber-700/80 to-yellow-600/70',
  },
};

const typeBanners = {
  rent: {
    title: 'The Rental Collection',
    subtitle: 'Wear designer labels. Without the designer cost. Rent, wear, return.',
    image: 'https://images.unsplash.com/photo-1490481651871-ab68de25d43d?w=1200&h=400&fit=crop',
    gradient: 'from-violet-900/80 to-fuchsia-800/70',
  },
  sale: {
    title: 'The Buy Collection',
    subtitle: 'Premium fashion essentials and accessories to own forever',
    image: 'https://images.unsplash.com/photo-1445205170230-053b83016050?w=1200&h=400&fit=crop',
    gradient: 'from-emerald-900/80 to-teal-800/70',
  }
};

const browseCategories = [
  { name: 'Fashion', path: '/products?category=Clothes', image: 'https://images.unsplash.com/photo-1445205170230-053b83016050?w=300&h=300&fit=crop', color: 'from-rose-500 to-pink-500' },
  { name: 'Accessories', path: '/products?category=Accessories', image: 'https://images.unsplash.com/photo-1611591437281-460bfbe1220a?w=300&h=300&fit=crop', color: 'from-amber-500 to-orange-500' },
  { name: 'Footwear', path: '/products?category=Footwear', image: 'https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=300&h=300&fit=crop', color: 'from-blue-500 to-indigo-500' },
  { name: 'Beauty', path: '/products?category=Beauty', image: 'https://images.unsplash.com/photo-1617897903246-719242758050?w=300&h=300&fit=crop', color: 'from-fuchsia-500 to-pink-500' },
  { name: 'Homeliving', path: '/products?category=Homeliving', image: 'https://images.unsplash.com/photo-1616486338812-3dadae4b4ace?w=300&h=300&fit=crop', color: 'from-emerald-500 to-teal-500' },
  { name: 'Bags', path: '/products?category=Bags%20%26%20Backpacks', image: 'https://images.unsplash.com/photo-1590874103328-eac38a683ce7?w=300&h=300&fit=crop', color: 'from-amber-600 to-yellow-500' },
];

const footwearFilterOptions = [
  { label: 'All Footwear', category: 'Footwear', gender: '' },
  { label: 'Men\'s Footwear', category: 'Footwear', gender: 'Men' },
  { label: 'Women\'s Footwear', category: 'Footwear', gender: 'Women' },
  { label: 'Kids\' Footwear', category: 'Footwear', gender: 'Kids' },
];

export default function Products() {
  const [searchParams, setSearchParams] = useSearchParams();
  const navigate = useNavigate();
  const [products, setProducts] = useState([]);
  const [categories, setCats] = useState([]);
  const [total, setTotal] = useState(0);
  const [pages, setPages] = useState(1);
  const [loading, setLoading] = useState(true);
  const [showFilters, setShowFilters] = useState(false);

  const currentCategory = searchParams.get('category') || '';
  const currentGender = searchParams.get('gender') || '';
  const currentSearch = searchParams.get('search') || '';
  const currentType = searchParams.get('type') || '';
  const currentSort = searchParams.get('sort') || 'newest';
  const currentMinPrice = searchParams.get('minPrice') || '';
  const currentMaxPrice = searchParams.get('maxPrice') || '';
  const currentRating = searchParams.get('rating') || '';
  const currentPage = parseInt(searchParams.get('page') || '1');

  const categoryBanner = categoryBanners[currentCategory || currentGender] || null;
  const typeBanner = currentType && !currentCategory && !currentGender && !currentSearch ? typeBanners[currentType] : null;
  const banner = categoryBanner || typeBanner;

  useEffect(() => {
    getCategories().then(res => setCats(res.data)).catch(() => {});
  }, []);

  useEffect(() => {
    setLoading(true);
    const params = { page: currentPage, limit: 12, sort: currentSort };
    if (currentCategory) params.category = currentCategory;
    if (currentGender) params.gender = currentGender;
    if (currentSearch) params.search = currentSearch;
    if (currentType) params.type = currentType;
    if (currentMinPrice) params.minPrice = currentMinPrice;
    if (currentMaxPrice) params.maxPrice = currentMaxPrice;
    if (currentRating) params.rating = currentRating;
    
    getProducts(params).then(res => {
      setProducts(res.data.products);
      setTotal(res.data.total);
      setPages(res.data.pages);
    }).catch(() => {}).finally(() => setLoading(false));
  }, [currentCategory, currentGender, currentSearch, currentType, currentSort, currentMinPrice, currentMaxPrice, currentRating, currentPage]);

  const [localFilters, setLocalFilters] = useState({
    category: currentCategory,
    gender: currentGender,
    type: currentType,
    minPrice: currentMinPrice,
    maxPrice: currentMaxPrice,
    rating: currentRating,
  });

  useEffect(() => {
    setLocalFilters({
      category: currentCategory,
      gender: currentGender,
      type: currentType,
      minPrice: currentMinPrice,
      maxPrice: currentMaxPrice,
      rating: currentRating,
    });
  }, [currentCategory, currentGender, currentType, currentMinPrice, currentMaxPrice, currentRating]);

  const updateFilter = (key, value) => {
    const params = new URLSearchParams(searchParams);
    if (value) params.set(key, value); else params.delete(key);
    params.set('page', '1');
    setSearchParams(params);
  };

  const updateLocalFilter = (key, value) => {
    setLocalFilters(prev => ({ ...prev, [key]: value }));
  };

  const applyFilters = () => {
    const params = new URLSearchParams(searchParams);
    if (localFilters.category) params.set('category', localFilters.category); else params.delete('category');
    if (localFilters.gender) params.set('gender', localFilters.gender); else params.delete('gender');
    if (localFilters.type) params.set('type', localFilters.type); else params.delete('type');
    if (localFilters.minPrice) params.set('minPrice', localFilters.minPrice); else params.delete('minPrice');
    if (localFilters.maxPrice) params.set('maxPrice', localFilters.maxPrice); else params.delete('maxPrice');
    if (localFilters.rating) params.set('rating', localFilters.rating); else params.delete('rating');
    params.set('page', '1');
    setSearchParams(params);
    setShowFilters(false);
  };

  const handleTypeChange = (value) => {
    updateLocalFilter('type', value);
  };

  const clearFilters = () => {
    const params = new URLSearchParams(searchParams);
    params.delete('category');
    params.delete('gender');
    params.delete('type');
    params.delete('minPrice');
    params.delete('maxPrice');
    params.delete('rating');
    params.set('page', '1');
    setSearchParams(params);
    setShowFilters(false);
  };

  const isFootwearFilterSelected = (option) => currentCategory === option.category && currentGender === option.gender;

  const applyFootwearFilter = (category, gender) => {
    setLocalFilters((prev) => ({ ...prev, category, gender }));
  };

  const updateFootwearFilter = (category, gender) => {
    const params = new URLSearchParams(searchParams);
    if (category) params.set('category', category); else params.delete('category');
    if (gender) params.set('gender', gender); else params.delete('gender');
    params.set('page', '1');
    setSearchParams(params);
  };

  return (
    <div className="min-h-screen bg-[#f1f3f6] pt-24 pb-8">

      {/* ─── Main Content Wrapper ─── */}
      <div className="max-w-[1700px] w-full mx-auto px-2 sm:px-4 flex flex-col md:flex-row items-start gap-3 sm:gap-4">
        
        {/* ─── Left Sidebar (Desktop) ─── */}
        <div className="hidden md:flex w-[280px] flex-col flex-shrink-0 bg-white shadow-sm rounded-sm border border-gray-200 sticky top-[12vh] max-h-[85vh]">
          <div className="flex items-center justify-between py-3 px-4 border-b border-gray-200 sticky top-0 bg-white z-10 shrink-0">
            <h2 className="text-[18px] font-medium text-black">Filters</h2>
          </div>
          <div className="overflow-y-auto flex-1 pb-4">

          {/* Type Filter */}
          <div className="py-4 border-b border-gray-200 px-4">
            <h3 className="text-[13px] font-medium text-black uppercase tracking-wider mb-3">Type</h3>
            <div className="space-y-3">
              {[
                { label: 'All Types', value: '' },
                { label: 'Buy', value: 'buy' },
                { label: 'Rent', value: 'rent' }
              ].map(t => (
                <label key={t.label} className="flex items-center gap-3 cursor-pointer group">
                  <input 
                    type="checkbox" 
                    checked={localFilters.type === t.value || (!localFilters.type && !t.value)} 
                    onChange={() => handleTypeChange(t.value)}
                    className="w-4 h-4 rounded-sm border-gray-300 text-blue-600 focus:ring-blue-500 cursor-pointer"
                  />
                  <span className={`text-[14px] ${localFilters.type === t.value || (!localFilters.type && !t.value) ? 'text-black' : 'text-gray-700 group-hover:text-black'}`}>
                    {t.label}
                  </span>
                </label>
              ))}
            </div>
          </div>

          {/* Gender Filter */}
          <div className="py-4 border-b border-gray-200 px-4">
            <h3 className="text-[13px] font-medium text-black uppercase tracking-wider mb-2">Gender</h3>
            <div className="text-[14px]">
              <div className="space-y-1 my-1 border-l border-gray-200 ml-[7px]">
                {[
                  { label: 'Men', value: 'Men' },
                  { label: 'Women', value: 'Women' },
                  { label: 'Kids', value: 'Kids' },
                  { label: 'Unisex', value: 'Unisex' }
                ].map(g => (
                  <div 
                    key={g.label}
                    onClick={() => updateLocalFilter('gender', localFilters.gender === g.value ? '' : g.value)}
                    className={`py-1.5 cursor-pointer pl-3 hover:text-blue-600 ${localFilters.gender === g.value ? 'font-medium text-blue-600 relative before:w-[2px] before:h-full before:bg-blue-600 before:absolute before:left-[-1px] before:top-0' : 'text-gray-700'}`}
                  >
                    {g.label}
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Price Filter */}
          <div className="py-4 border-b border-gray-200 px-4">
            <h3 className="text-[13px] font-medium text-black uppercase tracking-wider mb-3">Price</h3>
            <div className="space-y-3">
              {[
                { label: 'Under ₹500', min: '', max: '500' },
                { label: '₹500 - ₹1000', min: '500', max: '1000' },
                { label: '₹1000 - ₹2000', min: '1000', max: '2000' },
                { label: 'Over ₹2000', min: '2000', max: '' }
              ].map(priceConfig => {
                const isSelected = localFilters.minPrice === priceConfig.min && localFilters.maxPrice === priceConfig.max;
                return (
                  <label key={priceConfig.label} className="flex items-center gap-3 cursor-pointer group">
                    <input 
                      type="checkbox" 
                      checked={isSelected}
                      onChange={() => {
                        if (isSelected) {
                          updateLocalFilter('minPrice', '');
                          updateLocalFilter('maxPrice', '');
                        } else {
                          updateLocalFilter('minPrice', priceConfig.min);
                          updateLocalFilter('maxPrice', priceConfig.max);
                        }
                      }}
                      className="w-4 h-4 rounded-sm border-gray-300 text-blue-600 focus:ring-blue-500 cursor-pointer"
                    />
                    <span className={`text-[14px] ${isSelected ? 'text-black font-medium' : 'text-gray-700 group-hover:text-black'}`}>
                      {priceConfig.label}
                    </span>
                  </label>
                )
              })}
            </div>
          </div>

          {/* Customer Ratings Filter */}
          <div className="py-4 border-b border-gray-200 px-4">
            <h3 className="text-[13px] font-medium text-black uppercase tracking-wider mb-3">Customer Ratings</h3>
            <div className="space-y-3">
              {[
                { label: '4★ & above', value: '4' },
                { label: '3★ & above', value: '3' },
                { label: '2★ & above', value: '2' },
              ].map(rating => (
                <label key={rating.value} className="flex items-center gap-3 cursor-pointer group">
                  <input 
                    type="checkbox" 
                    checked={localFilters.rating === rating.value}
                    onChange={() => updateLocalFilter('rating', localFilters.rating === rating.value ? '' : rating.value)}
                    className="w-4 h-4 rounded-sm border-gray-300 text-blue-600 focus:ring-blue-500 cursor-pointer"
                  />
                  <span className={`text-[14px] ${localFilters.rating === rating.value ? 'text-black font-medium' : 'text-gray-700 group-hover:text-black'}`}>
                    {rating.label}
                  </span>
                </label>
              ))}
            </div>
          </div>

          {/* Footwear Filter */}
          <div className="py-4 border-b border-gray-200 px-4">
            <h3 className="text-[13px] font-medium text-black uppercase tracking-wider mb-2">Footwear</h3>
            <div className="text-[14px]">
              <div className="space-y-1 my-1 border-l border-gray-200 ml-[7px]">
                {footwearFilterOptions.map((cat) => (
                  <div 
                    key={cat.label}
                    onClick={() => applyFootwearFilter(cat.category, cat.gender)}
                    className={`py-1.5 cursor-pointer pl-3 hover:text-blue-600 ${localFilters.category === cat.category && localFilters.gender === cat.gender ? 'font-medium text-blue-600 relative before:w-[2px] before:h-full before:bg-blue-600 before:absolute before:left-[-1px] before:top-0' : 'text-gray-700'}`}
                  >
                    {cat.label}
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Categories Filter */}
          <div className="py-4 px-4">
            <h3 className="text-[13px] font-medium text-black uppercase tracking-wider mb-2">Categories</h3>
            <div className="text-[14px]">
              <div className="space-y-1 my-1 ml-[7px]">
                {[
                  { label: 'Clothes', value: 'Clothes' },
                  { label: 'Accessories', value: 'Accessories' },
                  { label: 'Beauty', value: 'Beauty' },
                  { label: 'Home Living', value: 'Homeliving' },
                  { label: 'Bags & Backpacks', value: 'Bags & Backpacks' }
                ].map(cat => (
                  <div 
                    key={cat.label}
                    onClick={() => updateLocalFilter('category', cat.value)}
                    className={`py-1.5 cursor-pointer pl-3 hover:text-blue-600 ${localFilters.category === cat.value ? 'font-medium text-blue-600 relative before:w-[2px] before:h-full before:bg-blue-600 before:absolute before:left-[-1px] before:top-0' : 'text-gray-700'}`}
                  >
                    {cat.label}
                  </div>
                ))}
              </div>
            </div>
          </div>
          </div>
          
          {/* Footer Apply/Clear buttons for Desktop sidebar */}
          <div className="p-4 border-t border-gray-200 bg-white flex gap-3 shrink-0 rounded-b-sm sticky bottom-0">
            <button onClick={clearFilters} className="flex-1 py-2 text-gray-700 font-bold border border-gray-300 rounded-sm bg-white hover:bg-gray-50 transition-colors uppercase text-[13px]">
              Clear
            </button>
            <button onClick={applyFilters} className="flex-1 py-2 text-white font-bold rounded-sm bg-blue-600 hover:bg-blue-700 transition-colors uppercase text-[13px] shadow-sm">
              Apply Filters
            </button>
          </div>
        </div>

        {/* ─── Main Grid Area ─── */}
        <div className="flex-1 bg-white shadow-sm min-h-screen rounded-sm flex flex-col overflow-hidden">
          
          {/* Header & Sort */}
          <div className="px-4 py-3 md:py-4 border-b border-gray-200 bg-white sticky top-[72px] z-20 md:static">
            
            {/* Breadcrumb / Title */}
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-2 md:mb-0">
              <div>
                <div className="text-[12px] text-gray-500 flex items-center gap-1.5 mb-1.5">
                  <Link to="/" className="hover:text-blue-600">Home</Link>
                  <HiOutlineChevronDown className="-rotate-90 w-3 h-3" />
                  {(currentCategory || currentGender) ? (
                    <>
                      <Link to="/products" className="hover:text-blue-600">Products</Link>
                      <HiOutlineChevronDown className="-rotate-90 w-3 h-3" />
                      <span className="text-gray-800">{currentCategory || currentGender}</span>
                    </>
                  ) : (
                    <span className="text-gray-800">Products</span>
                  )}
                </div>
                <h1 className="text-[16px] md:text-[20px] font-medium text-black flex items-center gap-2">
                  {currentSearch ? `Search results for "${currentSearch}"` : (currentCategory || currentGender || 'All Products')}
                  <span className="text-[13px] text-gray-400 font-normal mt-0.5 whitespace-nowrap hidden sm:inline-block">
                    (Showing 1 – {products.length} of {total} products)
                  </span>
                </h1>
              </div>
            </div>
            
            {/* Desktop Sort Options */}
            <div className="hidden md:flex items-center gap-6 mt-4">
              <span className="text-[14px] font-medium text-black">Sort By</span>
              {[
                { label: 'Relevance', value: 'newest' },
                { label: 'Price -- Low to High', value: 'price_asc' },
                { label: 'Price -- High to Low', value: 'price_desc' },
                { label: 'Top Rated', value: 'rating' }
              ].map(sortConfig => {
                const isActive = currentSort === sortConfig.value;
                return (
                  <button 
                    key={sortConfig.value}
                    onClick={() => updateFilter('sort', sortConfig.value)}
                    className={`text-[14px] pb-1 cursor-pointer hover:text-blue-600 transition-colors ${isActive ? 'text-blue-600 font-medium border-b-[3px] border-blue-600' : 'text-gray-700'}`}
                  >
                    {sortConfig.label}
                  </button>
                )
              })}
            </div>

            {/* Mobile Controls (Sort & Filter Buttons) */}
            <div className="flex md:hidden items-center justify-between border-t border-gray-200 mt-3 pt-3">
              <div className="flex-1 text-center py-2 border-r border-gray-200 font-medium text-[14px] text-black">
                <span className="mr-2 hidden sm:inline">Sort By</span>
                <select 
                  value={currentSort} 
                  onChange={e => updateFilter('sort', e.target.value)} 
                  className="bg-transparent border-none text-[13px] font-bold outline-none cursor-pointer"
                >
                  <option value="newest">Relevance</option>
                  <option value="price_asc">Price: Low to High</option>
                  <option value="price_desc">Price: High to Low</option>
                  <option value="rating">Top Rated</option>
                </select>
              </div>
              <button 
                onClick={() => setShowFilters(!showFilters)} 
                className="flex-1 py-2 font-medium text-[14px] text-black flex items-center justify-center gap-2"
              >
                <HiOutlineAdjustments className="w-4 h-4" />
                Filter
              </button>
            </div>
            
            {/* Mobile Filters Expanding Panel */}
            {showFilters && (
              <div className="md:hidden mt-3 border border-gray-200 rounded-sm p-4 bg-gray-50 text-[14px]">
                 <div className="mb-4">
                   <label className="block text-xs font-bold text-gray-500 uppercase tracking-wider mb-2">Gender</label>
                   <select value={currentGender} onChange={e => { updateFilter('gender', e.target.value); setShowFilters(false); }} className="w-full p-2.5 border border-gray-300 rounded-sm bg-white font-medium">
                     <option value="">All Genders</option>
                     <option value="Men">Men</option>
                     <option value="Women">Women</option>
                     <option value="Kids">Kids</option>
                     <option value="Unisex">Unisex</option>
                   </select>
                 </div>
                 
                 <div className="mb-4">
                   <label className="block text-xs font-bold text-gray-500 uppercase tracking-wider mb-2">Footwear</label>
                   <select value={footwearFilterOptions.find(option => isFootwearFilterSelected(option))?.label || ''} onChange={e => { const option = footwearFilterOptions.find(item => item.label === e.target.value); updateFootwearFilter(option?.category || '', option?.gender || ''); setShowFilters(false); }} className="w-full p-2.5 border border-gray-300 rounded-sm bg-white font-medium">
                     <option value="">Select Footwear</option>
                     {footwearFilterOptions.map((option) => (
                       <option key={option.label} value={option.label}>{option.label}</option>
                     ))}
                   </select>
                 </div>

                 <div className="mb-4">
                   <label className="block text-xs font-bold text-gray-500 uppercase tracking-wider mb-2">Category</label>
                   <select value={['Clothes', 'Accessories', 'Beauty', 'Homeliving', 'Bags & Backpacks'].includes(currentCategory) ? currentCategory : ''} onChange={e => { updateFilter('category', e.target.value); setShowFilters(false); }} className="w-full p-2.5 border border-gray-300 rounded-sm bg-white font-medium">
                     <option value="">Select Category</option>
                     <option value="Clothes">Clothes</option>
                     <option value="Accessories">Accessories</option>
                     <option value="Beauty">Beauty</option>
                     <option value="Homeliving">Home Living</option>
                     <option value="Bags & Backpacks">Bags & Backpacks</option>
                   </select>
                 </div>
                 <div>
                   <label className="block text-xs font-bold text-gray-500 uppercase tracking-wider mb-2">Type</label>
                   <select value={currentType} onChange={e => { updateFilter('type', e.target.value); setShowFilters(false); }} className="w-full p-2.5 border border-gray-300 rounded-sm bg-white font-medium">
                     <option value="">All Types</option>
                     <option value="buy">Buy</option>
                     <option value="rent">Rent</option>
                   </select>
                 </div>
                 {/* Mobile Price Filter */}
                 <div className="mb-4">
                   <label className="block text-xs font-bold text-gray-500 uppercase tracking-wider mb-2">Price</label>
                   <select 
                     value={currentMinPrice ? `${currentMinPrice}-${currentMaxPrice}` : currentMaxPrice ? `-${currentMaxPrice}` : ''} 
                     onChange={e => { 
                        const val = e.target.value;
                        const params = new URLSearchParams(searchParams);
                        if (!val) {
                          params.delete('minPrice');
                          params.delete('maxPrice');
                        } else {
                          const [min, max] = val.split('-');
                          if (min) params.set('minPrice', min); else params.delete('minPrice');
                          if (max) params.set('maxPrice', max); else params.delete('maxPrice');
                        }
                        params.set('page', '1');
                        setSearchParams(params);
                        setShowFilters(false); 
                     }} 
                     className="w-full p-2.5 border border-gray-300 rounded-sm bg-white font-medium"
                   >
                     <option value="">Any Price</option>
                     <option value="-500">Under ₹500</option>
                     <option value="500-1000">₹500 - ₹1000</option>
                     <option value="1000-2000">₹1000 - ₹2000</option>
                     <option value="2000-">Over ₹2000</option>
                   </select>
                 </div>

                 {/* Mobile Rating Filter */}
                 <div className="mb-4">
                   <label className="block text-xs font-bold text-gray-500 uppercase tracking-wider mb-2">Customer Rating</label>
                   <select value={currentRating} onChange={e => { updateFilter('rating', e.target.value); setShowFilters(false); }} className="w-full p-2.5 border border-gray-300 rounded-sm bg-white font-medium">
                     <option value="">Any Rating</option>
                     <option value="4">4★ & above</option>
                     <option value="3">3★ & above</option>
                     <option value="2">2★ & above</option>
                   </select>
                 </div>

                 {(currentCategory || currentType || currentMinPrice || currentMaxPrice || currentRating) && (
                   <button onClick={() => { clearFilters(); setShowFilters(false); }} className="w-full mt-4 bg-white border border-gray-300 text-blue-600 font-bold py-2 rounded-sm shadow-sm">
                     CLEAR ALL FILTERS
                   </button>
                 )}
              </div>
            )}
          </div>

          {/* Active Search & Tags */}
          {(currentSearch || currentMinPrice || currentMaxPrice || currentRating) && (
            <div className="px-4 py-3 bg-[#f1f3f6] border-b border-gray-200 flex flex-wrap items-center gap-3">
              <span className="text-[13px] text-gray-600 font-medium">Applied Filters:</span>
              {currentSearch && (
                <span className="inline-flex items-center gap-1.5 px-3 py-1 bg-white border border-gray-300 text-[13px] font-medium rounded-full shadow-sm text-black hover:shadow-md transition-shadow">
                  Search: "{currentSearch}"
                  <button onClick={() => updateFilter('search', '')} className="text-gray-400 hover:text-red-500 transition-colors">
                    <HiOutlineX className="w-4 h-4" />
                  </button>
                </span>
              )}
              {(currentMinPrice || currentMaxPrice) && (
                <span className="inline-flex items-center gap-1.5 px-3 py-1 bg-white border border-gray-300 text-[13px] font-medium rounded-full shadow-sm text-black hover:shadow-md transition-shadow">
                  Price: {currentMinPrice ? `₹${currentMinPrice}` : '0'} - {currentMaxPrice ? `₹${currentMaxPrice}` : 'Any'}
                  <button onClick={() => {
                        const params = new URLSearchParams(searchParams);
                        params.delete('minPrice');
                        params.delete('maxPrice');
                        params.set('page', '1');
                        setSearchParams(params);
                  }} className="text-gray-400 hover:text-red-500 transition-colors">
                    <HiOutlineX className="w-4 h-4" />
                  </button>
                </span>
              )}
              {currentRating && (
                <span className="inline-flex items-center gap-1.5 px-3 py-1 bg-white border border-gray-300 text-[13px] font-medium rounded-full shadow-sm text-black hover:shadow-md transition-shadow">
                  Rating: {currentRating}★ & above
                  <button onClick={() => updateFilter('rating', '')} className="text-gray-400 hover:text-red-500 transition-colors">
                    <HiOutlineX className="w-4 h-4" />
                  </button>
                </span>
              )}
            </div>
          )}

          {/* Product Grid */}
          <div className="p-3 sm:p-5 bg-white flex-1 relative">
            {loading ? (
              <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                {[...Array(8)].map((_, i) => (
                  <div key={i} className="bg-white rounded-xl p-3 border border-gray-100 flex flex-col">
                    <div className="w-full aspect-[4/5] bg-gray-100 animate-pulse mb-4 rounded-lg"></div>
                    <div className="h-3 bg-gray-100 animate-pulse mb-2 w-1/3 rounded"></div>
                    <div className="h-4 bg-gray-100 animate-pulse mb-2 w-3/4 rounded"></div>
                    <div className="h-3 bg-gray-100 animate-pulse mb-3 w-1/2 rounded"></div>
                    <div className="h-5 bg-gray-100 animate-pulse w-1/3 rounded mt-auto"></div>
                  </div>
                ))}
              </div>
            ) : products.length > 0 ? (
              <>
                <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                  {products.map(p => (
                    <ProductCard key={p._id} product={p} />
                  ))}
                </div>
                
                {/* Pagination */}
                {pages > 1 && (
                  <div className="flex items-center justify-between border-t border-gray-200 p-4 mt-4 bg-white">
                    <span className="text-[14px] font-medium text-gray-600 hidden sm:block">Page {currentPage} of {pages}</span>
                    <div className="flex gap-2 mx-auto sm:mx-0">
                      {[...Array(pages)].map((_, i) => (
                        <button 
                          key={i} 
                          onClick={() => { updateFilter('page', String(i + 1)); window.scrollTo(0, 0); }} 
                          className={`w-9 h-9 rounded-full flex items-center justify-center text-[14px] font-bold transition-all ${currentPage === i + 1 ? 'bg-blue-600 text-white shadow-md' : 'hover:bg-gray-100 text-gray-800'}`}
                        >
                          {i + 1}
                        </button>
                      ))}
                    </div>
                  </div>
                )}
              </>
            ) : (
              /* Empty State */
              <div className="flex flex-col items-center justify-center py-20 px-4 text-center bg-white h-full min-h-[400px]">
                 <div className="w-40 sm:w-64 mb-6 opacity-30">
                   <svg viewBox="0 0 24 24" fill="none" className="w-full h-full text-black" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={0.5} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                   </svg>
                 </div>
                 <h3 className="text-[20px] font-medium text-black mb-2">Sorry, no results found!</h3>
                 <p className="text-[#878787] text-[14px] mb-6">Please check the spelling or try searching for something else</p>
                 <button onClick={clearFilters} className="px-10 py-3 rounded-sm shadow-sm bg-blue-600 font-medium text-white text-[14px] transition-all hover:bg-blue-700">Go Back & Clear Filters</button>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
