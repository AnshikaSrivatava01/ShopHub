import { useState, useEffect } from 'react';
import { getAllOrders, updateOrderStatus } from '../../utils/api';
import { formatPrice, getStatusColor, getStatusLabel } from '../../utils/helpers';
import toast, { Toaster } from 'react-hot-toast';

export default function ManageOrders() {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    getAllOrders().then(res => setOrders(res.data)).catch(() => {}).finally(() => setLoading(false));
  }, []);

  const handleStatusUpdate = async (id, deliveryStatus) => {
    try {
      const res = await updateOrderStatus(id, { deliveryStatus });
      setOrders(prev => prev.map(o => o._id === id ? { ...o, deliveryStatus: res.data.deliveryStatus } : o));
      toast.success('Status updated');
    } catch { toast.error('Failed to update'); }
  };

  if (loading) return <div className="max-w-7xl mx-auto px-4 sm:px-6 py-8"><div className="space-y-4">{[...Array(5)].map((_, i) => <div key={i} className="h-16 skeleton rounded-xl"></div>)}</div></div>;

  return (
    <div>
      <Toaster position="top-right" />
      <h1 className="text-3xl font-bold text-surface-900 mb-8">Manage Orders</h1>
      <div className="bg-white rounded-2xl shadow-md border border-surface-100 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead><tr className="bg-surface-50 border-b border-surface-100">
              <th className="text-left py-3 px-4 font-medium text-surface-700/60">Order ID</th>
              <th className="text-left py-3 px-4 font-medium text-surface-700/60">Customer</th>
              <th className="text-left py-3 px-4 font-medium text-surface-700/60">Items</th>
              <th className="text-left py-3 px-4 font-medium text-surface-700/60">Total</th>
              <th className="text-left py-3 px-4 font-medium text-surface-700/60">Payment</th>
              <th className="text-left py-3 px-4 font-medium text-surface-700/60">Delivery</th>
              <th className="text-left py-3 px-4 font-medium text-surface-700/60">Date</th>
            </tr></thead>
            <tbody>
              {orders.map(order => (
                <tr key={order._id} className="border-b border-surface-50 hover:bg-surface-50 transition-colors">
                  <td className="py-3 px-4 font-mono text-xs">#{order._id.slice(-8).toUpperCase()}</td>
                  <td className="py-3 px-4">{order.user?.name || 'N/A'}<br/><span className="text-xs text-surface-700/50">{order.user?.email}</span></td>
                  <td className="py-3 px-4">{order.items.length} item(s)</td>
                  <td className="py-3 px-4 font-semibold">{formatPrice(order.totalPrice)}</td>
                  <td className="py-3 px-4"><span className={`px-2 py-0.5 rounded-full text-xs font-medium ${getStatusColor(order.paymentStatus)}`}>{getStatusLabel(order.paymentStatus)}</span></td>
                  <td className="py-3 px-4">
                    <select value={order.deliveryStatus} onChange={(e) => handleStatusUpdate(order._id, e.target.value)} className="px-2 py-1 rounded-lg border border-surface-200 text-xs focus:outline-none focus:ring-2 focus:ring-primary-400 bg-white">
                      <option value="processing">Processing</option>
                      <option value="shipped">Shipped</option>
                      <option value="delivered">Delivered</option>
                      <option value="returned">Returned</option>
                    </select>
                  </td>
                  <td className="py-3 px-4 text-surface-700/50 text-xs">{new Date(order.createdAt).toLocaleDateString('en-IN')}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        {orders.length === 0 && <p className="text-center py-8 text-surface-700/50">No orders yet</p>}
      </div>
    </div>
  );
}
