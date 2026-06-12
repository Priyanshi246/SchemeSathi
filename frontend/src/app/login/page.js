'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { motion } from 'framer-motion';
import { 
  Zap, 
  ShieldAlert, 
  ArrowRight, 
  ShieldCheck, 
  Mail, 
  Lock, 
  UserCheck, 
  Eye, 
  EyeOff 
} from 'lucide-react';
import { api } from '@/utils/api';

export default function LoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [rememberMe, setRememberMe] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    // If token exists, direct to dashboard
    if (localStorage.getItem('token')) {
      router.push('/dashboard');
    }
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!email || !password) return;

    setLoading(true);
    setError(null);

    try {
      const res = await api.login(email, password);
      localStorage.setItem('token', res.token);
      localStorage.setItem('user', JSON.stringify(res.user));
      router.push('/dashboard');
    } catch (err) {
      console.error(err);
      setError(err.message || 'Invalid email or password credentials.');
    } finally {
      setLoading(false);
    }
  };

  const handleGoogleLogin = () => {
    setLoading(true);
    setTimeout(() => {
      localStorage.setItem('token', 'mock-jwt-token-google');
      localStorage.setItem('user', JSON.stringify({
        name: "Google Citizen",
        email: "citizen.google@schemesathi.ai",
        role: "Citizen",
        state: "Rajasthan",
        occupation: "Student",
        age: 21,
        income: 150000
      }));
      setLoading(false);
      router.push('/dashboard');
    }, 1000);
  };

  // Helper for quick sandbox demo logins
  const loadDemoAccount = (role) => {
    setError(null);
    if (role === 'citizen') {
      setEmail('citizen@schemesathi.ai');
      setPassword('password123');
    } else if (role === 'admin') {
      setEmail('admin@schemesathi.ai');
      setPassword('admin123');
    }
  };

  return (
    <div className="min-h-screen bg-[#F8FAFC] dark:bg-[#090d16] flex flex-col justify-center items-center p-6 relative overflow-hidden font-sans transition-colors duration-200">
      
      {/* Background gradients */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[400px] h-[400px] bg-blue-500/5 dark:bg-blue-500/10 rounded-full blur-[100px] pointer-events-none" />

      {/* Main card */}
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="w-full max-w-md bg-white/80 dark:bg-[#0c101b]/80 backdrop-blur-md rounded-3xl border border-slate-200 dark:border-slate-800 p-8 shadow-xl relative z-10 text-slate-800 dark:text-white"
      >
        
        {/* Brand logo */}
        <div className="flex flex-col items-center mb-8">
          <Link href="/" className="h-12 w-12 rounded-2xl bg-blue-50 dark:bg-blue-500/10 border border-blue-100 dark:border-blue-500/30 flex items-center justify-center text-blue-600 dark:text-blue-500 mb-3 hover:scale-105 transition">
            <Zap className="h-6 w-6 fill-blue-600 dark:fill-blue-500" />
          </Link>
          <h2 className="font-extrabold text-2xl text-slate-900 dark:text-white">Portal Sign In</h2>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-1.5">Access your SchemeSathi Welfare Officer</p>
        </div>

        {error && (
          <div className="mb-6 p-4 rounded-xl bg-red-50 dark:bg-red-500/10 border border-red-200 dark:border-red-500/20 flex gap-3 text-xs text-red-600 dark:text-red-400">
            <ShieldAlert className="h-5 w-5 shrink-0" />
            <p className="leading-normal font-semibold">{error}</p>
          </div>
        )}

        {/* Input Form */}
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-[10px] font-bold text-slate-400 dark:text-slate-500 uppercase tracking-wider mb-2">Email Address</label>
            <div className="relative">
              <Mail className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="name@welfare.gov.in"
                className="w-full pl-11 pr-4 py-3.5 bg-slate-50 dark:bg-[#0a0f1d] border border-slate-200 dark:border-slate-800 focus:border-blue-600 dark:focus:border-blue-500 rounded-2xl text-xs text-slate-800 dark:text-white placeholder-slate-400 dark:placeholder-slate-600 outline-none transition"
              />
            </div>
          </div>

          <div>
            <div className="flex justify-between items-center mb-2">
              <label className="block text-[10px] font-bold text-slate-400 dark:text-slate-500 uppercase tracking-wider">Password</label>
              <button 
                type="button"
                onClick={() => alert("Simulated: Forgot password link clicked. Demo users: citizen@schemesathi.ai / password123.")}
                className="text-[10px] text-blue-600 dark:text-blue-400 font-bold hover:underline"
              >
                Forgot Password?
              </button>
            </div>
            <div className="relative">
              <Lock className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
              <input
                type={showPassword ? "text" : "password"}
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••••••"
                className="w-full pl-11 pr-11 py-3.5 bg-slate-50 dark:bg-[#0a0f1d] border border-slate-200 dark:border-slate-800 focus:border-blue-600 dark:focus:border-blue-500 rounded-2xl text-xs text-slate-800 dark:text-white placeholder-slate-400 dark:placeholder-slate-600 outline-none transition"
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3.5 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 transition"
              >
                {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
              </button>
            </div>
          </div>

          {/* Remember Me */}
          <div className="flex items-center">
            <input 
              id="remember-me"
              type="checkbox" 
              checked={rememberMe}
              onChange={(e) => setRememberMe(e.target.checked)}
              className="h-4 w-4 text-blue-600 border-slate-300 dark:border-slate-800 rounded-md focus:ring-blue-500"
            />
            <label htmlFor="remember-me" className="ml-2 text-xs font-semibold text-slate-500 dark:text-slate-400 cursor-pointer select-none">
              Remember me on this device
            </label>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full flex items-center justify-center gap-2 py-3.5 bg-blue-600 hover:bg-blue-700 disabled:bg-blue-800/50 disabled:cursor-not-allowed text-xs font-bold text-white rounded-2xl shadow-lg shadow-blue-600/10 transition mt-6"
          >
            {loading ? 'Authenticating Credentials...' : 'Sign In'}
            {!loading && <ArrowRight className="h-4 w-4" />}
          </button>
        </form>

        {/* Google Login button */}
        <button
          onClick={handleGoogleLogin}
          disabled={loading}
          className="w-full flex items-center justify-center gap-2.5 py-3 bg-white hover:bg-slate-50 border border-slate-200 text-slate-700 font-bold rounded-2xl text-xs shadow-xs transition mt-3"
        >
          <svg className="h-4 w-4" viewBox="0 0 24 24">
            <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
            <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
            <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z"/>
            <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
          </svg>
          Continue with Google
        </button>

        <p className="text-center text-xs text-slate-500 dark:text-slate-400 mt-6 font-medium">
          New to SchemeSathi?{' '}
          <Link href="/register" className="text-blue-600 dark:text-blue-400 font-bold hover:underline">
            Create an Account
          </Link>
        </p>

        {/* Sandbox Quick login widgets */}
        <div className="mt-8 pt-6 border-t border-slate-200 dark:border-slate-800/60">
          <p className="text-[10px] font-bold text-slate-400 dark:text-slate-500 uppercase tracking-widest text-center mb-4">
            Sandbox Quick Access
          </p>
          <div className="grid grid-cols-2 gap-3">
            <button
              onClick={() => loadDemoAccount('citizen')}
              className="flex flex-col items-center justify-center p-3 rounded-2xl bg-slate-50 dark:bg-slate-900/50 hover:bg-blue-50/40 dark:hover:bg-blue-950/20 border border-slate-200 dark:border-slate-800/80 hover:border-blue-500/30 text-left transition"
            >
              <UserCheck className="h-4.5 w-4.5 text-blue-600 dark:text-blue-400 mb-1.5" />
              <span className="text-[11px] font-bold text-slate-800 dark:text-slate-200">Demo Citizen</span>
              <span className="text-[9px] text-slate-400 dark:text-slate-500 mt-0.5">Rajasthan Student</span>
            </button>
            <button
              onClick={() => loadDemoAccount('admin')}
              className="flex flex-col items-center justify-center p-3 rounded-2xl bg-slate-50 dark:bg-slate-900/50 hover:bg-emerald-50/40 dark:hover:bg-emerald-950/20 border border-slate-200 dark:border-slate-800/80 hover:border-emerald-500/30 text-left transition"
            >
              <ShieldCheck className="h-4.5 w-4.5 text-emerald-600 dark:text-emerald-400 mb-1.5" />
              <span className="text-[11px] font-bold text-slate-800 dark:text-slate-200">Demo Officer</span>
              <span className="text-[9px] text-slate-400 dark:text-slate-500 mt-0.5">Welfare Admin</span>
            </button>
          </div>
        </div>

      </motion.div>

      {/* Footer disclaimer */}
      <p className="text-[9px] text-slate-400 dark:text-slate-600 mt-8 relative z-10 max-w-sm text-center leading-relaxed">
        This portal operates in secure sandbox demo modes. Data resets dynamically. All simulated AI runs on local mockup engines.
      </p>

    </div>
  );
}
