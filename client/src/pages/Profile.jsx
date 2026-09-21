import { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { updateProfile } from '../utils/api';
import toast, { Toaster } from 'react-hot-toast';

export default function Profile() {
  const { user, updateUser } = useAuth();
  
  const [form, setForm] = useState({ 
    name: user?.name || '', 
    phone: user?.phone || '', 
    gender: user?.gender || 'Other',
    password: '',
    addressLine: user?.address?.addressLine || '',
    streetNumber: user?.address?.streetNumber || '',
    roadNumber: user?.address?.roadNumber || '',
    city: user?.address?.city || '',
    state: user?.address?.state || '',
    pincode: user?.address?.pincode || '',
  });
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (form.phone && !form.phone.match(/^\d{10}$/)) return toast.error('Phone number must be exactly 10 digits');
    if (form.pincode && !form.pincode.match(/^\d{6}$/)) return toast.error('Pincode must be exactly 6 digits');

    setLoading(true);
    try {
      const data = { 
        name: form.name, 
        phone: form.phone,
        gender: form.gender,
        address: {
          addressLine: form.addressLine,
          streetNumber: form.streetNumber,
          roadNumber: form.roadNumber,
          city: form.city,
          state: form.state,
          pincode: form.pincode
        }
      };
      if (form.password) data.password = form.password;
      
      const res = await updateProfile(data);
      updateUser(res.data);
      toast.success('Profile updated!');
      setForm(prev => ({ ...prev, password: '' }));
    } catch (err) { 
      toast.error(err.response?.data?.message || 'Update failed'); 
    } finally { 
      setLoading(false); 
    }
  };

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 py-8">
      <Toaster position="top-right" />
      <h1 className="text-3xl font-bold text-surface-900 mb-8">My Profile</h1>
      <div className="bg-white rounded-2xl shadow-md p-8 border border-surface-100">
        <div className="flex items-center gap-4 mb-8 pb-6 border-b border-surface-100">
          <div className="w-16 h-16 bg-gradient-to-br from-primary-400 to-primary-700 text-white rounded-2xl flex items-center justify-center text-2xl font-bold shadow-lg shadow-primary-500/30">
            {user?.name?.[0]?.toUpperCase()}
          </div>
          <div>
            <h2 className="text-xl font-bold text-surface-900">{user?.name}</h2>
            <p className="text-surface-700/60 text-sm">{user?.email}</p>
            <span className={`mt-1 inline-block text-xs px-2 py-0.5 rounded-full ${user?.role === 'admin' ? 'bg-primary-50 text-primary-700' : 'bg-surface-100 text-surface-700'}`}>
              {user?.role}
            </span>
          </div>
        </div>
        
        <form onSubmit={handleSubmit} className="space-y-6">
          <h3 className="text-lg font-bold text-surface-900 border-b pb-2">Personal Details</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
            <div>
              <label className="block text-sm font-medium text-surface-700 mb-1.5">Name</label>
              <input type="text" required value={form.name} onChange={(e) => setForm({...form, name: e.target.value})} className="w-full px-4 py-2.5 rounded-xl border border-surface-200 focus:outline-none focus:ring-2 focus:ring-primary-400 text-sm" />
            </div>
            <div>
              <label className="block text-sm font-medium text-surface-700 mb-1.5">Phone</label>
              <input type="tel" required value={form.phone} onChange={(e) => setForm({...form, phone: e.target.value})} className="w-full px-4 py-2.5 rounded-xl border border-surface-200 focus:outline-none focus:ring-2 focus:ring-primary-400 text-sm" placeholder="9876543210" />
            </div>
            <div>
              <label className="block text-sm font-medium text-surface-700 mb-1.5">Gender</label>
              <select required value={form.gender} onChange={(e) => setForm({...form, gender: e.target.value})} className="w-full px-4 py-2.5 rounded-xl border border-surface-200 focus:outline-none focus:ring-2 focus:ring-primary-400 text-sm bg-white">
                <option value="Male">Male</option>
                <option value="Female">Female</option>
                <option value="Other">Other</option>
              </select>
            </div>
          </div>

          <h3 className="text-lg font-bold text-surface-900 mt-6 border-b pb-2">Address details</h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
            <div className="md:col-span-3">
              <label className="block text-sm font-medium text-surface-700 mb-1.5">Address Line</label>
              <input type="text" required value={form.addressLine} onChange={(e) => setForm({...form, addressLine: e.target.value})} className="w-full px-4 py-2.5 rounded-xl border border-surface-200 focus:outline-none focus:ring-2 focus:ring-primary-400 text-sm" placeholder="123 Main St, Apartment 4B" />
            </div>
            <div>
              <label className="block text-sm font-medium text-surface-700 mb-1.5">Street Number</label>
              <input type="text" required value={form.streetNumber} onChange={(e) => setForm({...form, streetNumber: e.target.value})} className="w-full px-4 py-2.5 rounded-xl border border-surface-200 focus:outline-none focus:ring-2 focus:ring-primary-400 text-sm" placeholder="5" />
            </div>
            <div>
              <label className="block text-sm font-medium text-surface-700 mb-1.5">Road Number</label>
              <input type="text" required value={form.roadNumber} onChange={(e) => setForm({...form, roadNumber: e.target.value})} className="w-full px-4 py-2.5 rounded-xl border border-surface-200 focus:outline-none focus:ring-2 focus:ring-primary-400 text-sm" placeholder="10" />
            </div>
            <div>
              <label className="block text-sm font-medium text-surface-700 mb-1.5">City</label>
              <input type="text" required value={form.city} onChange={(e) => setForm({...form, city: e.target.value})} className="w-full px-4 py-2.5 rounded-xl border border-surface-200 focus:outline-none focus:ring-2 focus:ring-primary-400 text-sm" placeholder="Ranchi" />
            </div>
            <div>
              <label className="block text-sm font-medium text-surface-700 mb-1.5">State</label>
              <input type="text" required value={form.state} onChange={(e) => setForm({...form, state: e.target.value})} className="w-full px-4 py-2.5 rounded-xl border border-surface-200 focus:outline-none focus:ring-2 focus:ring-primary-400 text-sm" placeholder="Jharkhand" />
            </div>
            <div>
              <label className="block text-sm font-medium text-surface-700 mb-1.5">Pincode</label>
              <input type="text" required value={form.pincode} onChange={(e) => setForm({...form, pincode: e.target.value})} className="w-full px-4 py-2.5 rounded-xl border border-surface-200 focus:outline-none focus:ring-2 focus:ring-primary-400 text-sm" placeholder="834010" />
            </div>
          </div>

          <h3 className="text-lg font-bold text-surface-900 mt-6 border-b pb-2">Security</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
            <div>
              <label className="block text-sm font-medium text-surface-700 mb-1.5">New Password <span className="text-xs text-surface-700/40">(leave blank to keep current)</span></label>
              <input type="password" value={form.password} onChange={(e) => setForm({...form, password: e.target.value})} className="w-full px-4 py-2.5 rounded-xl border border-surface-200 focus:outline-none focus:ring-2 focus:ring-primary-400 text-sm" placeholder="••••••••" />
            </div>
          </div>

          <button type="submit" disabled={loading} className="px-8 py-3 bg-gradient-to-r from-primary-500 to-primary-700 text-white rounded-xl font-semibold hover:shadow-lg transition-all disabled:opacity-50">
            {loading ? 'Saving...' : 'Save Changes'}
          </button>
        </form>
      </div>
    </div>
  );
}
