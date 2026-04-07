import React, { useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { Eye, EyeOff, ArrowRight, Loader2 } from 'lucide-react';
import { useLogin } from '../auth/hooks/useAuth';

export default function AdminLogin() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const navigate = useNavigate();
  const location = useLocation();
  const fromPath = (location.state as any)?.from || '/admin';

  const loginMutation = useLogin();
  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    loginMutation.mutate({ email, password, remember: true }, {
      onError: (err: any) => { setError(err?.message || 'Login failed'); setLoading(false); },
      onSuccess: (data: any) => {
        setLoading(false);
        if (data.user?.role !== 'admin') { setError('Not authorized as admin'); return; }
        navigate(fromPath);
      }
    });
  };

  return (
    <div className="pt-40 pb-20 bg-bg min-h-screen flex items-center justify-center">
      <div className="container mx-auto px-6">
        <div className="max-w-md mx-auto bg-white border border-accent p-10 shadow-sm">
          <div className="text-center mb-6">
            <h1 className="text-2xl font-bold">Admin Login</h1>
            <p className="text-xs text-muted">Sign in with your admin account</p>
          </div>

          {error && <div className="mb-4 p-3 bg-red-50 text-red-700 border border-red-100 text-sm">{error}</div>}

          <form onSubmit={handleLogin} className="space-y-4">
            <div>
              <label className="text-[10px] uppercase tracking-widest font-bold">Email</label>
              <input value={email} onChange={(e) => setEmail(e.target.value)} className="w-full mt-2 p-3 border border-accent" type="email" required />
            </div>

            <div>
              <label className="text-[10px] uppercase tracking-widest font-bold">Password</label>
              <div className="relative mt-2">
                <input value={password} onChange={(e) => setPassword(e.target.value)} className="w-full p-3 border border-accent" type={showPassword ? 'text' : 'password'} required />
                <button type="button" onClick={() => setShowPassword(s => !s)} className="absolute right-3 top-1/2 -translate-y-1/2 text-muted">
                  {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                </button>
              </div>
            </div>

            <div>
              <button disabled={loading} className="w-full bg-primary text-white py-3 uppercase font-bold flex items-center justify-center gap-2">
                {loading ? <Loader2 className="animate-spin" size={14} /> : 'Sign in'} <ArrowRight size={14} />
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}
