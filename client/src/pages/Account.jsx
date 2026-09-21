import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { HiOutlineUser, HiOutlineClipboardList, HiOutlineHeart, HiOutlineShoppingCart, HiOutlineLocationMarker, HiOutlineCog, HiOutlineLogout, HiOutlineViewGrid, HiOutlineChevronRight } from 'react-icons/hi';

export default function Account() {
  const { user, logout, isAdmin } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  const accountLinks = [
    {
      label: 'My Account',
      items: [
        { name: 'My Profile', desc: 'View and edit your personal details', icon: <HiOutlineUser className="w-5 h-5" />, path: '/profile', color: 'text-primary-600 bg-primary-50' },
        { name: 'Manage Addresses', desc: 'Add or update your delivery addresses', icon: <HiOutlineLocationMarker className="w-5 h-5" />, path: '/profile', color: 'text-amber-600 bg-amber-50' },
        { name: 'Account Settings', desc: 'Change password and preferences', icon: <HiOutlineCog className="w-5 h-5" />, path: '/profile', color: 'text-surface-600 bg-surface-100' },
      ],
    },
    {
      label: 'My Shopping',
      items: [
        { name: 'My Orders', desc: 'Track and manage your orders', icon: <HiOutlineClipboardList className="w-5 h-5" />, path: '/orders', color: 'text-blue-600 bg-blue-50' },
        { name: 'My Wishlist', desc: 'Items you saved for later', icon: <HiOutlineHeart className="w-5 h-5" />, path: '/wishlist', color: 'text-red-500 bg-red-50' },
        { name: 'My Cart', desc: 'Review your cart items', icon: <HiOutlineShoppingCart className="w-5 h-5" />, path: '/cart', color: 'text-emerald-600 bg-emerald-50' },
      ],
    },
  ];

  return (
    <div className="min-h-[80vh] bg-surface-50/50">
      {/* Header */}
      <div className="bg-gradient-to-r from-surface-900 to-surface-700 text-white">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 py-10 sm:py-14">
          <div className="flex items-center gap-5">
            <div className="w-16 h-16 sm:w-20 sm:h-20 flex items-center justify-center rounded-2xl bg-white/10 backdrop-blur-sm text-white text-2xl sm:text-3xl font-black border border-white/20 shadow-lg">
              {user?.name?.charAt(0).toUpperCase()}
            </div>
            <div>
              <h1 className="text-2xl sm:text-3xl font-black">{user?.name}</h1>
              <p className="text-white/60 text-sm sm:text-base mt-1">{user?.email}</p>
            </div>
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="max-w-4xl mx-auto px-4 sm:px-6 py-8 sm:py-10">
        {/* Sections */}
        {accountLinks.map((section) => (
          <div key={section.label} className="mb-8">
            <h2 className="text-xs font-bold uppercase tracking-widest text-surface-400 mb-4 px-1">{section.label}</h2>
            <div className="bg-white rounded-2xl shadow-md shadow-surface-900/5 border border-surface-100 overflow-hidden divide-y divide-surface-100">
              {section.items.map((item) => (
                <Link
                  key={item.name}
                  to={item.path}
                  className="flex items-center gap-4 px-5 py-4 hover:bg-surface-50 transition-colors group"
                >
                  <div className={`w-10 h-10 rounded-xl flex items-center justify-center ${item.color} transition-colors`}>
                    {item.icon}
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-bold text-surface-900 group-hover:text-primary-600 transition-colors">{item.name}</p>
                    <p className="text-xs text-surface-500 mt-0.5">{item.desc}</p>
                  </div>
                  <HiOutlineChevronRight className="w-4 h-4 text-surface-300 group-hover:text-primary-500 group-hover:translate-x-0.5 transition-all" />
                </Link>
              ))}
            </div>
          </div>
        ))}

        {/* Admin */}
        {isAdmin && (
          <div className="mb-8">
            <h2 className="text-xs font-bold uppercase tracking-widest text-surface-400 mb-4 px-1">Admin</h2>
            <div className="bg-white rounded-2xl shadow-md shadow-surface-900/5 border border-surface-100 overflow-hidden">
              <Link to="/admin" className="flex items-center gap-4 px-5 py-4 hover:bg-primary-50 transition-colors group">
                <div className="w-10 h-10 rounded-xl flex items-center justify-center text-primary-600 bg-primary-50">
                  <HiOutlineViewGrid className="w-5 h-5" />
                </div>
                <div className="flex-1">
                  <p className="text-sm font-bold text-primary-600">Admin Dashboard</p>
                  <p className="text-xs text-surface-500 mt-0.5">Manage products, orders & users</p>
                </div>
                <HiOutlineChevronRight className="w-4 h-4 text-primary-300 group-hover:translate-x-0.5 transition-all" />
              </Link>
            </div>
          </div>
        )}

        {/* Logout */}
        <div className="mb-8">
          <button
            onClick={handleLogout}
            className="w-full flex items-center gap-4 px-5 py-4 bg-white rounded-2xl shadow-md shadow-surface-900/5 border border-surface-100 hover:bg-red-50 hover:border-red-100 transition-colors group"
          >
            <div className="w-10 h-10 rounded-xl flex items-center justify-center text-red-500 bg-red-50 group-hover:bg-red-100 transition-colors">
              <HiOutlineLogout className="w-5 h-5" />
            </div>
            <div className="flex-1 text-left">
              <p className="text-sm font-bold text-red-600">Sign Out</p>
              <p className="text-xs text-surface-500 mt-0.5">Log out of your account</p>
            </div>
          </button>
        </div>
      </div>
    </div>
  );
}
