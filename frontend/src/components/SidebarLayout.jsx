'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { 
  LayoutDashboard, 
  MessageSquareCode, 
  Wallet, 
  Compass, 
  GitFork, 
  Bell, 
  LogOut, 
  Menu, 
  X, 
  User,
  ShieldCheck,
  Zap,
  Activity
} from 'lucide-react';
import { api } from '@/utils/api';

export default function SidebarLayout({ children }) {
  const pathname = usePathname();
  const router = useRouter();
  const [mobileOpen, setMobileOpen] = useState(false);
  const [user, setUser] = useState(null);
  const [notifications, setNotifications] = useState([]);
  const [unreadNotifs, setUnreadNotifs] = useState(0);
  const [showNotifMenu, setShowNotifMenu] = useState(false);
  const [agentLogs, setAgentLogs] = useState([]);

  useEffect(() => {
    // Check auth
    const token = localStorage.getItem('token');
    if (!token) {
      router.push('/login');
      return;
    }

    // Fetch profile and notifications
    fetchDashboardData();
    const interval = setInterval(fetchDashboardData, 10000); // Poll every 10s for updates
    return () => clearInterval(interval);
  }, []);

  const fetchDashboardData = async () => {
    try {
      const res = await api.getDashboard();
      setUser(res.data.profile);
      setNotifications(res.data.notifications || []);
      setUnreadNotifs(res.data.notifications?.filter(n => !n.read).length || 0);
      setAgentLogs(res.data.agentActivityFeed || []);
    } catch (err) {
      console.error("Failed to load dashboard context in layout:", err.message);
      // If unauthorized, redirect
      if (err.message.includes('authorized') || err.message.includes('token')) {
        localStorage.removeItem('token');
        router.push('/login');
      }
    }
  };

  const handleLogout = () => {
    localStorage.removeItem('token');
    router.push('/');
  };

  const markAsRead = async (id) => {
    try {
      await api.markNotificationRead(id);
      fetchDashboardData();
    } catch (err) {
      console.error(err);
    }
  };

  const navLinks = [
    { name: 'Dashboard', path: '/dashboard', icon: LayoutDashboard },
    { name: 'AI Welfare Chat', path: '/chat', icon: MessageSquareCode },
    { name: 'Schemes Explorer', path: '/schemes', icon: Compass },
    { name: 'Document Wallet', path: '/wallet', icon: Wallet },
    { name: 'Digital Twin Lifecycle', path: '/twin', icon: GitFork }
  ];

  return (
    <div className="min-h-screen flex flex-col md:flex-row bg-[#080b11] text-slate-100 overflow-x-hidden">
      
      {/* Mobile Header Bar */}
      <header className="md:hidden flex items-center justify-between px-6 py-4 bg-[#0a0f1d] border-b border-slate-800/60 sticky top-0 z-40">
        <div className="flex items-center gap-2">
          <Zap className="h-6 w-6 text-blue-500 fill-blue-500" />
          <span className="font-bold text-lg bg-gradient-to-r from-blue-400 to-emerald-400 bg-clip-text text-transparent">SchemeSathi AI</span>
        </div>
        <div className="flex items-center gap-4">
          {/* Notification Alert Bell */}
          <div className="relative">
            <button onClick={() => setShowNotifMenu(!showNotifMenu)} className="p-2 rounded-lg bg-slate-800/60 text-slate-300 hover:text-white relative">
              <Bell className="h-5 w-5" />
              {unreadNotifs > 0 && (
                <span className="absolute top-1 right-1 h-2 w-2 rounded-full bg-emerald-500 animate-ping" />
              )}
            </button>
          </div>
          <button onClick={() => setMobileOpen(!mobileOpen)} className="p-2 rounded-lg bg-slate-800/60 text-slate-300">
            {mobileOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
          </button>
        </div>
      </header>

      {/* Desktop Sidebar */}
      <aside className={`fixed inset-y-0 left-0 z-50 w-64 bg-[#05080e] border-r border-slate-900 flex flex-col justify-between transform transition-transform duration-300 ease-in-out md:translate-x-0 md:static md:h-screen ${
        mobileOpen ? 'translate-x-0' : '-translate-x-full'
      }`}>
        <div className="flex flex-col flex-1 overflow-y-auto px-4 py-6">
          {/* Logo Section */}
          <div className="flex items-center gap-2.5 px-3 mb-8">
            <Zap className="h-8 w-8 text-blue-500 fill-blue-500" />
            <div>
              <h1 className="font-extrabold text-xl bg-gradient-to-r from-blue-400 via-blue-500 to-emerald-400 bg-clip-text text-transparent">SchemeSathi</h1>
              <p className="text-[10px] text-slate-500 tracking-wider font-semibold uppercase">AI Welfare Officer</p>
            </div>
          </div>

          {/* User Profile Overview */}
          {user && (
            <div className="mb-6 p-4 rounded-xl bg-slate-900/60 border border-slate-800/50 flex items-center gap-3">
              <div className="h-10 w-10 rounded-lg bg-blue-500/10 border border-blue-500/20 flex items-center justify-center text-blue-400 font-bold">
                {user.name.charAt(0)}
              </div>
              <div className="min-w-0 flex-1">
                <p className="text-sm font-semibold text-white truncate">{user.name}</p>
                <div className="flex items-center gap-1.5 mt-0.5">
                  <ShieldCheck className="h-3 w-3 text-emerald-400" />
                  <p className="text-xs text-slate-400 font-medium capitalize">{user.role}</p>
                </div>
              </div>
            </div>
          )}

          {/* Navigation Links */}
          <nav className="space-y-1.5 flex-1">
            {navLinks.map((link) => {
              const Icon = link.icon;
              const isActive = pathname === link.path || (link.path !== '/dashboard' && pathname.startsWith(link.path));
              return (
                <Link
                  key={link.name}
                  href={link.path}
                  onClick={() => setMobileOpen(false)}
                  className={`flex items-center gap-3.5 px-4 py-3 rounded-xl text-sm font-medium transition-all duration-200 ${
                    isActive 
                      ? 'bg-blue-600/10 text-blue-400 border-l-4 border-blue-500 shadow-[inset_1px_0_12px_rgba(37,99,235,0.06)]' 
                      : 'text-slate-400 hover:text-slate-200 hover:bg-slate-900/40'
                  }`}
                >
                  <Icon className="h-4.5 w-4.5" />
                  {link.name}
                </Link>
              );
            })}
          </nav>

          {/* Real-time Agent activity widget in Sidebar */}
          {agentLogs.length > 0 && (
            <div className="mt-6 p-3.5 rounded-xl bg-[#090e18] border border-emerald-950/40 text-[11px] space-y-2">
              <div className="flex items-center gap-1.5 text-emerald-400 font-semibold uppercase tracking-wider text-[9px]">
                <span className="h-1.5 w-1.5 rounded-full bg-emerald-500 animate-pulse active-agent-glow" />
                Live Agent Logs
              </div>
              <p className="text-slate-400 leading-normal line-clamp-2 h-8">
                {agentLogs[0].log_text}
              </p>
            </div>
          )}
        </div>

        {/* Logout Button */}
        <div className="p-4 border-t border-slate-900/60 bg-[#04060b]">
          <button
            onClick={handleLogout}
            className="w-full flex items-center gap-3 px-4 py-3 text-sm text-slate-400 hover:text-red-400 hover:bg-red-500/5 rounded-xl transition-all"
          >
            <LogOut className="h-4 w-4" />
            Sign Out
          </button>
        </div>
      </aside>

      {/* Main Panel */}
      <main className="flex-1 flex flex-col h-screen overflow-y-auto">
        {/* Desktop Header */}
        <header className="hidden md:flex items-center justify-between px-8 py-5 border-b border-slate-900/60 bg-[#060a12]/80 backdrop-blur sticky top-0 z-30">
          <div>
            <h2 className="text-lg font-bold text-white uppercase tracking-wider text-xs">
              {navLinks.find(l => pathname === l.path || (l.path !== '/dashboard' && pathname.startsWith(l.path)))?.name || 'Welfare Center'}
            </h2>
            <p className="text-xs text-slate-500 mt-0.5">SchemeSathi Welfare Engine V1.0</p>
          </div>

          <div className="flex items-center gap-5">
            {/* Notification Bell */}
            <div className="relative">
              <button
                onClick={() => setShowNotifMenu(!showNotifMenu)}
                className="p-2.5 rounded-xl bg-slate-900/80 border border-slate-800/60 text-slate-400 hover:text-white transition-all relative"
              >
                <Bell className="h-4.5 w-4.5" />
                {unreadNotifs > 0 && (
                  <span className="absolute top-1 right-1 h-2 w-2 rounded-full bg-emerald-500 animate-ping" />
                )}
              </button>

              {/* Notification Dropdown */}
              {showNotifMenu && (
                <div className="absolute right-0 mt-3 w-80 rounded-2xl bg-[#0e1424] border border-slate-800 shadow-xl py-3 z-50 max-h-96 overflow-y-auto">
                  <div className="px-4 pb-2 border-b border-slate-800 flex justify-between items-center">
                    <span className="font-bold text-xs text-white uppercase">Notifications</span>
                    {unreadNotifs > 0 && <span className="bg-emerald-500/10 text-emerald-400 text-[10px] font-semibold px-2 py-0.5 rounded-full">{unreadNotifs} New</span>}
                  </div>
                  {notifications.length === 0 ? (
                    <p className="text-xs text-slate-500 text-center py-6 px-4">No recent system notifications.</p>
                  ) : (
                    <div className="divide-y divide-slate-800/50">
                      {notifications.map((n) => (
                        <div key={n.id} className={`p-4 hover:bg-slate-900/30 transition-all ${!n.read ? 'bg-blue-950/10' : ''}`}>
                          <div className="flex justify-between items-start gap-2">
                            <h4 className="text-xs font-bold text-slate-200">{n.title}</h4>
                            {!n.read && (
                              <button onClick={() => markAsRead(n.id)} className="text-[10px] text-blue-400 hover:underline">
                                Read
                              </button>
                            )}
                          </div>
                          <p className="text-[11px] text-slate-400 mt-1 leading-normal">{n.message}</p>
                          <span className="text-[9px] text-slate-500 mt-1.5 block">
                            {new Date(n.created_at || n.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                          </span>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              )}
            </div>

            <div className="h-9 w-px bg-slate-900" />

            {/* Profile Overview */}
            {user && (
              <div className="flex items-center gap-3">
                <div className="text-right">
                  <p className="text-sm font-semibold text-white">{user.name}</p>
                  <p className="text-[10px] text-emerald-400 font-semibold">{user.state || 'India Domicile'}</p>
                </div>
                <div className="h-10 w-10 rounded-xl bg-slate-900 border border-slate-800 flex items-center justify-center font-bold text-blue-400">
                  {user.name.charAt(0)}
                </div>
              </div>
            )}
          </div>
        </header>

        {/* Main Workspace Frame */}
        <div className="flex-1 p-6 md:p-8 bg-[#070b13] overflow-y-auto">
          {children}
        </div>
      </main>
    </div>
  );
}
