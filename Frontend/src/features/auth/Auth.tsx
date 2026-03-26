import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { motion } from 'motion/react';
import { Eye, EyeOff, ArrowRight, Loader2 } from 'lucide-react';

export const Login = () => {
  const [showPassword, setShowPassword] = useState(false);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      const res = await fetch('http://localhost:4000/api/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password })
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.message || 'Failed to login');
      // store token locally
      localStorage.setItem('luxeva_token', data.token);
      localStorage.setItem('luxeva_user', JSON.stringify(data.user));
      navigate('/');
    } catch (err: any) {
      setError(err.message || 'Failed to login. Please check your credentials.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="pt-40 pb-20 bg-bg min-h-screen flex items-center justify-center">
      <div className="container mx-auto px-6">
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="max-w-md mx-auto bg-white border border-accent p-10 shadow-sm"
        >
          <div className="text-center mb-10 space-y-4">
            <span className="text-[10px] uppercase tracking-[0.5em] font-bold text-gold">Welcome Back</span>
            <h1 className="text-4xl font-light tracking-tighter uppercase">Login</h1>
          </div>

          {error && (
            <div className="mb-6 p-4 bg-red-50 border border-red-100 text-red-600 text-[10px] uppercase tracking-widest font-bold">
              {error}
            </div>
          )}

          <form className="space-y-6" onSubmit={handleLogin}>
            <div className="space-y-2">
              <label className="text-[10px] uppercase tracking-widest font-bold">Email Address</label>
              <input 
                type="email" 
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full bg-bg border border-accent px-4 py-3 text-xs focus:outline-none focus:border-primary transition-colors"
                placeholder="email@example.com"
              />
            </div>

            <div className="space-y-2">
              <div className="flex justify-between items-center">
                <label className="text-[10px] uppercase tracking-widest font-bold">Password</label>
                <button type="button" className="text-[10px] uppercase tracking-widest font-bold text-muted hover:text-gold">Forgot?</button>
              </div>
              <div className="relative">
                <input 
                  type={showPassword ? "text" : "password"} 
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full bg-bg border border-accent px-4 py-3 text-xs focus:outline-none focus:border-primary transition-colors"
                  placeholder="••••••••"
                />
                <button 
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-4 top-1/2 -translate-y-1/2 text-muted hover:text-primary"
                >
                  {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                </button>
              </div>
            </div>

            <button 
              disabled={loading}
              className="w-full bg-primary text-white py-4 text-[10px] uppercase tracking-widest font-bold hover:bg-gold transition-colors flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {loading ? <Loader2 className="animate-spin" size={14} /> : <>Sign In <ArrowRight size={14} /></>}
            </button>
          </form>

          <div className="mt-10 pt-10 border-t border-accent text-center space-y-4">
            <p className="text-xs text-muted italic font-serif">Don't have an account yet?</p>
            <Link 
              to="/signup" 
              className="inline-block text-[10px] uppercase tracking-widest font-bold border-b border-primary pb-1 hover:text-gold hover:border-gold transition-all"
            >
              Create Account
            </Link>
          </div>
        </motion.div>
      </div>
    </div>
  );
};

export const SignUp = () => {
  const [showPassword, setShowPassword] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    mobile: '',
    password: '',
    agree: false
  });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleSignUp = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.agree) {
      setError('Please agree to the terms and conditions.');
      return;
    }
    setError('');
    setLoading(true);

    try {
      const res = await fetch('http://localhost:4000/api/signup', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name: formData.name,
          email: formData.email,
          mobile: formData.mobile,
          password: formData.password
        })
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.message || 'Failed to create account');
      localStorage.setItem('luxeva_token', data.token);
      localStorage.setItem('luxeva_user', JSON.stringify(data.user));
      navigate('/');
    } catch (err: any) {
      setError(err.message || 'Failed to create account.');
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value, type, checked } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));
  };

  return (
    <div className="pt-40 pb-20 bg-bg min-h-screen flex items-center justify-center">
      <div className="container mx-auto px-6">
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="max-w-md mx-auto bg-white border border-accent p-10 shadow-sm"
        >
          <div className="text-center mb-10 space-y-4">
            <span className="text-[10px] uppercase tracking-[0.5em] font-bold text-gold">Join Luxeva</span>
            <h1 className="text-4xl font-light tracking-tighter uppercase">Create Account</h1>
          </div>

          {error && (
            <div className="mb-6 p-4 bg-red-50 border border-red-100 text-red-600 text-[10px] uppercase tracking-widest font-bold">
              {error}
            </div>
          )}

          <form className="space-y-6" onSubmit={handleSignUp}>
            <div className="space-y-2">
              <label className="text-[10px] uppercase tracking-widest font-bold">Name</label>
              <input 
                type="text" 
                name="name"
                required
                value={formData.name}
                onChange={handleChange}
                className="w-full bg-bg border border-accent px-4 py-3 text-xs focus:outline-none focus:border-primary transition-colors"
                placeholder="Full name"
              />
            </div>

            <div className="space-y-2">
              <label className="text-[10px] uppercase tracking-widest font-bold">Email Address</label>
              <input 
                type="email" 
                name="email"
                required
                value={formData.email}
                onChange={handleChange}
                className="w-full bg-bg border border-accent px-4 py-3 text-xs focus:outline-none focus:border-primary transition-colors"
                placeholder="email@example.com"
              />
            </div>

            <div className="space-y-2">
              <label className="text-[10px] uppercase tracking-widest font-bold">Mobile Number</label>
              <input 
                type="tel" 
                name="mobile"
                required
                value={formData.mobile}
                onChange={handleChange}
                className="w-full bg-bg border border-accent px-4 py-3 text-xs focus:outline-none focus:border-primary transition-colors"
                placeholder="+91 98765 43210"
              />
            </div>

            <div className="space-y-2">
              <label className="text-[10px] uppercase tracking-widest font-bold">Password</label>
              <div className="relative">
                <input 
                  type={showPassword ? "text" : "password"} 
                  name="password"
                  required
                  minLength={8}
                  value={formData.password}
                  onChange={handleChange}
                  className="w-full bg-bg border border-accent px-4 py-3 text-xs focus:outline-none focus:border-primary transition-colors"
                  placeholder="••••••••"
                />
                <button 
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-4 top-1/2 -translate-y-1/2 text-muted hover:text-primary"
                >
                  {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                </button>
              </div>
              <p className="text-[8px] text-muted uppercase tracking-widest">Must be at least 8 characters long.</p>
            </div>

            <div className="flex items-start gap-3 pt-2">
              <input 
                type="checkbox" 
                name="agree"
                checked={formData.agree}
                onChange={handleChange}
                className="mt-1 accent-primary" 
                id="terms" 
              />
              <label htmlFor="terms" className="text-[10px] text-muted leading-relaxed">
                I agree to the <Link to="/terms" className="underline hover:text-primary">Terms of Service</Link> and <Link to="/privacy" className="underline hover:text-primary">Privacy Policy</Link>.
              </label>
            </div>

            <button 
              disabled={loading}
              className="w-full bg-primary text-white py-4 text-[10px] uppercase tracking-widest font-bold hover:bg-gold transition-colors flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {loading ? <Loader2 className="animate-spin" size={14} /> : <>Create Account <ArrowRight size={14} /></>}
            </button>
          </form>

          <div className="mt-10 pt-10 border-t border-accent text-center space-y-4">
            <p className="text-xs text-muted italic font-serif">Already have an account?</p>
            <Link 
              to="/login" 
              className="inline-block text-[10px] uppercase tracking-widest font-bold border-b border-primary pb-1 hover:text-gold hover:border-gold transition-all"
            >
              Login Instead
            </Link>
          </div>
        </motion.div>
      </div>
    </div>
  );
};
