'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { 
  LayoutDashboard, 
  MessageSquare, 
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
  Activity,
  Settings,
  Calendar,
  Sparkles,
  Sun,
  Moon,
  TrendingUp,
  Fingerprint
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
  const [isDarkMode, setIsDarkMode] = useState(false);

  useEffect(() => {
    // Check auth
    const token = localStorage.getItem('token');
    if (!token) {
      router.push('/login');
      return;
    }

    // Set theme state on mount
    const checkTheme = () => {
      const isDark = document.documentElement.classList.contains('dark');
      setIsDarkMode(isDark);
    };
    checkTheme();

    // Fetch profile and notifications
    fetchDashboardData();
    const interval = setInterval(fetchDashboardData, 10000); // Poll every 10s
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
      console.error("Failed to load dashboard context:", err.message);
    }
  };

  const toggleTheme = () => {
    const root = document.documentElement;
    if (root.classList.contains('dark')) {
      root.classList.remove('dark');
      localStorage.setItem('theme', 'light');
      setIsDarkMode(false);
    } else {
      root.classList.add('dark');
      localStorage.setItem('theme', 'dark');
      setIsDarkMode(true);
    }
  };

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
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
    { name: 'AI Chat', path: '/chat', icon: MessageSquare },
    { name: 'Schemes', path: '/schemes', icon: Compass },
    { name: 'Document Wallet', path: '/wallet', icon: Wallet },
    { name: 'Roadmaps', path: '/roadmaps', icon: Calendar },
    { name: 'Future Opportunities', path: '/opportunities', icon: TrendingUp },
    { name: 'Citizen Digital Twin', path: '/twin', icon: Fingerprint },
    { name: 'Settings', path: '/settings', icon: Settings }
  ];

  return (
    <div className="min-h-screen flex flex-col md:flex-row bg-[#F8FAFC] dark:bg-[#090d16] text-[#111827] dark:text-[#f1f5f9] transition-colors duration-200">
      
      {/* Mobile Top Header Bar */}
      <header className="md:hidden flex items-center justify-between px-6 py-4 bg-white dark:bg-[#0b0f19] border-b border-slate-200/80 dark:border-slate-800/60 sticky top-0 z-40 shadow-sm transition-colors duration-200">
        <div className="flex items-center gap-2">
          <Zap className="h-5 w-5 text-blue-600 fill-blue-600 dark:text-blue-500 dark:fill-blue-500" />
          <span className="font-bold text-lg bg-gradient-to-r from-blue-600 to-emerald-500 dark:from-blue-400 dark:to-emerald-400 bg-clip-text text-transparent">
            SchemeSathi
          </span>
        </div>
        <div className="flex items-center gap-2">
          {/* Theme Toggle Mobile */}
          <button 
            onClick={toggleTheme} 
            className="p-2 rounded-lg bg-slate-100 dark:bg-slate-800 text-slate-500 dark:text-slate-400 hover:text-blue-600 transition"
          >
            {isDarkMode ? <Sun className="h-4 w-4" /> : <Moon className="h-4 w-4" />}
          </button>
          
          {/* Notifications Alert Bell */}
          <div className="relative">
            <button 
              onClick={() => setShowNotifMenu(!showNotifMenu)} 
              className="p-2 rounded-lg bg-slate-100 dark:bg-slate-800 text-slate-500 dark:text-slate-400 hover:text-blue-600 relative transition"
            >
              <Bell className="h-4.5 w-4.5" />
              {unreadNotifs > 0 && (
                <span className="absolute top-1 right-1 h-2 w-2 rounded-full bg-emerald-500 animate-ping" />
              )}
            </button>
          </div>
          
          <button 
            onClick={() => setMobileOpen(!mobileOpen)} 
            className="p-2 rounded-lg bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300"
          >
            {mobileOpen ? <X className="h-4.5 w-4.5" /> : <Menu className="h-4.5 w-4.5" />}
          </button>
        </div>
      </header>

      {/* Slide-out Drawer Hamburger Drawer on Mobile */}
      {mobileOpen && (
        <div className="md:hidden fixed inset-0 z-40 flex">
          {/* Overlay */}
          <div 
            className="fixed inset-0 bg-slate-900/40 dark:bg-black/60 backdrop-blur-xs" 
            onClick={() => setMobileOpen(false)}
          />
          
          {/* Sidebar drawer content */}
          <aside className="relative flex flex-col w-72 max-w-xs bg-white dark:bg-[#070b13] border-r border-slate-200 dark:border-slate-800 p-6 shadow-2xl z-50 animate-slide-in">
            <div className="flex items-center justify-between mb-8">
              <div className="flex items-center gap-2">
                <Zap className="h-6 w-6 text-blue-600 fill-blue-600" />
                <span className="font-bold text-lg text-slate-900 dark:text-white">SchemeSathi</span>
              </div>
              <button 
                onClick={() => setMobileOpen(false)}
                className="p-1.5 rounded-lg bg-slate-100 dark:bg-slate-800 text-slate-500"
              >
                <X className="h-4 w-4" />
              </button>
            </div>

            {user && (
              <div className="mb-6 p-3 rounded-xl bg-slate-50 dark:bg-slate-900 border border-slate-100 dark:border-slate-800 flex items-center gap-3">
                <div className="h-9 w-9 rounded-lg bg-blue-500/10 border border-blue-500/20 flex items-center justify-center text-blue-600 dark:text-blue-400 font-bold text-sm">
                  {user.name.charAt(0)}
                </div>
                <div className="min-w-0 flex-1">
                  <p className="text-xs font-semibold text-slate-800 dark:text-white truncate">{user.name}</p>
                  <p className="text-[10px] text-slate-500 dark:text-slate-400 font-medium capitalize">{user.role}</p>
                </div>
              </div>
            )}

            <nav className="space-y-1 flex-1 overflow-y-auto">
              {navLinks.map((link) => {
                const Icon = link.icon;
                const isActive = pathname === link.path || (link.path !== '/dashboard' && pathname.startsWith(link.path));
                return (
                  <Link
                    key={link.name}
                    href={link.path}
                    onClick={() => setMobileOpen(false)}
                    className={`flex items-center gap-3 px-4 py-2.5 rounded-xl text-xs font-medium transition-all duration-150 ${
                      isActive 
                        ? 'bg-blue-50 dark:bg-blue-600/10 text-blue-600 dark:text-blue-400 border-l-4 border-blue-600 font-bold' 
                        : 'text-slate-500 dark:text-slate-400 hover:text-slate-800 dark:hover:text-slate-200 hover:bg-slate-50 dark:hover:bg-slate-900/40'
                    }`}
                  >
                    <Icon className="h-4 w-4" />
                    {link.name}
                  </Link>
                );
              })}
            </nav>

            <div className="pt-4 border-t border-slate-100 dark:border-slate-800 mt-auto">
              <button
                onClick={handleLogout}
                className="w-full flex items-center gap-3 px-4 py-2.5 text-xs text-slate-500 hover:text-red-500 dark:hover:text-red-400 rounded-xl transition"
              >
                <LogOut className="h-4 w-4" />
                Sign Out
              </button>
            </div>
          </aside>
        </div>
      )}

      {/* Desktop Sidebar (Left side) */}
      <aside className="hidden md:flex flex-col w-64 bg-white dark:bg-[#070b13] border-r border-slate-200/80 dark:border-slate-800/60 h-screen sticky top-0 shadow-sm transition-colors duration-200">
        <div className="flex flex-col flex-1 overflow-y-auto px-5 py-6 justify-between">
          <div>
            {/* Logo Section */}
            <div className="flex items-center gap-2.5 px-3 mb-8">
              <div className="h-9 w-9 rounded-xl bg-blue-500/10 border border-blue-500/20 flex items-center justify-center text-blue-600">
                <Zap className="h-5 w-5 fill-blue-600" />
              </div>
              <div>
                <h1 className="font-extrabold text-base bg-gradient-to-r from-blue-600 via-blue-700 to-emerald-500 dark:from-blue-400 dark:via-blue-500 dark:to-emerald-400 bg-clip-text text-transparent">
                  SchemeSathi
                </h1>
                <p className="text-[9px] text-slate-400 dark:text-slate-500 tracking-wider font-bold uppercase">AI Welfare Officer</p>
              </div>
            </div>

            {/* Profile widget in Sidebar */}
            {user && (
              <div className="mb-6 p-3.5 rounded-2xl bg-slate-50 dark:bg-slate-900/60 border border-slate-100 dark:border-slate-800/50 flex items-center gap-3">
                <div className="h-9 w-9 rounded-xl bg-blue-50 dark:bg-blue-500/10 border border-blue-100 dark:border-blue-500/20 flex items-center justify-center text-blue-600 dark:text-blue-400 font-bold">
                  {user.name.charAt(0)}
                </div>
                <div className="min-w-0 flex-1">
                  <p className="text-xs font-semibold text-slate-800 dark:text-white truncate">{user.name}</p>
                  <div className="flex items-center gap-1 mt-0.5">
                    <ShieldCheck className="h-3 w-3 text-emerald-500 dark:text-emerald-400" />
                    <p className="text-[10px] text-slate-500 dark:text-slate-400 capitalize">{user.role}</p>
                  </div>
                </div>
              </div>
            )}

            {/* Desktop Navigation Links */}
            <nav className="space-y-1">
              {navLinks.map((link) => {
                const Icon = link.icon;
                const isActive = pathname === link.path || (link.path !== '/dashboard' && pathname.startsWith(link.path));
                return (
                  <Link
                    key={link.name}
                    href={link.path}
                    className={`flex items-center gap-3 px-4 py-2.5 rounded-xl text-xs font-semibold transition-all duration-200 ${
                      isActive 
                        ? 'bg-blue-50/80 dark:bg-blue-600/10 text-blue-600 dark:text-blue-400 border-l-4 border-blue-600' 
                        : 'text-slate-500 dark:text-slate-400 hover:text-slate-800 dark:hover:text-slate-200 hover:bg-slate-50 dark:hover:bg-slate-900/30'
                    }`}
                  >
                    <Icon className="h-4 w-4" />
                    {link.name}
                  </Link>
                );
              })}
            </nav>
          </div>

          {/* Theme and Logout controls */}
          <div className="mt-8 space-y-2.5">
            {/* Live agent activity status indicator */}
            {agentLogs.length > 0 && (
              <div className="p-3.5 rounded-xl bg-slate-50 dark:bg-[#0a0f1d] border border-slate-100 dark:border-slate-800 text-[10px] space-y-1.5 shadow-xs">
                <div className="flex items-center gap-1.5 text-emerald-600 dark:text-emerald-400 font-bold uppercase tracking-wider text-[8px]">
                  <span className="h-1.5 w-1.5 rounded-full bg-emerald-500 animate-pulse" />
                  Active Pipelines
                </div>
                <p className="text-slate-500 dark:text-slate-400 leading-normal line-clamp-2">
                  {agentLogs[0].log_text}
                </p>
              </div>
            )}

            <button 
              onClick={toggleTheme}
              className="w-full flex items-center justify-between px-4 py-2.5 text-xs text-slate-500 hover:text-slate-800 dark:hover:text-slate-200 bg-slate-50 dark:bg-slate-900 hover:bg-slate-100 dark:hover:bg-slate-800 border border-slate-100 dark:border-slate-800 rounded-xl transition"
            >
              <span className="font-semibold">Switch Mode</span>
              {isDarkMode ? <Sun className="h-3.5 w-3.5 text-amber-500" /> : <Moon className="h-3.5 w-3.5" />}
            </button>

            <button
              onClick={handleLogout}
              className="w-full flex items-center gap-3 px-4 py-2.5 text-xs text-slate-500 hover:text-red-600 hover:bg-red-50 dark:hover:bg-red-500/5 rounded-xl transition"
            >
              <LogOut className="h-4 w-4" />
              Sign Out
            </button>
          </div>
        </div>
      </aside>

      {/* Main Panel Content Frame */}
      <main className="flex-1 flex flex-col h-screen overflow-hidden">
        
        {/* Desktop Header Navbar */}
        <header className="hidden md:flex items-center justify-between px-8 py-4.5 border-b border-slate-200/80 dark:border-slate-800/60 bg-white/80 dark:bg-[#060a12]/80 backdrop-blur-md sticky top-0 z-30 transition-colors duration-200">
          <div>
            <h2 className="text-sm font-bold text-slate-800 dark:text-white uppercase tracking-wider">
              {navLinks.find(l => pathname === l.path || (l.path !== '/dashboard' && pathname.startsWith(l.path)))?.name || 'Welfare System'}
            </h2>
            <p className="text-[10px] text-slate-400 dark:text-slate-500 mt-0.5">SchemeSathi Welfare Engine V1.0</p>
          </div>

          <div className="flex items-center gap-5">
            {/* Search Input Mock */}
            <div className="relative w-64">
              <input 
                type="text" 
                placeholder="Search schemes or uploads..."
                className="w-full pl-3.5 pr-8 py-1.5 bg-slate-50 dark:bg-slate-900/60 border border-slate-200 dark:border-slate-850 rounded-xl text-xs text-slate-800 dark:text-slate-200 placeholder-slate-400 focus:outline-none focus:border-blue-600 focus:bg-white dark:focus:bg-[#090d16] transition"
              />
              <span className="absolute right-3 top-1/2 -translate-y-1/2 text-[9px] text-slate-400 bg-slate-200/80 dark:bg-slate-800 px-1.5 py-0.5 rounded font-bold">⌘K</span>
            </div>

            {/* Notifications Menu Trigger */}
            <div className="relative">
              <button
                onClick={() => setShowNotifMenu(!showNotifMenu)}
                className="p-2 rounded-xl bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-slate-500 hover:text-slate-800 dark:text-slate-400 dark:hover:text-white transition relative"
              >
                <Bell className="h-4 w-4" />
                {unreadNotifs > 0 && (
                  <span className="absolute top-1 right-1 h-2 w-2 rounded-full bg-emerald-500 animate-ping" />
                )}
              </button>

              {/* Notifications Dropdown */}
              {showNotifMenu && (
                <div className="absolute right-0 mt-3 w-80 rounded-2xl bg-white dark:bg-[#0e1424] border border-slate-200 dark:border-slate-800 shadow-xl py-3 z-50 max-h-96 overflow-y-auto animate-fade-in text-xs">
                  <div className="px-4 pb-2 border-b border-slate-100 dark:border-slate-800 flex justify-between items-center">
                    <span className="font-bold text-slate-800 dark:text-white uppercase text-[10px]">Recent Alerts</span>
                    {unreadNotifs > 0 && <span className="bg-emerald-100 dark:bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 text-[9px] font-bold px-2 py-0.5 rounded-full">{unreadNotifs} New</span>}
                  </div>
                  {notifications.length === 0 ? (
                    <p className="text-slate-400 text-center py-6 px-4">No new notifications.</p>
                  ) : (
                    <div className="divide-y divide-slate-100 dark:divide-slate-800/50">
                      {notifications.map((n) => (
                        <div key={n.id} className={`p-4 hover:bg-slate-50 dark:hover:bg-slate-900/30 transition-all ${!n.read ? 'bg-blue-50/30 dark:bg-blue-950/10' : ''}`}>
                          <div className="flex justify-between items-start gap-2">
                            <h4 className="font-bold text-slate-700 dark:text-slate-200">{n.title}</h4>
                            {!n.read && (
                              <button onClick={() => markAsRead(n.id)} className="text-[9px] text-blue-600 dark:text-blue-400 hover:underline">
                                Read
                              </button>
                            )}
                          </div>
                          <p className="text-[11px] text-slate-500 dark:text-slate-400 mt-1 leading-normal">{n.message}</p>
                          <span className="text-[9px] text-slate-400 dark:text-slate-500 mt-1.5 block">
                            {new Date(n.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                          </span>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              )}
            </div>

            <div className="h-6 w-px bg-slate-200 dark:bg-slate-800" />

            {/* Profile Header Block */}
            {user && (
              <div className="flex items-center gap-3">
                <div className="text-right">
                  <p className="text-xs font-bold text-slate-800 dark:text-white">{user.name}</p>
                  <p className="text-[9px] text-emerald-600 dark:text-emerald-400 font-bold">{user.state || 'India Domicile'}</p>
                </div>
                <div className="h-9 w-9 rounded-xl bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 flex items-center justify-center font-bold text-blue-600 dark:text-blue-400">
                  {user.name.charAt(0)}
                </div>
              </div>
            )}
          </div>
        </header>

        {/* Dynamic Inner Panel Viewport */}
        <div className="flex-1 p-6 md:p-8 bg-[#F8FAFC] dark:bg-[#090d16] overflow-y-auto transition-colors duration-200 pb-20 md:pb-8">
          {children}
        </div>

        {/* Mobile bottom tab navigation bar */}
        <nav className="md:hidden fixed bottom-0 left-0 right-0 z-40 bg-white/95 dark:bg-[#070b13]/95 backdrop-blur-md border-t border-slate-200 dark:border-slate-800 flex justify-around items-center py-2.5 px-4 shadow-lg transition-colors duration-200">
          {[
            { name: 'Home', path: '/dashboard', icon: LayoutDashboard },
            { name: 'AI Chat', path: '/chat', icon: MessageSquare },
            { name: 'Wallet', path: '/wallet', icon: Wallet },
            { name: 'Twin', path: '/twin', icon: Fingerprint },
            { name: 'Settings', path: '/settings', icon: Settings }
          ].map((tab) => {
            const Icon = tab.icon;
            const isActive = pathname === tab.path;
            return (
              <Link
                key={tab.name}
                href={tab.path}
                className={`flex flex-col items-center gap-1 text-[9px] font-semibold transition ${
                  isActive 
                    ? 'text-blue-600 dark:text-blue-400 font-extrabold' 
                    : 'text-slate-400 dark:text-slate-500'
                }`}
              >
                <Icon className="h-4.5 w-4.5" />
                <span>{tab.name}</span>
              </Link>
            );
          })}
        </nav>

      </main>
    </div>
  );
}
