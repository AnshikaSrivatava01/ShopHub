import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { HiOutlineArrowRight, HiOutlineShoppingBag, HiOutlineClock, HiOutlineShieldCheck, HiOutlineTruck } from 'react-icons/hi';
import { getProducts } from '../utils/api';
import ProductCard from '../components/ProductCard';

export default function Home() {
  const [featured, setFeatured] = useState([]);
  const [currentSlide, setCurrentSlide] = useState(0);

  const heroSlides = [
    { image: 'https://images.unsplash.com/photo-1469334031218-e382a71b716b?q=80&w=2070', label: 'The Summer Collection' },
    { image: 'https://images.unsplash.com/photo-1483985988355-763728e1935b?q=80&w=2070', label: 'Trending Fashion' },
    { image: 'https://images.unsplash.com/photo-1445205170230-053b83016050?q=80&w=2070', label: 'Exclusive Styles' },
    { image: 'https://images.unsplash.com/photo-1490481651871-ab68de25d43d?q=80&w=2070', label: 'New Arrivals' },
    { image: 'https://images.unsplash.com/photo-1558618666-fcd25c85f82e?q=80&w=2070', label: 'Street Style Edit' },
    { image: 'https://images.unsplash.com/photo-1515886657613-9f3515b0c78f?q=80&w=2070', label: 'Designer Picks' },
    { image: 'https://images.unsplash.com/photo-1509631179647-0177331693ae?q=80&w=2070', label: 'Runway Ready' },
  ];

  useEffect(() => {
    getProducts({ limit: 8, sort: 'rating' }).then(res => setFeatured(res.data.products)).catch(() => { });
  }, []);

  const bottomImages = [
    'https://images.unsplash.com/photo-1490481651871-ab68de25d43d?q=80&w=2070',
    'https://images.unsplash.com/photo-1509631179647-0177331693ae?q=80&w=2070',
    'https://images.unsplash.com/photo-1515886657613-9f3515b0c78f?q=80&w=2070',
    'https://images.unsplash.com/photo-1558618666-fcd25c85f82e?q=80&w=2070',
    'https://images.unsplash.com/photo-1469334031218-e382a71b716b?q=80&w=2070',
  ];
  const [bottomSlide, setBottomSlide] = useState(0);

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentSlide(prev => (prev + 1) % heroSlides.length);
    }, 3000);
    return () => clearInterval(timer);
  }, []);

  useEffect(() => {
    const timer = setInterval(() => {
      setBottomSlide(prev => (prev + 1) % bottomImages.length);
    }, 4000);
    return () => clearInterval(timer);
  }, []);

  const features = [
    { icon: <HiOutlineShoppingBag className="w-5 h-5 md:w-6 md:h-6" />, title: 'Buy or Rent', desc: 'Flexible shopping options' },
    { icon: <HiOutlineClock className="w-5 h-5 md:w-6 md:h-6" />, title: 'Flexible Rentals', desc: 'Daily, weekly, or monthly' },
    { icon: <HiOutlineShieldCheck className="w-5 h-5 md:w-6 md:h-6" />, title: 'Secure Payments', desc: '100% safe transactions' },
    { icon: <HiOutlineTruck className="w-5 h-5 md:w-6 md:h-6" />, title: 'Lightning Delivery', desc: 'Fast country-wide shipping' },
  ];

  return (
    <div className="w-full bg-white text-surface-900 pb-20">

      {/* 1. Auto-Rotating Hero Carousel */}
      <section className="relative w-full h-[85vh] min-h-[600px] xl:h-[90vh] flex items-center justify-center overflow-hidden">
        {/* Carousel Background Images */}
        {heroSlides.map((slide, idx) => (
          <div key={idx} className={`absolute inset-0 transition-opacity duration-1000 ease-in-out ${idx === currentSlide ? 'opacity-100' : 'opacity-0'}`}>
            <img 
              src={slide.image} 
              alt={slide.label} 
              className="w-full h-full object-cover object-[center_20%]"
            />
          </div>
        ))}
        {/* Overlay gradients */}
        <div className="absolute inset-0 bg-black/25"></div>
        <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-black/30"></div>

        {/* Hero Content */}
        <div className="relative z-10 text-center px-6 w-full max-w-5xl mx-auto flex flex-col items-center -mt-4 animate-fade-in-up">
          <span key={currentSlide} className="text-white/80 text-xs md:text-sm font-bold tracking-[0.3em] uppercase mb-6 md:mb-8 drop-shadow-md transition-all duration-500">
            {heroSlides[currentSlide].label}
          </span>
          <h1 className="text-5xl sm:text-6xl md:text-8xl lg:text-[10rem] font-black text-white leading-[0.85] mb-28 md:mb-32 tracking-tighter drop-shadow-2xl">
            Elevate<br/>Your Style.
          </h1>

          <div className="flex flex-col sm:flex-row items-center justify-center gap-4 sm:gap-5 w-full sm:w-auto mt-24">
            <Link to="/products" className="w-full sm:w-auto px-10 py-4 border-2 border-white/70 bg-transparent text-white/90 rounded-none font-bold text-sm tracking-widest uppercase backdrop-blur-sm hover:bg-white hover:text-surface-900 hover:border-white transition-all duration-300 hover:-translate-y-1 shadow-lg">
              Shop Collection
            </Link>
            <Link to="/rentals" className="w-full sm:w-auto px-10 py-4 border-2 border-white/40 bg-white/10 text-white/80 rounded-none font-bold text-sm tracking-widest uppercase backdrop-blur-sm hover:bg-white hover:text-surface-900 hover:border-white transition-all duration-300 hover:-translate-y-1 shadow-lg">
              Rent The Runway
            </Link>
          </div>
        </div>

        {/* Slide Indicators */}
        <div className="absolute bottom-8 left-1/2 -translate-x-1/2 z-20 flex items-center gap-2.5">
          {heroSlides.map((_, idx) => (
            <button
              key={idx}
              onClick={() => setCurrentSlide(idx)}
              className={`rounded-full transition-all duration-300 ${idx === currentSlide ? 'w-8 h-2.5 bg-white' : 'w-2.5 h-2.5 bg-white/40 hover:bg-white/60'}`}
              aria-label={`Go to slide ${idx + 1}`}
            />
          ))}
        </div>
      </section>

      {/* 2. Minimalist Feature Strip */}
      <section className="w-full bg-surface-50 py-10 md:py-16 border-b border-surface-200">
        <div className="flex flex-col items-center justify-center text-center w-full px-4">
          <div className="flex flex-wrap items-center justify-center gap-8 md:gap-12 lg:gap-16 w-full max-w-6xl">
            {features.map((f, i) => (
              <div key={i} className="w-40 md:w-48">
                <div className={`flex flex-col items-center text-center p-4 animate-fade-in-up animate-delay-${i}00`}>
                  <div className="mb-4 text-surface-900">
                    {f.icon}
                  </div>
                  <h4 className="font-bold text-surface-900 text-sm tracking-widest uppercase mb-2">{f.title}</h4>
                  <p className="text-sm text-surface-500 font-medium max-w-[200px] leading-relaxed">{f.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* 3. New Arrivals */}
      {featured.length > 0 && (
        <section className="new-arrivals">
          <div className="new-arrivals__container">
            {/* Header Row */}
            <div className="new-arrivals__header">
              <div>
                <h2 className="new-arrivals__title">New Arrivals</h2>
                <p className="new-arrivals__subtitle">Explore top picks from our latest fashion &amp; accessories collection</p>
              </div>
              <Link to="/products" className="new-arrivals__view-all">
                View All <HiOutlineArrowRight className="w-4 h-4" />
              </Link>
            </div>

            {/* Product Grid */}
            <div className="new-arrivals__grid">
              {featured.map(product => (
                <ProductCard key={product._id} product={product} />
              ))}
            </div>

            {/* Mobile View All */}
            <div className="new-arrivals__mobile-cta">
              <Link to="/products" className="new-arrivals__view-all">
                View All Products <HiOutlineArrowRight className="w-4 h-4" />
              </Link>
            </div>
          </div>
        </section>
      )}

      {/* 4. Editorial Lookbook CTA */}
      <section className="w-full bg-surface-950 text-white overflow-hidden">
        <div className="flex flex-col lg:flex-row w-full min-h-[70vh]">
          {/* Left Text Content */}
          <div className="w-full lg:w-1/2 p-12 md:p-20 lg:p-32 flex flex-col justify-center relative z-10">
            <span className="text-white/60 text-xs font-bold tracking-[0.4em] uppercase mb-8 border-l-2 border-primary-500 pl-4">
              Unlock Your Wardrobe
            </span>
            <h2 className="text-5xl md:text-6xl lg:text-7xl font-black text-white mb-8 tracking-tighter leading-[1.1]">
              Wear Designer Labels.<br className="hidden md:block"/>Without the<br className="hidden md:block"/>Designer Cost.
            </h2>
            <p className="text-lg md:text-xl text-white/70 mb-14 font-medium max-w-lg leading-relaxed">
              Whether you need a statement piece for a weekend event or want to upgrade your everyday style—renting the runway has never been easier.
            </p>
            <div className="flex flex-col sm:flex-row gap-6">
              <Link to="/rentals" className="inline-flex items-center justify-center px-10 py-5 bg-white text-surface-900 font-bold text-sm tracking-widest uppercase hover:bg-surface-200 transition-colors shadow-2xl">
                Shop Rentals <HiOutlineArrowRight className="ml-3 w-5 h-5" />
              </Link>
              <Link to="/register" className="inline-flex items-center justify-center px-10 py-5 border border-white/30 text-white font-bold text-sm tracking-widest uppercase hover:bg-white/10 transition-colors">
                Create Account
              </Link>
            </div>
          </div>
          
          {/* Right Image Content - Auto Rotating */}
          <div className="w-full lg:w-1/2 relative min-h-[50vh] lg:min-h-full">
            {bottomImages.map((img, idx) => (
              <img 
                key={idx}
                src={img} 
                alt={`Lookbook ${idx + 1}`} 
                className={`absolute inset-0 w-full h-full object-cover transition-opacity duration-1000 ease-in-out ${idx === bottomSlide ? 'opacity-100' : 'opacity-0'}`}
              />
            ))}
            {/* Inner gradient shadow for blending */}
            <div className="absolute inset-y-0 left-0 w-32 bg-gradient-to-r from-surface-950 to-transparent hidden lg:block"></div>
            <div className="absolute inset-x-0 top-0 h-32 bg-gradient-to-b from-surface-950 to-transparent lg:hidden"></div>
          </div>
        </div>
      </section>

    </div>
  );
}
