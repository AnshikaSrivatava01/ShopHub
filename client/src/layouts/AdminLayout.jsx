import { Outlet, NavLink, Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { HiOutlineViewGrid, HiOutlineShoppingBag, HiOutlineClipboardList, HiOutlineArrowLeft, HiOutlineLogout, HiMenuAlt3, HiX } from 'react-icons/hi';
import { useState } from 'react';

const sidebarLinks = [
  { name: 'Dashboard', path: '/admin', icon: HiOutlineViewGrid, end: true },
  { name: 'Products', path: '/admin/products', icon: HiOutlineShoppingBag },
  { name: 'Orders', path: '/admin/orders', icon: HiOutlineClipboardList },
];

export default function AdminLayout() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const [sidebarOpen, setSidebarOpen] = useState(false);

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <div className="min-h-screen flex bg-surface-100">
      {/* Mobile Overlay */}
      {sidebarOpen && (
        <div className="fixed inset-0 z-40 bg-black/50 lg:hidden" onClick={() => setSidebarOpen(false)} />
      )}

      {/* Sidebar */}
      <aside className={`fixed inset-y-0 left-0 z-50 w-64 bg-surface-950 text-white flex flex-col transform transition-transform duration-300 ease-in-out lg:translate-x-0 lg:static lg:z-auto ${sidebarOpen ? 'translate-x-0' : '-translate-x-full'}`}>
        {/* Sidebar Header */}
        <div className="flex items-center justify-between px-6 py-5 border-b border-white/10">
          <Link to="/admin" className="flex items-center gap-2.5" onClick={() => setSidebarOpen(false)}>
            <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-primary-400 to-primary-600 flex items-center justify-center text-white font-black text-sm">
              S
            </div>
            <span className="text-lg font-bold tracking-tight">ShopHub</span>
          </Link>
          <button onClick={() => setSidebarOpen(false)} className="lg:hidden p-1 rounded-lg hover:bg-white/10 transition-colors">
            <HiX className="w-5 h-5" />
          </button>
        </div>

        {/* Admin Badge */}
        <div className="px-6 py-4">
          <span className="text-[10px] font-bold tracking-[0.2em] uppercase text-primary-400">Admin Panel</span>
        </div>

        {/* Navigation Links */}
        <nav className="flex-1 px-3 space-y-1">
          {sidebarLinks.map((link) => (
            <NavLink
              key={link.path}
              to={link.path}
              end={link.end}
              onClick={() => setSidebarOpen(false)}
              className={({ isActive }) =>
                `flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-semibold transition-all duration-200 ${
                  isActive
                    ? 'bg-primary-600 text-white shadow-lg shadow-primary-600/30'
                    : 'text-white/60 hover:text-white hover:bg-white/8'
                }`
              }
            >
              <link.icon className="w-5 h-5" />
              {link.name}
            </NavLink>
          ))}
        </nav>

        {/* Sidebar Footer */}
        <div className="p-3 mt-auto border-t border-white/10">
          <Link
            to="/"
            className="flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-semibold text-white/50 hover:text-white hover:bg-white/8 transition-all"
            onClick={() => setSidebarOpen(false)}
          >
            <HiOutlineArrowLeft className="w-5 h-5" />
            Back to Store
          </Link>
        </div>
      </aside>

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col min-h-screen w-full">
        {/* Top Bar */}
        <header className="sticky top-0 z-30 bg-white/80 backdrop-blur-md border-b border-surface-200 px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            {/* Mobile menu toggle */}
            <button
              onClick={() => setSidebarOpen(true)}
              className="lg:hidden p-2 rounded-xl text-surface-600 hover:bg-surface-100 transition-colors"
            >
              <HiMenuAlt3 className="w-6 h-6" />
            </button>

            <div className="hidden lg:block" />

            {/* User Info */}
            <div className="flex items-center gap-4">
              <div className="text-right hidden sm:block">
                <p className="text-sm font-bold text-surface-900">{user?.name}</p>
                <p className="text-xs text-surface-500">Administrator</p>
              </div>
              <div className="w-9 h-9 rounded-full bg-gradient-to-br from-primary-500 to-primary-700 flex items-center justify-center text-white text-sm font-bold shadow-sm">
                {user?.name?.charAt(0).toUpperCase()}
              </div>
              <button
                onClick={handleLogout}
                className="p-2 rounded-xl text-surface-500 hover:text-red-600 hover:bg-red-50 transition-colors"
                title="Sign Out"
              >
                <HiOutlineLogout className="w-5 h-5" />
              </button>
            </div>
          </div>
        </header>

        {/* Page Content */}
        <main className="flex-1 p-4 sm:p-6 lg:p-8 overflow-auto">
          <Outlet />
        </main>
      </div>
    </div>
  );
}
