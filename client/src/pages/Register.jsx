import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { registerUser } from '../utils/api';
import toast, { Toaster } from 'react-hot-toast';

export default function Register() {
  const [form, setForm] = useState({ 
    name: '', email: '', password: '', confirm: '', 
    phone: '', gender: 'Other', 
    addressLine: '', streetNumber: '', roadNumber: '', 
    city: '', state: '', pincode: '' 
  });
  const [loading, setLoading] = useState(false);
  const { login } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (form.password !== form.confirm) return toast.error('Passwords do not match');
    if (form.password.length < 6) return toast.error('Password must be at least 6 characters');
    if (!form.phone.match(/^\d{10}$/)) return toast.error('Phone number must be exactly 10 digits');
    if (!form.pincode.match(/^\d{6}$/)) return toast.error('Pincode must be exactly 6 digits');

    setLoading(true);
    try {
      const payload = {
        name: form.name,
        email: form.email,
        password: form.password,
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
      const res = await registerUser(payload);
      login(res.data);
      toast.success('Account created! 🎉');
      setTimeout(() => navigate('/'), 500);
    } catch (err) { 
      toast.error(err.response?.data?.message || 'Registration failed'); 
    } finally { 
      setLoading(false); 
    }
  };

  return (
    <div className="min-h-[80vh] flex items-center justify-center px-4 py-12 relative">
      {/* Background */}
      <div className="absolute inset-0 -z-10">
        <img src="https://images.unsplash.com/photo-1483985988355-763728e1935b?q=80&w=2070" alt="" className="w-full h-full object-cover" />
        <div className="absolute inset-0 bg-gradient-to-br from-white/90 via-white/80 to-primary-50/70 backdrop-blur-[2px]"></div>
      </div>
      <Toaster position="top-right" />
      <div className="w-full max-w-2xl animate-fade-in-up">
        <div className="text-center mb-8">
          <Link to="/" className="inline-flex items-center gap-2 mb-6">
            <div className="w-10 h-10 bg-gradient-to-br from-primary-500 to-primary-700 rounded-xl flex items-center justify-center text-white font-bold text-xl shadow-lg shadow-primary-500/30">S</div>
          </Link>
          <h1 className="text-2xl font-bold text-surface-900">Create Account</h1>
          <p className="text-surface-700/60 mt-1">Join ShopHub to buy & rent premium products</p>
        </div>
        <div className="bg-white rounded-2xl shadow-xl shadow-surface-900/5 p-8 border border-surface-100">
          <form onSubmit={handleSubmit} className="space-y-4">
            
            <h3 className="text-lg font-bold text-surface-900 mb-2 border-b pb-2">Personal Details</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-surface-700 mb-1.5">Full Name</label>
                <input type="text" required value={form.name} onChange={(e) => setForm({...form, name: e.target.value})} className="w-full px-4 py-2.5 rounded-xl border border-surface-200 focus:outline-none focus:ring-2 focus:ring-primary-400 text-sm" placeholder="Rashi Kumari" />
              </div>
              <div>
                <label className="block text-sm font-medium text-surface-700 mb-1.5">Email</label>
                <input type="email" required value={form.email} onChange={(e) => setForm({...form, email: e.target.value})} className="w-full px-4 py-2.5 rounded-xl border border-surface-200 focus:outline-none focus:ring-2 focus:ring-primary-400 text-sm" placeholder="you@example.com" />
              </div>
              <div>
                <label className="block text-sm font-medium text-surface-700 mb-1.5">Phone Number</label>
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

            <h3 className="text-lg font-bold text-surface-900 mb-2 mt-6 border-b pb-2">Address</h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
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

            <h3 className="text-lg font-bold text-surface-900 mb-2 mt-6 border-b pb-2">Security</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-surface-700 mb-1.5">Password</label>
                <input type="password" required value={form.password} onChange={(e) => setForm({...form, password: e.target.value})} className="w-full px-4 py-2.5 rounded-xl border border-surface-200 focus:outline-none focus:ring-2 focus:ring-primary-400 text-sm" placeholder="••••••••" />
              </div>
              <div>
                <label className="block text-sm font-medium text-surface-700 mb-1.5">Confirm Password</label>
                <input type="password" required value={form.confirm} onChange={(e) => setForm({...form, confirm: e.target.value})} className="w-full px-4 py-2.5 rounded-xl border border-surface-200 focus:outline-none focus:ring-2 focus:ring-primary-400 text-sm" placeholder="••••••••" />
              </div>
            </div>

            <button type="submit" disabled={loading} className="w-full py-3 mt-6 bg-gradient-to-r from-primary-500 to-primary-700 text-white rounded-xl font-semibold hover:shadow-lg hover:shadow-primary-500/30 transition-all disabled:opacity-50">
              {loading ? 'Creating...' : 'Create Account'}
            </button>
          </form>
          <p className="text-center text-sm text-surface-700/60 mt-6">
            Already have an account? <Link to="/login" className="text-primary-600 font-medium hover:text-primary-700">Sign In</Link>
          </p>
        </div>
      </div>
    </div>
  );
}
