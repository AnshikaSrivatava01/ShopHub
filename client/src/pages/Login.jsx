import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { loginUser } from '../utils/api';
import toast, { Toaster } from 'react-hot-toast';

export default function Login() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const { login } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const res = await loginUser({ email, password });
      login(res.data);
      toast.success('Welcome back!');
      setTimeout(() => navigate('/'), 500);
    } catch (err) { toast.error(err.response?.data?.message || 'Login failed'); }
    finally { setLoading(false); }
  };

  return (
    <div className="min-h-[80vh] flex items-center justify-center px-4 py-12 relative">
      {/* Background */}
      <div className="absolute inset-0 -z-10">
        <img src="https://images.unsplash.com/photo-1441986300917-64674bd600d8?q=80&w=2070" alt="" className="w-full h-full object-cover" />
        <div className="absolute inset-0 bg-gradient-to-br from-white/90 via-white/80 to-primary-50/70 backdrop-blur-[2px]"></div>
      </div>
      <Toaster position="top-right" />
      <div className="w-full max-w-md animate-fade-in-up">
        <div className="text-center mb-8">
          <Link to="/" className="inline-flex items-center gap-2 mb-6">
            <div className="w-10 h-10 bg-gradient-to-br from-primary-500 to-primary-700 rounded-xl flex items-center justify-center text-white font-bold text-xl shadow-lg shadow-primary-500/30">S</div>
          </Link>
          <h1 className="text-2xl font-bold text-surface-900">Welcome Back</h1>
          <p className="text-surface-700/60 mt-1">Sign in to your ShopHub account</p>
        </div>
        <div className="bg-white rounded-2xl shadow-xl shadow-surface-900/5 p-8 border border-surface-100">
          <form onSubmit={handleSubmit} className="space-y-5">
            <div>
              <label className="block text-sm font-medium text-surface-700 mb-1.5">Email</label>
              <input type="email" required value={email} onChange={(e) => setEmail(e.target.value)} className="w-full px-4 py-2.5 rounded-xl border border-surface-200 focus:outline-none focus:ring-2 focus:ring-primary-400 text-sm" placeholder="you@example.com" />
            </div>
            <div>
              <label className="block text-sm font-medium text-surface-700 mb-1.5">Password</label>
              <input type="password" required value={password} onChange={(e) => setPassword(e.target.value)} className="w-full px-4 py-2.5 rounded-xl border border-surface-200 focus:outline-none focus:ring-2 focus:ring-primary-400 text-sm" placeholder="••••••••" />
              <div className="text-right mt-1">
                <Link to="/forgot-password" className="text-xs text-primary-600 hover:text-primary-700 font-medium">Forgot Password?</Link>
              </div>
            </div>
            <button type="submit" disabled={loading} className="w-full py-3 bg-gradient-to-r from-primary-500 to-primary-700 text-white rounded-xl font-semibold hover:shadow-lg hover:shadow-primary-500/30 transition-all disabled:opacity-50">
              {loading ? 'Signing in...' : 'Sign In'}
            </button>
          </form>
          <p className="text-center text-sm text-surface-700/60 mt-6">
            Don&apos;t have an account? <Link to="/register" className="text-primary-600 font-medium hover:text-primary-700">Sign Up</Link>
          </p>

        </div>
      </div>
    </div>
  );
}
