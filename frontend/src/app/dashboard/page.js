'use client';

import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { 
  Users, 
  FileText, 
  TrendingUp, 
  CheckCircle2, 
  AlertCircle, 
  MapPin, 
  Briefcase, 
  GraduationCap, 
  Coins, 
  Calendar,
  Sparkles,
  ArrowRight,
  Activity,
  Edit2,
  Save,
  MessageSquare
} from 'lucide-react';
import SidebarLayout from '@/components/SidebarLayout';
import { api } from '@/utils/api';
import Link from 'next/link';

export default function DashboardPage() {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [editingProfile, setEditingProfile] = useState(false);
  const [profileForm, setProfileForm] = useState({
    age: '',
    gender: 'Male',
    income: '',
    state: '',
    education: 'Undergraduate',
    occupation: 'Student'
  });
  const [savingProfile, setSavingProfile] = useState(false);

  useEffect(() => {
    loadDashboard();
  }, []);

  const loadDashboard = async () => {
    try {
      setLoading(true);
      const res = await api.getDashboard();
      setData(res.data);
      if (res.data.profile) {
        setProfileForm({
          age: res.data.profile.age || '',
          gender: res.data.profile.gender || 'Male',
          income: res.data.profile.income || '',
          state: res.data.profile.state || '',
          education: res.data.profile.education || 'Undergraduate',
          occupation: res.data.profile.occupation || 'Student'
        });
      }
    } catch (err) {
      console.error("Dashboard error:", err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleSaveProfile = async (e) => {
    e.preventDefault();
    setSavingProfile(true);
    try {
      await api.updateProfile(profileForm);
      // Re-trigger agents matching via a welcome chat or standard update
      // For demo smoothness, update local profile state, then re-orchestrate dynamically
      await api.runAgentChat("Update profile variables.", []);
      await loadDashboard();
      setEditingProfile(false);
    } catch (err) {
      console.error(err);
    } finally {
      setSavingProfile(false);
    }
  };

  if (loading) {
    return (
      <SidebarLayout>
        <div className="h-full w-full flex items-center justify-center min-h-[60vh]">
          <div className="flex flex-col items-center gap-3">
            <div className="h-8 w-8 rounded-full border-2 border-t-blue-500 border-r-transparent border-b-transparent border-l-transparent animate-spin" />
            <p className="text-xs text-slate-400 font-semibold tracking-wider uppercase animate-pulse">Orchestrating Dashboard State...</p>
          </div>
        </div>
      </SidebarLayout>
    );
  }

  const { profile, metrics, recentRecommendations, walletSummary, agentActivityFeed, digitalTwin } = data || {};

  return (
    <SidebarLayout>
      <div className="space-y-8 max-w-7xl mx-auto">
        
        {/* Banner Welcome */}
        <div className="p-6 md:p-8 rounded-3xl bg-gradient-to-r from-blue-900/10 via-[#0a0f1d] to-emerald-950/10 border border-slate-800/80 flex flex-col md:flex-row justify-between items-start md:items-center gap-6 relative overflow-hidden">
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_30%_30%,rgba(37,99,235,0.05),transparent)] pointer-events-none" />
          <div>
            <h1 className="text-xl md:text-2xl font-black text-white flex items-center gap-2">
              Welcome Back, {profile?.name || 'Citizen'} <Sparkles className="h-5 w-5 text-emerald-400 fill-emerald-400 animate-pulse" />
            </h1>
            <p className="text-xs text-slate-400 mt-1.5 leading-relaxed max-w-xl">
              Your AI Welfare Officer has analyzed your profile. You currently qualify for <span className="text-emerald-400 font-bold">{metrics?.eligibleSchemesCount} schemes</span>. Review your action checklist or scan missing files below.
            </p>
          </div>
          <Link href="/chat" className="flex items-center gap-2 text-xs font-semibold text-white bg-blue-600 hover:bg-blue-700 transition px-5 py-3 rounded-xl shrink-0 shadow-lg shadow-blue-500/10">
            <MessageSquare className="h-4 w-4" />
            Chat with AI Officer
          </Link>
        </div>

        {/* Dynamic Metric Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {/* Card 1: Matches */}
          <div className="p-6 rounded-2xl bg-[#090e18]/80 border border-slate-900 relative overflow-hidden">
            <div className="absolute top-0 right-0 h-24 w-24 bg-blue-500/5 rounded-full blur-xl pointer-events-none" />
            <p className="text-xs font-semibold text-slate-500 uppercase tracking-widest">Eligible Schemes</p>
            <div className="flex items-baseline gap-2 mt-4">
              <span className="text-4xl font-extrabold text-white">{metrics?.eligibleSchemesCount}</span>
              <span className="text-xs text-emerald-400 font-medium">Matching Matches</span>
            </div>
            <p className="text-[11px] text-slate-400 mt-4 leading-normal">
              Demographic variables mapped perfectly to state & central programs.
            </p>
            <Link href="/schemes" className="flex items-center gap-1.5 text-xs font-bold text-blue-400 hover:text-blue-300 mt-4 group">
              Explore Schemes <ArrowRight className="h-3 w-3 group-hover:translate-x-0.5 transition" />
            </Link>
          </div>

          {/* Card 2: Readiness */}
          <div className="p-6 rounded-2xl bg-[#090e18]/80 border border-slate-900 relative overflow-hidden">
            <div className="absolute top-0 right-0 h-24 w-24 bg-emerald-500/5 rounded-full blur-xl pointer-events-none" />
            <p className="text-xs font-semibold text-slate-500 uppercase tracking-widest">Application Readiness</p>
            <div className="flex items-baseline gap-2 mt-4">
              <span className="text-4xl font-extrabold text-white">{metrics?.applicationReadinessScore}%</span>
              <span className="text-xs text-blue-400 font-medium">Wallet Complete</span>
            </div>
            <div className="w-full bg-slate-900 h-1.5 rounded-full mt-5 overflow-hidden">
              <div className="bg-emerald-500 h-full rounded-full transition-all duration-500" style={{ width: `${metrics?.applicationReadinessScore || 0}%` }} />
            </div>
            <p className="text-[11px] text-slate-400 mt-4 leading-normal">
              Shows how many required documents have been uploaded to your secure wallet.
            </p>
          </div>

          {/* Card 3: Opportunity */}
          <div className="p-6 rounded-2xl bg-[#090e18]/80 border border-slate-900 relative overflow-hidden">
            <div className="absolute top-0 right-0 h-24 w-24 bg-blue-500/5 rounded-full blur-xl pointer-events-none" />
            <p className="text-xs font-semibold text-slate-500 uppercase tracking-widest">AI Opportunity Score</p>
            <div className="flex items-baseline gap-2 mt-4">
              <span className="text-4xl font-extrabold text-white">{metrics?.opportunityScore}</span>
              <span className="text-xs text-emerald-400 font-medium">Optimal Index</span>
            </div>
            <div className="w-full bg-slate-900 h-1.5 rounded-full mt-5 overflow-hidden">
              <div className="bg-blue-500 h-full rounded-full transition-all duration-500" style={{ width: `${metrics?.opportunityScore || 40}%` }} />
            </div>
            <p className="text-[11px] text-slate-400 mt-4 leading-normal">
              Based on lifecycle projections generated by the Life Event Agent.
            </p>
          </div>
        </div>

        {/* Mid Grid: Profile Card vs Document Status */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          
          {/* Profile Card */}
          <div className="p-6 rounded-2xl bg-[#090e18]/60 border border-slate-900/80">
            <div className="flex justify-between items-center pb-4 border-b border-slate-900/60 mb-6">
              <h3 className="font-extrabold text-white text-base">Demographic Digital Profile</h3>
              <button 
                onClick={() => setEditingProfile(!editingProfile)} 
                className="text-slate-400 hover:text-white transition p-1.5 rounded-lg bg-slate-900 border border-slate-800"
              >
                {editingProfile ? <Save className="h-4 w-4" /> : <Edit2 className="h-4 w-4" />}
              </button>
            </div>

            {editingProfile ? (
              <form onSubmit={handleSaveProfile} className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-[10px] font-bold text-slate-500 uppercase mb-1">Age (Years)</label>
                    <input 
                      type="number" 
                      value={profileForm.age} 
                      onChange={(e) => setProfileForm({ ...profileForm, age: e.target.value })}
                      className="w-full px-3 py-2 bg-slate-900 border border-slate-850 rounded-xl text-xs text-white outline-none"
                    />
                  </div>
                  <div>
                    <label className="block text-[10px] font-bold text-slate-500 uppercase mb-1">Gender</label>
                    <select 
                      value={profileForm.gender} 
                      onChange={(e) => setProfileForm({ ...profileForm, gender: e.target.value })}
                      className="w-full px-3 py-2 bg-slate-900 border border-slate-850 rounded-xl text-xs text-white outline-none"
                    >
                      <option>Male</option>
                      <option>Female</option>
                      <option>Other</option>
                    </select>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-[10px] font-bold text-slate-500 uppercase mb-1">Family Income (₹ / Yr)</label>
                    <input 
                      type="number" 
                      value={profileForm.income} 
                      onChange={(e) => setProfileForm({ ...profileForm, income: e.target.value })}
                      className="w-full px-3 py-2 bg-slate-900 border border-slate-850 rounded-xl text-xs text-white outline-none"
                    />
                  </div>
                  <div>
                    <label className="block text-[10px] font-bold text-slate-500 uppercase mb-1">Domicile State</label>
                    <input 
                      type="text" 
                      value={profileForm.state} 
                      onChange={(e) => setProfileForm({ ...profileForm, state: e.target.value })}
                      className="w-full px-3 py-2 bg-slate-900 border border-slate-850 rounded-xl text-xs text-white outline-none"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-[10px] font-bold text-slate-500 uppercase mb-1">Occupation</label>
                    <select 
                      value={profileForm.occupation} 
                      onChange={(e) => setProfileForm({ ...profileForm, occupation: e.target.value })}
                      className="w-full px-3 py-2 bg-slate-900 border border-slate-850 rounded-xl text-xs text-white outline-none"
                    >
                      <option>Student</option>
                      <option>Farmer</option>
                      <option>Entrepreneur</option>
                      <option>Founder</option>
                      <option>Street Vendor</option>
                      <option>Artisan</option>
                      <option>Unemployed</option>
                      <option>Self-Employed</option>
                      <option>Business Owner</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-[10px] font-bold text-slate-500 uppercase mb-1">Education</label>
                    <select 
                      value={profileForm.education} 
                      onChange={(e) => setProfileForm({ ...profileForm, education: e.target.value })}
                      className="w-full px-3 py-2 bg-slate-900 border border-slate-850 rounded-xl text-xs text-white outline-none"
                    >
                      <option>School</option>
                      <option>Undergraduate</option>
                      <option>Postgraduate</option>
                      <option>PhD</option>
                      <option>None</option>
                    </select>
                  </div>
                </div>

                <div className="flex justify-end gap-3 pt-2">
                  <button 
                    type="button" 
                    onClick={() => setEditingProfile(false)} 
                    className="px-4 py-2 text-xs text-slate-400 bg-slate-900 border border-slate-800 rounded-xl"
                  >
                    Cancel
                  </button>
                  <button 
                    type="submit" 
                    disabled={savingProfile} 
                    className="px-4 py-2 text-xs text-white bg-blue-600 hover:bg-blue-700 disabled:bg-blue-800 rounded-xl flex items-center gap-1.5"
                  >
                    {savingProfile ? 'Running Matching Engine...' : 'Recheck Eligibility'}
                  </button>
                </div>
              </form>
            ) : (
              <div className="grid grid-cols-2 gap-y-6 gap-x-4">
                <div className="flex gap-3 items-center">
                  <div className="p-2.5 rounded-xl bg-blue-500/10 border border-blue-500/20 text-blue-400">
                    <Calendar className="h-4.5 w-4.5" />
                  </div>
                  <div>
                    <span className="text-[10px] text-slate-500 font-bold uppercase tracking-wider block">Age Profile</span>
                    <span className="text-sm font-semibold text-white">{profile?.age ? `${profile.age} Years` : 'Not Specified'}</span>
                  </div>
                </div>

                <div className="flex gap-3 items-center">
                  <div className="p-2.5 rounded-xl bg-blue-500/10 border border-blue-500/20 text-blue-400">
                    <Users className="h-4.5 w-4.5" />
                  </div>
                  <div>
                    <span className="text-[10px] text-slate-500 font-bold uppercase tracking-wider block">Gender</span>
                    <span className="text-sm font-semibold text-white">{profile?.gender || 'Not Specified'}</span>
                  </div>
                </div>

                <div className="flex gap-3 items-center">
                  <div className="p-2.5 rounded-xl bg-blue-500/10 border border-blue-500/20 text-blue-400">
                    <Coins className="h-4.5 w-4.5" />
                  </div>
                  <div>
                    <span className="text-[10px] text-slate-500 font-bold uppercase tracking-wider block">Family Income</span>
                    <span className="text-sm font-semibold text-white">{profile?.income ? `₹${profile.income.toLocaleString()}` : 'Not Specified'}</span>
                  </div>
                </div>

                <div className="flex gap-3 items-center">
                  <div className="p-2.5 rounded-xl bg-blue-500/10 border border-blue-500/20 text-blue-400">
                    <MapPin className="h-4.5 w-4.5" />
                  </div>
                  <div>
                    <span className="text-[10px] text-slate-500 font-bold uppercase tracking-wider block">State Domicile</span>
                    <span className="text-sm font-semibold text-white">{profile?.state || 'Not Specified'}</span>
                  </div>
                </div>

                <div className="flex gap-3 items-center">
                  <div className="p-2.5 rounded-xl bg-blue-500/10 border border-blue-500/20 text-blue-400">
                    <Briefcase className="h-4.5 w-4.5" />
                  </div>
                  <div>
                    <span className="text-[10px] text-slate-500 font-bold uppercase tracking-wider block">Occupation</span>
                    <span className="text-sm font-semibold text-white capitalize">{profile?.occupation || 'Not Specified'}</span>
                  </div>
                </div>

                <div className="flex gap-3 items-center">
                  <div className="p-2.5 rounded-xl bg-blue-500/10 border border-blue-500/20 text-blue-400">
                    <GraduationCap className="h-4.5 w-4.5" />
                  </div>
                  <div>
                    <span className="text-[10px] text-slate-500 font-bold uppercase tracking-wider block">Education</span>
                    <span className="text-sm font-semibold text-white">{profile?.education || 'Not Specified'}</span>
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* Document Status */}
          <div className="p-6 rounded-2xl bg-[#090e18]/60 border border-slate-900/80 flex flex-col justify-between">
            <div>
              <h3 className="font-extrabold text-white text-base pb-4 border-b border-slate-900/60 mb-6">Document Wallet Summary</h3>
              
              <div className="grid grid-cols-2 gap-3">
                {[
                  { name: "Aadhaar Card", key: "Aadhaar Card" },
                  { name: "Income Certificate", key: "Income Certificate" },
                  { name: "Student ID", key: "Student ID" },
                  { name: "Domicile Certificate", key: "Domicile Certificate" }
                ].map((doc) => {
                  const uploaded = walletSummary?.uploadedTypes?.includes(doc.key);
                  return (
                    <div key={doc.name} className={`p-3.5 rounded-xl border flex items-center justify-between transition-all ${
                      uploaded 
                        ? 'bg-emerald-500/5 border-emerald-950/40 text-emerald-400' 
                        : 'bg-slate-900/40 border-slate-850/60 text-slate-500'
                    }`}>
                      <span className="text-xs font-semibold">{doc.name}</span>
                      {uploaded ? <CheckCircle2 className="h-4.5 w-4.5 text-emerald-400" /> : <AlertCircle className="h-4.5 w-4.5 text-slate-600" />}
                    </div>
                  );
                })}
              </div>
            </div>

            <Link href="/wallet" className="flex items-center justify-center gap-1.5 text-xs font-bold text-white bg-slate-900 hover:bg-slate-850 border border-slate-800 transition py-3 rounded-xl mt-6">
              Manage Document Wallet <ArrowRight className="h-3.5 w-3.5" />
            </Link>
          </div>
        </div>

        {/* Lower Grid: Agent Log Feed vs Recommendations */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Agent Activity logs */}
          <div className="p-6 rounded-2xl bg-[#090e18]/60 border border-slate-900/80 lg:col-span-2">
            <h3 className="font-extrabold text-white text-base pb-4 border-b border-slate-900/60 mb-6 flex items-center gap-2">
              <Activity className="h-5 w-5 text-blue-500" />
              Agent Workflow Log Feed
            </h3>
            
            <div className="space-y-4 max-h-[350px] overflow-y-auto pr-2">
              {agentActivityFeed?.length === 0 ? (
                <p className="text-xs text-slate-500 text-center py-12">No agent actions recorded yet. Chat with SchemeSathi to trigger the agent workflow.</p>
              ) : (
                agentActivityFeed?.map((log, idx) => (
                  <div key={idx} className="flex gap-4 items-start p-3 rounded-xl bg-slate-900/30 border border-slate-850/40 hover:bg-slate-900/50 transition">
                    <span className="h-2 w-2 rounded-full bg-emerald-400 mt-1.5 shrink-0" />
                    <div className="min-w-0 flex-1">
                      <div className="flex items-center gap-2">
                        <span className="text-xs font-bold text-slate-200 uppercase">{log.agent_name}</span>
                        <span className="text-[10px] text-slate-600 font-medium">
                          {new Date(log.timestamp || log.created_at).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                        </span>
                      </div>
                      <p className="text-[11px] text-slate-400 mt-1 leading-relaxed">{log.log_text}</p>
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>

          {/* Life Event Recommendations */}
          <div className="p-6 rounded-2xl bg-[#090e18]/60 border border-slate-900/80">
            <h3 className="font-extrabold text-white text-base pb-4 border-b border-slate-900/60 mb-6 flex items-center gap-2">
              <TrendingUp className="h-5 w-5 text-emerald-400" />
              Proactive Recommendations
            </h3>

            <div className="space-y-4">
              {recentRecommendations?.length === 0 ? (
                <div className="text-center py-12">
                  <p className="text-xs text-slate-500">No predictions matching your lifecycle milestones.</p>
                  <p className="text-[10px] text-slate-600 mt-1">Chat with AI Officer to forecast stages.</p>
                </div>
              ) : (
                recentRecommendations?.map((rec, idx) => (
                  <div key={idx} className="p-4 rounded-xl bg-slate-900/60 border border-slate-850/60 space-y-2.5">
                    <div className="flex justify-between items-start gap-2">
                      <h4 className="text-xs font-bold text-slate-100">{rec.title}</h4>
                      <span className="text-[9px] font-bold text-blue-400 uppercase bg-blue-500/5 px-2 py-0.5 rounded border border-blue-900/30">{rec.category}</span>
                    </div>
                    <p className="text-[10px] text-slate-400 leading-relaxed">{rec.description}</p>
                    <div className="flex justify-between items-center text-[9px] text-slate-500 border-t border-slate-800/40 pt-2.5">
                      <span>Timeline: <b>{rec.timeline}</b></span>
                      <span>Reward: <b>{rec.reward}</b></span>
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>
        </div>

      </div>
    </SidebarLayout>
  );
}
