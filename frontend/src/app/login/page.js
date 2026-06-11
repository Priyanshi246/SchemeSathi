'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { Zap, ShieldAlert, ArrowRight, ShieldCheck, Mail, Lock, UserCheck } from 'lucide-react';
import { api } from '@/utils/api';

export default function LoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
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
    <div className="min-h-screen bg-[#070b13] flex flex-col justify-center items-center p-6 relative overflow-hidden font-sans">
      
      {/* Background blur */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[400px] h-[400px] bg-blue-500/10 rounded-full blur-[100px] pointer-events-none" />

      {/* Main card */}
      <div className="w-full max-w-md glass-panel rounded-3xl border border-slate-800 p-8 shadow-2xl relative z-10">
        
        {/* Brand logo */}
        <div className="flex flex-col items-center mb-8">
          <div className="h-12 w-12 rounded-2xl bg-blue-500/10 border border-blue-500/30 flex items-center justify-center text-blue-500 mb-3 animate-pulse">
            <Zap className="h-6 w-6 fill-blue-500" />
          </div>
          <h2 className="font-extrabold text-2xl text-white">Welfare Portal Sign In</h2>
          <p className="text-xs text-slate-500 mt-1">Access your SchemeSathi AI Welfare Officer</p>
        </div>

        {error && (
          <div className="mb-6 p-4 rounded-xl bg-red-500/10 border border-red-500/20 flex gap-3 text-xs text-red-400">
            <ShieldAlert className="h-5 w-5 shrink-0" />
            <p className="leading-normal">{error}</p>
          </div>
        )}

        {/* Input Form */}
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-xs font-semibold text-slate-400 uppercase tracking-wider mb-2">Email Address</label>
            <div className="relative">
              <Mail className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-500" />
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="name@welfare.gov.in"
                className="w-full pl-11 pr-4 py-3 bg-[#0a0f1d] border border-slate-800 focus:border-blue-500 focus:ring-1 focus:ring-blue-500 rounded-xl text-sm text-white placeholder-slate-600 outline-none transition"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-400 uppercase tracking-wider mb-2">Password</label>
            <div className="relative">
              <Lock className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-500" />
              <input
                type="password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••••••"
                className="w-full pl-11 pr-4 py-3 bg-[#0a0f1d] border border-slate-800 focus:border-blue-500 focus:ring-1 focus:ring-blue-500 rounded-xl text-sm text-white placeholder-slate-600 outline-none transition"
              />
            </div>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full flex items-center justify-center gap-2 py-3.5 bg-blue-600 hover:bg-blue-700 disabled:bg-blue-800/50 disabled:cursor-not-allowed text-sm font-semibold text-white rounded-xl shadow-lg shadow-blue-500/10 transition mt-6"
          >
            {loading ? 'Authenticating Credentials...' : 'Sign In'}
            {!loading && <ArrowRight className="h-4 w-4" />}
          </button>
        </form>

        <p className="text-center text-xs text-slate-500 mt-6">
          New to SchemeSathi?{' '}
          <Link href="/register" className="text-blue-400 font-semibold hover:underline">
            Create an Account
          </Link>
        </p>

        {/* Sandbox Quick login widgets */}
        <div className="mt-8 pt-6 border-t border-slate-900/60">
          <p className="text-[10px] font-bold text-slate-500 uppercase tracking-widest text-center mb-4">
            Hackathon Sandbox Quick Login
          </p>
          <div className="grid grid-cols-2 gap-3">
            <button
              onClick={() => loadDemoAccount('citizen')}
              className="flex flex-col items-center justify-center p-3 rounded-xl bg-slate-900/50 hover:bg-blue-950/20 border border-slate-800/80 hover:border-blue-500/30 text-left transition"
            >
              <UserCheck className="h-4 w-4 text-blue-400 mb-1" />
              <span className="text-[11px] font-bold text-slate-200">Demo Citizen</span>
              <span className="text-[9px] text-slate-500 mt-0.5">Aarav (Student)</span>
            </button>
            <button
              onClick={() => loadDemoAccount('admin')}
              className="flex flex-col items-center justify-center p-3 rounded-xl bg-slate-900/50 hover:bg-emerald-950/20 border border-slate-800/80 hover:border-emerald-500/30 text-left transition"
            >
              <ShieldCheck className="h-4 w-4 text-emerald-400 mb-1" />
              <span className="text-[11px] font-bold text-slate-200">Demo Admin</span>
              <span className="text-[9px] text-slate-500 mt-0.5">Priya (Welfare Officer)</span>
            </button>
          </div>
        </div>

      </div>

      {/* Footer disclaimer */}
      <p className="text-[10px] text-slate-600 mt-8 relative z-10 max-w-sm text-center leading-relaxed">
        Sandbox environment. Data resets dynamically. All simulated AI routines fall back to local rule-engines if offline.
      </p>

    </div>
  );
}
