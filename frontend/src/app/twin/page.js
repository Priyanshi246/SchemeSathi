'use client';

import React, { useState, useEffect } from 'react';
import { Fingerprint, UserCheck, RefreshCw, Layers, ShieldCheck, MapPin, Briefcase, GraduationCap, Coins, Calendar, Sparkles } from 'lucide-react';
import SidebarLayout from '@/components/SidebarLayout';
import { api } from '@/utils/api';

export default function TwinPage() {
  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadProfile();
  }, []);

  const loadProfile = async () => {
    try {
      setLoading(true);
      const res = await api.getProfile();
      setProfile(res.data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <SidebarLayout>
        <div className="flex justify-center items-center py-20">
          <RefreshCw className="h-6 w-6 text-blue-600 animate-spin" />
        </div>
      </SidebarLayout>
    );
  }

  return (
    <SidebarLayout>
      <div className="space-y-8 max-w-7xl mx-auto text-slate-800 dark:text-slate-200">
        
        {/* Header Title */}
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
          <div>
            <h1 className="text-xl md:text-2xl font-extrabold text-slate-900 dark:text-white flex items-center gap-2">
              <Fingerprint className="h-6 w-6 text-blue-600" />
              Citizen Digital Twin
            </h1>
            <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
              Your demographic identity model. The matching engine queries this twin model against welfare rule criteria automatically.
            </p>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          
          {/* Visual Digital Twin Avatar representation (1 column) */}
          <div className="lg:col-span-1 p-8 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl shadow-3xs flex flex-col items-center justify-between text-center relative overflow-hidden">
            <div className="absolute top-0 right-0 h-32 w-32 bg-blue-500/5 rounded-full blur-xl pointer-events-none" />
            
            <div className="space-y-4">
              <div className="relative">
                <div className="h-24 w-24 rounded-full bg-blue-50 dark:bg-blue-500/10 border-2 border-blue-500 flex items-center justify-center text-blue-600 dark:text-blue-500 mx-auto">
                  <Fingerprint className="h-12 w-12" />
                </div>
                <span className="absolute bottom-0 right-1/2 translate-x-8 bg-emerald-500 text-white p-1 rounded-full border-2 border-white">
                  <UserCheck className="h-3 w-3" />
                </span>
              </div>

              <div>
                <h3 className="font-extrabold text-slate-900 dark:text-white text-base">{profile?.name || 'Aarav Sharma'}</h3>
                <p className="text-[10px] text-emerald-600 dark:text-emerald-450 font-bold uppercase tracking-wider mt-1 flex items-center justify-center gap-1">
                  <ShieldCheck className="h-3.5 w-3.5" /> Certified digital twin
                </p>
              </div>
            </div>

            <div className="mt-8 w-full space-y-4 pt-6 border-t border-slate-100 dark:border-slate-850 text-xs">
              <div className="flex justify-between items-center text-[10.5px]">
                <span className="text-slate-400 font-semibold">Integrations Status</span>
                <span className="text-emerald-600 dark:text-emerald-400 font-bold">Connected</span>
              </div>
              <div className="flex justify-between items-center text-[10.5px]">
                <span className="text-slate-400 font-semibold">UIDAI Aadhaar Verification</span>
                <span className="text-emerald-600 dark:text-emerald-400 font-bold">Passed</span>
              </div>
              <div className="flex justify-between items-center text-[10.5px]">
                <span className="text-slate-400 font-semibold">Income Audit Sync</span>
                <span className="text-emerald-600 dark:text-emerald-400 font-bold">Synced</span>
              </div>
            </div>
          </div>

          {/* Demographic Parameters list (2 columns) */}
          <div className="lg:col-span-2 p-6 md:p-8 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl shadow-3xs flex flex-col justify-between">
            <div>
              <h3 className="font-extrabold text-slate-900 dark:text-white text-sm pb-4 border-b border-slate-100 dark:border-slate-800 mb-6 flex items-center gap-2">
                <Layers className="h-5 w-5 text-blue-600" /> Digital Twin Parameters
              </h3>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                {[
                  { label: "State Domicile", val: profile?.state || 'Rajasthan', icon: MapPin },
                  { label: "Occupation", val: profile?.occupation || 'Student', icon: Briefcase },
                  { label: "Family Income", val: profile?.income ? `₹${profile.income.toLocaleString()}` : '₹200,000', icon: Coins },
                  { label: "Education Status", val: profile?.education || 'Undergraduate', icon: GraduationCap },
                  { label: "Age Milestone", val: profile?.age ? `${profile.age} Years` : '20 Years', icon: Calendar },
                  { label: "Gender Profile", val: profile?.gender || 'Male', icon: Fingerprint }
                ].map((item, index) => {
                  const Icon = item.icon;
                  return (
                    <div key={index} className="flex gap-4 items-center p-4 bg-slate-50 dark:bg-slate-950/40 rounded-2xl border border-slate-150 dark:border-slate-900 shadow-3xs hover:bg-slate-100/50 transition duration-150">
                      <div className="p-2.5 rounded-xl bg-blue-50 dark:bg-blue-500/10 border border-blue-100 dark:border-blue-500/20 text-blue-600 dark:text-blue-400">
                        <Icon className="h-4.5 w-4.5" />
                      </div>
                      <div>
                        <span className="text-[10px] text-slate-400 dark:text-slate-500 font-bold uppercase tracking-wider block">{item.label}</span>
                        <span className="text-xs font-bold text-slate-800 dark:text-white capitalize">{item.val}</span>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>

            <div className="mt-8 p-4.5 bg-blue-50/50 dark:bg-blue-950/15 border border-blue-100 dark:border-blue-900/30 rounded-2xl flex items-start gap-3 text-xs leading-relaxed text-slate-655 dark:text-slate-455">
              <Sparkles className="h-5 w-5 text-blue-600 dark:text-blue-500 shrink-0 mt-0.5" />
              <div>
                <p className="font-bold text-slate-800 dark:text-slate-200">Dynamic Matching Core</p>
                <p className="mt-0.5">Parameters are updated automatically when you upload new certificates to the Document Wallet. The Explainability Agent translates these parameters into qualifying checkmarks on the Schemes page.</p>
              </div>
            </div>
          </div>

        </div>

      </div>
    </SidebarLayout>
  );
}
