import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import toast, { Toaster } from 'react-hot-toast';
import axios from 'axios';

const API = axios.create({ baseURL: '/api' });

export default function ForgotPassword() {
  const [step, setStep] = useState(1); // 1 = email, 2 = code + new password
  const [email, setEmail] = useState('');
  const [code, setCode] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [resetCode, setResetCode] = useState(''); // for demo display
  const navigate = useNavigate();

  const handleSendCode = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const res = await API.post('/auth/forgot-password', { email });
      setResetCode(res.data.code); // demo: show code
      setStep(2);
      toast.success('Reset code generated!');
    } catch (err) { toast.error(err.response?.data?.message || 'Failed to send code'); }
    finally { setLoading(false); }
  };

  const handleResetPassword = async (e) => {
    e.preventDefault();
    if (newPassword !== confirmPassword) return toast.error('Passwords do not match');
    if (newPassword.length < 6) return toast.error('Password must be at least 6 characters');
    setLoading(true);
    try {
      await API.post('/auth/reset-password', { email, code, newPassword });
      toast.success('Password reset successful!');
      setTimeout(() => navigate('/login'), 1500);
    } catch (err) { toast.error(err.response?.data?.message || 'Failed to reset password'); }
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
          <h1 className="text-2xl font-bold text-surface-900">
            {step === 1 ? 'Forgot Password?' : 'Reset Your Password'}
          </h1>
          <p className="text-surface-700/60 mt-1">
            {step === 1 ? 'Enter your email and we\'ll send a reset code' : 'Enter the code and your new password'}
          </p>
        </div>

        <div className="bg-white rounded-2xl shadow-xl shadow-surface-900/5 p-8 border border-surface-100">
          {step === 1 ? (
            <form onSubmit={handleSendCode} className="space-y-5">
              <div>
                <label className="block text-sm font-medium text-surface-700 mb-1.5">Email Address</label>
                <input type="email" required value={email} onChange={(e) => setEmail(e.target.value)} className="w-full px-4 py-2.5 rounded-xl border border-surface-200 focus:outline-none focus:ring-2 focus:ring-primary-400 text-sm" placeholder="you@example.com" />
              </div>
              <button type="submit" disabled={loading} className="w-full py-3 bg-gradient-to-r from-primary-500 to-primary-700 text-white rounded-xl font-semibold hover:shadow-lg hover:shadow-primary-500/30 transition-all disabled:opacity-50">
                {loading ? 'Sending...' : 'Send Reset Code'}
              </button>
            </form>
          ) : (
            <>
              {/* Demo: show the code */}
              {resetCode && (
                <div className="mb-6 p-4 bg-blue-50 rounded-xl border border-blue-100 text-center">
                  <p className="text-xs text-blue-500 font-medium mb-1">Demo Mode — Your reset code is:</p>
                  <p className="text-2xl font-black text-blue-700 tracking-[0.3em]">{resetCode}</p>
                </div>
              )}
              <form onSubmit={handleResetPassword} className="space-y-5">
                <div>
                  <label className="block text-sm font-medium text-surface-700 mb-1.5">6-Digit Reset Code</label>
                  <input type="text" required value={code} onChange={(e) => setCode(e.target.value)} maxLength={6} className="w-full px-4 py-2.5 rounded-xl border border-surface-200 focus:outline-none focus:ring-2 focus:ring-primary-400 text-sm text-center text-lg tracking-[0.3em] font-bold" placeholder="• • • • • •" />
                </div>
                <div>
                  <label className="block text-sm font-medium text-surface-700 mb-1.5">New Password</label>
                  <input type="password" required value={newPassword} onChange={(e) => setNewPassword(e.target.value)} minLength={6} className="w-full px-4 py-2.5 rounded-xl border border-surface-200 focus:outline-none focus:ring-2 focus:ring-primary-400 text-sm" placeholder="••••••••" />
                </div>
                <div>
                  <label className="block text-sm font-medium text-surface-700 mb-1.5">Confirm Password</label>
                  <input type="password" required value={confirmPassword} onChange={(e) => setConfirmPassword(e.target.value)} minLength={6} className="w-full px-4 py-2.5 rounded-xl border border-surface-200 focus:outline-none focus:ring-2 focus:ring-primary-400 text-sm" placeholder="••••••••" />
                </div>
                <button type="submit" disabled={loading} className="w-full py-3 bg-gradient-to-r from-primary-500 to-primary-700 text-white rounded-xl font-semibold hover:shadow-lg hover:shadow-primary-500/30 transition-all disabled:opacity-50">
                  {loading ? 'Resetting...' : 'Reset Password'}
                </button>
              </form>
            </>
          )}
          <p className="text-center text-sm text-surface-700/60 mt-6">
            Remember your password? <Link to="/login" className="text-primary-600 font-medium hover:text-primary-700">Sign In</Link>
          </p>
        </div>
      </div>
    </div>
  );
}
