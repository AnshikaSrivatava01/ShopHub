import { Link } from 'react-router-dom';
import { HiOutlineTrash, HiOutlineShoppingBag, HiOutlineShieldCheck, HiArrowRight } from 'react-icons/hi';
import { useCart } from '../context/CartContext';
import { formatPrice } from '../utils/helpers';

export default function Cart() {
  const { items, updateQuantity, updateRentalDuration, removeItem, clearCart, getItemPrice, cartSubtotal, securityDeposit, totalPrice, totalItems } = useCart();

  if (items.length === 0) {
    return (
      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-24 text-center animate-fade-in-up">
        <div className="w-40 h-40 mx-auto bg-surface-100 rounded-full flex items-center justify-center mb-8 shadow-inner ring-8 ring-surface-50">
          <HiOutlineShoppingBag className="w-20 h-20 text-surface-300" />
        </div>
        <h2 className="text-3xl font-black text-surface-900 mb-3 tracking-tight">Your Cart is Empty</h2>
        <p className="text-surface-700/60 mb-10 text-lg max-w-md mx-auto leading-relaxed">It looks like you haven't added any luxury items to your cart yet. Discover our latest collections.</p>
        <Link to="/products" className="inline-flex items-center gap-3 px-8 py-4 bg-surface-900 text-white rounded-full font-bold text-lg hover:bg-primary-600 hover:shadow-xl hover:shadow-primary-500/30 transform hover:-translate-y-1 transition-all duration-300">
          Start Shopping <HiArrowRight className="w-5 h-5" />
        </Link>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 py-12 animate-fade-in-up">
      <div className="flex items-end justify-between mb-10 border-b border-surface-200 pb-6">
        <div>
          <h1 className="text-4xl font-black text-surface-900 tracking-tight">Shopping Bag</h1>
          <p className="text-surface-700/60 mt-2 font-medium">{totalItems} {totalItems === 1 ? 'Item' : 'Items'} Selected</p>
        </div>
        <button onClick={clearCart} className="text-sm px-4 py-2 text-surface-500 hover:text-red-500 font-bold hover:bg-red-50 rounded-full transition-colors flex items-center gap-2">
          <HiOutlineTrash className="w-4 h-4" /> Clear All
        </button>
      </div>

      <div className="grid lg:grid-cols-3 gap-10">
        {/* Cart Items List */}
        <div className="lg:col-span-2 space-y-6">
          {items.map((item, idx) => (
            <div key={item.key} className="group flex flex-col sm:flex-row gap-6 p-5 rounded-3xl bg-white border border-surface-100 shadow-[0_8px_30px_rgb(0,0,0,0.04)] hover:shadow-[0_8px_30px_rgb(0,0,0,0.08)] transition-all duration-300 relative overflow-hidden">
              {/* Product Image */}
              <Link to={`/products/${item.product._id}`} className="w-full sm:w-36 h-40 sm:h-36 rounded-2xl overflow-hidden flex-shrink-0 bg-surface-50 relative border border-surface-100">
                <img src={item.product.images?.[0] || 'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=400'} alt={item.product.name} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
                <div className={`absolute top-2 left-2 px-2.5 py-1 text-[10px] font-black uppercase tracking-wider rounded-lg backdrop-blur-md ${item.type === 'sale' ? 'bg-white/80 text-surface-900' : 'bg-primary-600/90 text-white'}`}>
                  {item.type === 'sale' ? 'Buy' : 'Rent'}
                </div>
              </Link>
              
              {/* Details & Controls */}
              <div className="flex-1 flex flex-col justify-between min-w-0">
                <div className="flex items-start justify-between gap-4">
                  <div>
                    <Link to={`/products/${item.product._id}`} className="text-lg font-bold text-surface-900 hover:text-primary-600 transition-colors leading-tight line-clamp-2">
                      {item.product.name}
                    </Link>
                    <p className="text-sm text-surface-500 font-medium mt-1">{item.product.category} • {item.product.gender}</p>
                    {item.size && <p className="text-sm text-surface-700 font-semibold mt-1">Size: {item.size}</p>}
                  </div>
                  <button onClick={() => removeItem(item.key)} className="p-2 text-surface-300 hover:text-red-500 hover:bg-red-50 rounded-full transition-colors flex-shrink-0">
                    <HiOutlineTrash className="w-5 h-5" />
                  </button>
                </div>

                <div className="flex flex-wrap items-end justify-between gap-4 mt-4">
                  <div className="flex flex-col gap-3">
                    {/* Rental specific UI */}
                    {item.type === 'rent' && (
                      <div className="flex items-center gap-3">
                        <span className="text-xs font-bold text-surface-400 uppercase tracking-wider">Duration</span>
                        <div className="flex items-center bg-surface-50 rounded-full p-1 border border-surface-200">
                          <button onClick={() => updateRentalDuration(item.key, item.rentalDuration - 1)} className="w-7 h-7 flex items-center justify-center rounded-full hover:bg-white hover:shadow-sm transition-all text-surface-600 font-medium">−</button>
                          <span className="w-8 text-center text-sm font-bold text-surface-900">{item.rentalDuration}</span>
                          <button onClick={() => updateRentalDuration(item.key, item.rentalDuration + 1)} className="w-7 h-7 flex items-center justify-center rounded-full hover:bg-white hover:shadow-sm transition-all text-surface-600 font-medium">+</button>
                        </div>
                        <span className="text-xs font-bold text-surface-600 capitalize">{item.rentalUnit}(s)</span>
                      </div>
                    )}

                    {/* Quantity UI */}
                    <div className="flex items-center gap-3">
                      <span className="text-xs font-bold text-surface-400 uppercase tracking-wider">Qty</span>
                      <div className="flex items-center bg-surface-50 rounded-full p-1 border border-surface-200">
                        <button onClick={() => updateQuantity(item.key, item.quantity - 1)} className="w-7 h-7 flex items-center justify-center rounded-full hover:bg-white hover:shadow-sm transition-all text-surface-600 font-medium">−</button>
                        <span className="w-8 text-center text-sm font-bold text-surface-900">{item.quantity}</span>
                        <button onClick={() => updateQuantity(item.key, item.quantity + 1)} className="w-7 h-7 flex items-center justify-center rounded-full hover:bg-white hover:shadow-sm transition-all text-surface-600 font-medium">+</button>
                      </div>
                    </div>
                  </div>

                  <p className="text-xl font-black text-surface-900">{formatPrice(getItemPrice(item))}</p>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Floating Order Summary */}
        <div className="lg:col-span-1">
          <div className="bg-white/80 backdrop-blur-xl rounded-3xl p-8 shadow-[0_8px_30px_rgb(0,0,0,0.06)] border border-surface-100 sticky top-28">
            <h3 className="text-xl font-black text-surface-900 mb-6">Order Summary</h3>
            
            <div className="space-y-4 text-surface-600 font-medium pb-6 border-b border-surface-100">
              <div className="flex justify-between items-center">
                <span>Subtotal ({totalItems} items)</span> 
                <span className="text-surface-900 font-bold">{formatPrice(cartSubtotal)}</span>
              </div>
              
              {securityDeposit > 0 && (
                <div className="flex justify-between items-start bg-blue-50/50 p-3 rounded-xl border border-blue-100/50">
                  <div className="flex gap-2 text-blue-800">
                    <HiOutlineShieldCheck className="w-5 h-5 flex-shrink-0 mt-0.5" />
                    <div>
                      <p className="font-bold">Security Deposit</p>
                      <p className="text-xs text-blue-600/80 mt-0.5 leading-tight">Fully refundable upon return</p>
                    </div>
                  </div>
                  <span className="font-bold text-blue-900">{formatPrice(securityDeposit)}</span>
                </div>
              )}
              
              <div className="flex justify-between items-center">
                <span>Estimated Shipping</span> 
                <span className="text-emerald-500 font-bold bg-emerald-50 px-2 py-0.5 rounded-md">Free</span>
              </div>
            </div>

            <div className="flex justify-between items-end py-6">
              <div>
                <p className="text-sm font-bold text-surface-500 uppercase tracking-wider mb-1">Total</p>
                <p className="text-xs text-surface-400">Includes all taxes & fees</p>
              </div>
              <span className="text-4xl font-black text-surface-900 tracking-tight">{formatPrice(totalPrice)}</span>
            </div>

            <Link to="/checkout" className="flex items-center justify-center gap-2 w-full py-4 bg-surface-900 text-white rounded-2xl font-bold text-lg hover:bg-primary-600 hover:shadow-xl hover:shadow-primary-500/30 transform hover:-translate-y-0.5 transition-all duration-300">
              Secure Checkout <HiArrowRight className="w-5 h-5" />
            </Link>
            
            <div className="mt-6 flex items-center justify-center gap-2 text-xs font-semibold text-surface-400">
               <HiOutlineShieldCheck className="w-4 h-4" /> Secure, encrypted payments
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
