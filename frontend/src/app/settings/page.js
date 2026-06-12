'use client';

import React, { useState, useEffect } from 'react';
import { Settings, Sun, Moon, Shield, Lock, Bell, User, Key, RefreshCw } from 'lucide-react';
import SidebarLayout from '@/components/SidebarLayout';

export default function SettingsPage() {
  const [isDarkMode, setIsDarkMode] = useState(false);
  const [profile, setProfile] = useState({ name: '', email: '' });
  const [notifPreferences, setNotifPreferences] = useState({
    eligibilityMatch: true,
    walletAlerts: true,
    roadmapUpdates: false
  });

  useEffect(() => {
    // Set theme state on mount
    const isDark = document.documentElement.classList.contains('dark');
    setIsDarkMode(isDark);

    // Get user profile details
    const storedUser = localStorage.getItem('user');
    if (storedUser) {
      try {
        setProfile(JSON.parse(storedUser));
      } catch (_) {}
    }
  }, []);

  const toggleThemeSetting = () => {
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

  const handleSavePreferences = (e) => {
    e.preventDefault();
    alert("Preferences saved successfully!");
  };

  return (
    <SidebarLayout>
      <div className="space-y-8 max-w-4xl mx-auto text-slate-800 dark:text-slate-200">
        
        {/* Header Title */}
        <div>
          <h1 className="text-xl md:text-2xl font-extrabold text-slate-900 dark:text-white flex items-center gap-2">
            <Settings className="h-6 w-6 text-blue-600" />
            Portal Settings
          </h1>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">Manage themes, profile details, notifications, and security keys.</p>
        </div>

        <div className="space-y-6">
          
          {/* Theme card */}
          <div className="p-6 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl shadow-3xs">
            <h3 className="font-extrabold text-slate-900 dark:text-white text-sm pb-3 border-b border-slate-100 dark:border-slate-800 mb-4 flex items-center gap-2">
              {isDarkMode ? <Moon className="h-4.5 w-4.5 text-blue-600" /> : <Sun className="h-4.5 w-4.5 text-blue-600" />} Theme Preferences
            </h3>
            
            <div className="flex items-center justify-between">
              <div>
                <p className="text-xs font-bold text-slate-850 dark:text-slate-200">Theme Toggle</p>
                <p className="text-[10px] text-slate-450 dark:text-slate-500 mt-0.5">Toggle between light default theme and developer dark modes.</p>
              </div>
              
              <button
                onClick={toggleThemeSetting}
                className="flex items-center gap-2 px-4.5 py-2.5 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-950 text-xs font-bold transition hover:bg-slate-100"
              >
                {isDarkMode ? (
                  <>
                    <Sun className="h-4 w-4 text-amber-500" /> Light Default
                  </>
                ) : (
                  <>
                    <Moon className="h-4 w-4 text-blue-600" /> Dark Mode
                  </>
                )}
              </button>
            </div>
          </div>

          {/* Profile details */}
          <div className="p-6 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl shadow-3xs">
            <h3 className="font-extrabold text-slate-900 dark:text-white text-sm pb-3 border-b border-slate-100 dark:border-slate-800 mb-4 flex items-center gap-2">
              <User className="h-4.5 w-4.5 text-blue-600" /> Account Settings
            </h3>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs font-semibold">
              <div>
                <label className="block text-[10px] font-bold text-slate-400 dark:text-slate-500 uppercase mb-2">Display Name</label>
                <input 
                  type="text" 
                  value={profile?.name || ''} 
                  disabled
                  placeholder="Demo User"
                  className="w-full px-3.5 py-2.5 bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-xl outline-none text-slate-400 cursor-not-allowed"
                />
              </div>
              <div>
                <label className="block text-[10px] font-bold text-slate-400 dark:text-slate-500 uppercase mb-2">Email Address</label>
                <input 
                  type="email" 
                  value={profile?.email || ''} 
                  disabled
                  placeholder="user@schemesathi.ai"
                  className="w-full px-3.5 py-2.5 bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-xl outline-none text-slate-400 cursor-not-allowed"
                />
              </div>
            </div>
            <p className="text-[10px] text-slate-400 dark:text-slate-550 mt-4 italic">* Edit profile parameters from the Demographic Digital Profile card on the Dashboard.</p>
          </div>

          {/* Notification toggles */}
          <div className="p-6 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl shadow-3xs">
            <h3 className="font-extrabold text-slate-900 dark:text-white text-sm pb-3 border-b border-slate-100 dark:border-slate-800 mb-4 flex items-center gap-2">
              <Bell className="h-4.5 w-4.5 text-blue-600" /> AI Agent Notification Settings
            </h3>

            <form onSubmit={handleSavePreferences} className="space-y-4 text-xs font-semibold">
              <div className="space-y-3">
                {[
                  { key: 'eligibilityMatch', label: "New Eligibility Matches", desc: "Notify me when the Eligibility Agent matches new guidelines tables." },
                  { key: 'walletAlerts', label: "Wallet Readiness Warnings", desc: "Alert me when the Wallet Auditor flags missing files." }
                ].map(pref => (
                  <div key={pref.key} className="flex items-center justify-between">
                    <div>
                      <p className="text-slate-850 dark:text-slate-200">{pref.label}</p>
                      <p className="text-[10px] text-slate-450 dark:text-slate-500 font-medium mt-0.5">{pref.desc}</p>
                    </div>
                    <input 
                      type="checkbox"
                      checked={notifPreferences[pref.key]}
                      onChange={(e) => setNotifPreferences({ ...notifPreferences, [pref.key]: e.target.checked })}
                      className="h-4 w-4 text-blue-600 rounded focus:ring-blue-500 border-slate-300"
                    />
                  </div>
                ))}
              </div>

              <button 
                type="submit"
                className="px-4.5 py-2.5 text-xs font-bold text-white bg-blue-600 hover:bg-blue-700 rounded-xl shadow-xs transition"
              >
                Save Preferences
              </button>
            </form>
          </div>

          {/* API keys mock card */}
          <div className="p-6 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl shadow-3xs">
            <h3 className="font-extrabold text-slate-900 dark:text-white text-sm pb-3 border-b border-slate-100 dark:border-slate-800 mb-4 flex items-center gap-2">
              <Key className="h-4.5 w-4.5 text-blue-600" /> Developer Sandbox Keys
            </h3>
            
            <div className="flex justify-between items-center text-xs">
              <div>
                <p className="font-bold text-slate-855 dark:text-slate-200">Sandbox API Token</p>
                <p className="font-mono text-[9px] text-slate-400 mt-1 bg-slate-50 dark:bg-slate-950 p-2 border border-slate-200 dark:border-slate-850 rounded-lg">eyJuYW1lIjoiRGVtb0NpdGl6ZW4iLCJpc3MiOiJTY2hlbWVTYXRoaSIsImlhdCI6MTYyMzQ4NDYyNX0...</p>
              </div>
              
              <button 
                onClick={() => alert("Simulated: JWT key refreshed.")}
                className="p-2.5 rounded-xl border border-slate-200 dark:border-slate-800 hover:bg-slate-50 dark:hover:bg-slate-950 text-slate-500 hover:text-slate-800 transition shadow-3xs"
              >
                <RefreshCw className="h-4 w-4" />
              </button>
            </div>
          </div>

        </div>

      </div>
    </SidebarLayout>
  );
}
