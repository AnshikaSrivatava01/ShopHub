import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { HiOutlineShoppingBag, HiOutlineCurrencyRupee, HiOutlineUsers, HiOutlineClipboardList } from 'react-icons/hi';
import { getOrderStats, getAllUsers } from '../../utils/api';
import { formatPrice, getStatusColor } from '../../utils/helpers';

export default function Dashboard() {
  const [stats, setStats] = useState(null);
  const [userCount, setUserCount] = useState(0);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    Promise.all([getOrderStats(), getAllUsers()])
      .then(([sRes, uRes]) => { setStats(sRes.data); setUserCount(uRes.data.length); })
      .catch(() => {}).finally(() => setLoading(false));
  }, []);

  if (loading) return <div className="max-w-7xl mx-auto px-4 sm:px-6 py-8"><div className="grid grid-cols-1 md:grid-cols-4 gap-4">{[...Array(4)].map((_, i) => <div key={i} className="h-28 skeleton rounded-2xl"></div>)}</div></div>;

  const cards = [
    { icon: <HiOutlineCurrencyRupee className="w-7 h-7" />, label: 'Total Revenue', value: formatPrice(stats?.totalRevenue || 0), color: 'from-green-500 to-emerald-600' },
    { icon: <HiOutlineClipboardList className="w-7 h-7" />, label: 'Total Orders', value: stats?.totalOrders || 0, color: 'from-blue-500 to-indigo-600' },
    { icon: <HiOutlineUsers className="w-7 h-7" />, label: 'Total Users', value: userCount, color: 'from-purple-500 to-pink-600' },
    { icon: <HiOutlineShoppingBag className="w-7 h-7" />, label: 'Avg Order', value: stats?.totalOrders ? formatPrice(stats.totalRevenue / stats.totalOrders) : '₹0', color: 'from-amber-500 to-orange-600' },
  ];

  return (
    <div>
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-3xl font-bold text-surface-900">Admin Dashboard</h1>
          <p className="text-surface-700/60 mt-1">Overview of your store performance</p>
        </div>
        <div className="flex gap-3">
          <Link to="/admin/products" className="px-4 py-2 bg-primary-50 text-primary-700 rounded-xl text-sm font-medium hover:bg-primary-100 transition-colors">Manage Products</Link>
          <Link to="/admin/orders" className="px-4 py-2 bg-primary-50 text-primary-700 rounded-xl text-sm font-medium hover:bg-primary-100 transition-colors">Manage Orders</Link>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        {cards.map((c, i) => (
          <div key={i} className="bg-white rounded-2xl p-5 shadow-md border border-surface-100 animate-fade-in-up">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-surface-700/60">{c.label}</p>
                <p className="text-2xl font-bold text-surface-900 mt-1">{c.value}</p>
              </div>
              <div className={`p-3 bg-gradient-to-br ${c.color} rounded-xl text-white`}>{c.icon}</div>
            </div>
          </div>
        ))}
      </div>

      {/* Monthly Revenue */}
      {stats?.monthlyRevenue?.length > 0 && (
        <div className="bg-white rounded-2xl p-6 shadow-md border border-surface-100 mb-8">
          <h2 className="text-lg font-bold text-surface-900 mb-4">Monthly Revenue</h2>
          <div className="flex items-end gap-3 h-48">
            {stats.monthlyRevenue.map((m, i) => {
              const maxRev = Math.max(...stats.monthlyRevenue.map(x => x.revenue));
              const h = maxRev > 0 ? (m.revenue / maxRev) * 100 : 0;
              return (
                <div key={i} className="flex-1 flex flex-col items-center gap-2">
                  <span className="text-xs text-surface-700/60 font-medium">{formatPrice(m.revenue)}</span>
                  <div className="w-full bg-gradient-to-t from-primary-500 to-primary-400 rounded-t-lg transition-all duration-500" style={{ height: `${Math.max(h, 5)}%` }}></div>
                  <span className="text-xs text-surface-700/50">{m._id}</span>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* Recent Orders */}
      <div className="bg-white rounded-2xl p-6 shadow-md border border-surface-100">
        <h2 className="text-lg font-bold text-surface-900 mb-4">Recent Orders</h2>
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead><tr className="border-b border-surface-100">
              <th className="text-left py-3 px-2 text-surface-700/60 font-medium">Order</th>
              <th className="text-left py-3 px-2 text-surface-700/60 font-medium">Customer</th>
              <th className="text-left py-3 px-2 text-surface-700/60 font-medium">Amount</th>
              <th className="text-left py-3 px-2 text-surface-700/60 font-medium">Status</th>
              <th className="text-left py-3 px-2 text-surface-700/60 font-medium">Date</th>
            </tr></thead>
            <tbody>
              {stats?.recentOrders?.map(order => (
                <tr key={order._id} className="border-b border-surface-50 hover:bg-surface-50 transition-colors">
                  <td className="py-3 px-2 font-medium">#{order._id.slice(-6).toUpperCase()}</td>
                  <td className="py-3 px-2">{order.user?.name || 'N/A'}</td>
                  <td className="py-3 px-2 font-semibold">{formatPrice(order.totalPrice)}</td>
                  <td className="py-3 px-2"><span className={`px-2 py-0.5 rounded-full text-xs font-medium ${getStatusColor(order.deliveryStatus)}`}>{order.deliveryStatus}</span></td>
                  <td className="py-3 px-2 text-surface-700/50">{new Date(order.createdAt).toLocaleDateString('en-IN')}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
