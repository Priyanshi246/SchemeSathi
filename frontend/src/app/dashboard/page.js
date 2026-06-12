'use client';

import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
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
  MessageSquare,
  RefreshCw,
  Play,
  CheckCircle,
  FileCheck
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

  // Workflow Pipeline Simulation States
  const [isSimulating, setIsSimulating] = useState(false);
  const [activeStep, setActiveStep] = useState(-1);
  const [simLogs, setSimLogs] = useState([]);

  const pipelineSteps = [
    { key: 'profiler', name: "Citizen Profiling Agent", role: "A1: Demographic Extractor", desc: "Constructs digital twin profile from state, income, and parameters." },
    { key: 'eligibility', name: "Eligibility Agent", role: "A2: Rules Evaluator", desc: "Evaluates matching rules matrix across 30+ central/state welfare schemes." },
    { key: 'explainability', name: "Explainability Agent", role: "A3: Rationale Auditor", desc: "Generates logic checklist showing exactly why you qualify or are missing rules." },
    { key: 'document', name: "Document Readiness Agent", role: "A4: Wallet Checker", desc: "Scans uploaded documents in wallet and scores overall readiness." },
    { key: 'roadmap', name: "Roadmap Planner Agent", role: "A5: Process Scheduler", desc: "Plots chronological step-by-step checklist timeline for registration." },
    { key: 'lifeEvent', name: "Life Event Agent", role: "A6: Future Forecaster", desc: "Predicts future milestone schemes (e.g. Student transition to Graduate)." }
  ];

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

  const runSimulation = () => {
    if (isSimulating) return;
    
    setIsSimulating(true);
    setActiveStep(0);
    setSimLogs([
      { agent: "System", text: "Initializing Multi-Agent orchestration pipeline...", time: "Just now" }
    ]);

    const runNext = (step) => {
      if (step >= pipelineSteps.length) {
        setTimeout(() => {
          setIsSimulating(false);
          setActiveStep(-1);
          setSimLogs(prev => [
            { agent: "System", text: "Workflow complete. Dashboard eligibility indexes synced successfully.", time: "Just now" },
            ...prev
          ]);
          loadDashboard();
        }, 1500);
        return;
      }

      setTimeout(() => {
        const stepDetails = pipelineSteps[step];
        let stepText = "";
        
        switch (stepDetails.key) {
          case 'profiler':
            stepText = `Digital twin parsed: Domicile=${profileForm.state}, Occupation=${profileForm.occupation}, Income=₹${parseInt(profileForm.income).toLocaleString()}.`;
            break;
          case 'eligibility':
            stepText = "Evaluated parameters against guidelines. Dynamic matching completed.";
            break;
          case 'explainability':
            stepText = "Qualifying checklist compiled: All requirements verified successfully.";
            break;
          case 'document':
            stepText = "Cross-referenced document wallet. 3 of 4 required documents found.";
            break;
          case 'roadmap':
            stepText = "Day 1-4 roadmap checklist calculated and preloaded.";
            break;
          case 'lifeEvent':
            stepText = "Projected 1 future opportunity: Graduate Apprentice Support (12 months timeline).";
            break;
          default:
            stepText = "Agent operation finished.";
        }

        setSimLogs(prev => [
          { agent: stepDetails.name, text: stepText, time: "Just now" },
          ...prev
        ]);

        setActiveStep(step + 1);
        runNext(step + 1);
      }, 1800);
    };

    runNext(0);
  };

  const handleSaveProfile = async (e) => {
    e.preventDefault();
    setSavingProfile(true);
    try {
      await api.updateProfile(profileForm);
      // Run agent pipeline on change
      runSimulation();
      setEditingProfile(false);
    } catch (err) {
      console.error(err);
    } finally {
      setSavingProfile(false);
    }
  };

  const preloadDemoData = () => {
    setProfileForm({
      age: 20,
      gender: 'Male',
      income: 200000,
      state: 'Rajasthan',
      education: 'Undergraduate',
      occupation: 'Student'
    });
    
    // Seed in local storage
    localStorage.setItem('user', JSON.stringify({
      name: "Aarav Sharma",
      email: "citizen@schemesathi.ai",
      role: "Citizen",
      state: "Rajasthan",
      occupation: "Student",
      age: 20,
      gender: "Male",
      income: 200000,
      education: "Undergraduate"
    }));

    // Trigger simulation automatically to show coordination
    setTimeout(() => {
      runSimulation();
    }, 100);
  };

  if (loading) {
    return (
      <SidebarLayout>
        <div className="h-full w-full flex items-center justify-center min-h-[60vh]">
          <div className="flex flex-col items-center gap-3">
            <RefreshCw className="h-8 w-8 text-blue-600 dark:text-blue-500 animate-spin" />
            <p className="text-xs text-slate-500 dark:text-slate-400 font-bold tracking-wider uppercase animate-pulse">Orchestrating Dashboard State...</p>
          </div>
        </div>
      </SidebarLayout>
    );
  }

  const { profile, metrics, recentRecommendations, walletSummary } = data || {};

  return (
    <SidebarLayout>
      <div className="space-y-8 max-w-7xl mx-auto">
        
        {/* Banner Welcome & Try Demo */}
        <div className="p-6 md:p-8 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 flex flex-col lg:flex-row justify-between items-start lg:items-center gap-6 shadow-sm hover:shadow-md transition duration-200 relative overflow-hidden">
          <div className="absolute top-0 right-0 h-40 w-40 bg-blue-500/5 dark:bg-blue-500/10 rounded-full blur-2xl pointer-events-none" />
          
          <div className="space-y-1">
            <h1 className="text-xl md:text-2xl font-extrabold text-slate-900 dark:text-white flex items-center gap-2">
              Welcome, {profile?.name || 'Citizen'} <Sparkles className="h-5 w-5 text-emerald-500 fill-emerald-500 animate-pulse" />
            </h1>
            <p className="text-xs text-slate-500 dark:text-slate-400 leading-relaxed max-w-xl">
              Your AI Welfare Officer is active. You qualify for <span className="text-emerald-600 dark:text-emerald-400 font-bold">{metrics?.eligibleSchemesCount} matches</span>. Review document checklists or run the multi-agent pipeline below.
            </p>
          </div>
          
          <div className="flex items-center gap-3">
            <button 
              onClick={preloadDemoData}
              className="flex items-center gap-2 text-xs font-bold text-slate-700 dark:text-slate-200 bg-slate-100 hover:bg-slate-200 dark:bg-slate-850 dark:hover:bg-slate-800 transition px-5 py-3 rounded-2xl shadow-xs"
            >
              <Play className="h-3.5 w-3.5 fill-slate-600 text-slate-600 dark:fill-slate-300 dark:text-slate-300" />
              Try Demo Mode
            </button>
            <Link 
              href="/chat" 
              className="flex items-center gap-2 text-xs font-bold text-white bg-blue-600 hover:bg-blue-755 transition px-5 py-3 rounded-2xl shadow-md shadow-blue-600/10"
            >
              <MessageSquare className="h-4 w-4" />
              Chat AI Officer
            </Link>
          </div>
        </div>

        {/* Dynamic Metric Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {/* Card 1: Matches */}
          <div className="p-6 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-xs relative overflow-hidden">
            <div className="absolute top-0 right-0 h-24 w-24 bg-blue-500/5 rounded-full blur-xl pointer-events-none" />
            <p className="text-[10px] font-bold text-slate-400 dark:text-slate-500 uppercase tracking-widest">Eligible Schemes</p>
            <div className="flex items-baseline gap-2 mt-4">
              <span className="text-4xl font-black text-slate-900 dark:text-white">{metrics?.eligibleSchemesCount}</span>
              <span className="text-xs text-emerald-600 dark:text-emerald-400 font-semibold">Verified Matches</span>
            </div>
            <p className="text-xs text-slate-500 dark:text-slate-400 mt-4 leading-normal">
              Demographic variables mapped perfectly to state & central welfare rules.
            </p>
            <Link href="/schemes" className="flex items-center gap-1.5 text-xs font-bold text-blue-600 dark:text-blue-400 hover:underline mt-4 group">
              Explore Schemes <ArrowRight className="h-3 w-3 group-hover:translate-x-0.5 transition" />
            </Link>
          </div>

          {/* Card 2: Readiness */}
          <div className="p-6 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-xs relative overflow-hidden">
            <div className="absolute top-0 right-0 h-24 w-24 bg-emerald-500/5 rounded-full blur-xl pointer-events-none" />
            <p className="text-[10px] font-bold text-slate-400 dark:text-slate-500 uppercase tracking-widest">Wallet Readiness</p>
            <div className="flex items-baseline gap-2 mt-4">
              <span className="text-4xl font-black text-slate-900 dark:text-white">{metrics?.applicationReadinessScore}%</span>
              <span className="text-xs text-blue-600 dark:text-blue-400 font-semibold">Files Complete</span>
            </div>
            <div className="w-full bg-slate-100 dark:bg-slate-800 h-2 rounded-full mt-5 overflow-hidden">
              <div className="bg-emerald-500 h-full rounded-full transition-all duration-500" style={{ width: `${metrics?.applicationReadinessScore || 0}%` }} />
            </div>
            <p className="text-xs text-slate-500 dark:text-slate-400 mt-4 leading-normal">
              Documents successfully uploaded and verified in your secure wallet.
            </p>
          </div>

          {/* Card 3: Opportunity */}
          <div className="p-6 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-xs relative overflow-hidden">
            <div className="absolute top-0 right-0 h-24 w-24 bg-blue-500/5 rounded-full blur-xl pointer-events-none" />
            <p className="text-[10px] font-bold text-slate-400 dark:text-slate-500 uppercase tracking-widest">Welfare Forecast</p>
            <div className="flex items-baseline gap-2 mt-4">
              <span className="text-4xl font-black text-slate-900 dark:text-white">{metrics?.opportunityScore}</span>
              <span className="text-xs text-emerald-600 dark:text-emerald-400 font-semibold">Future Index</span>
            </div>
            <div className="w-full bg-slate-100 dark:bg-slate-800 h-2 rounded-full mt-5 overflow-hidden">
              <div className="bg-blue-600 h-full rounded-full transition-all duration-500" style={{ width: `${metrics?.opportunityScore || 40}%` }} />
            </div>
            <p className="text-xs text-slate-500 dark:text-slate-400 mt-4 leading-normal">
              Based on upcoming life events parsed by the Lifecycle Predictor Agent.
            </p>
          </div>
        </div>

        {/* Flagship Feature: Agent Workflow Visualization */}
        <div className="p-6 md:p-8 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-xs">
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center pb-4 border-b border-slate-100 dark:border-slate-800 mb-6 gap-4">
            <div>
              <h3 className="font-extrabold text-slate-900 dark:text-white text-base flex items-center gap-2">
                <Activity className="h-5 w-5 text-blue-600" />
                Autonomous Multi-Agent pipeline
              </h3>
              <p className="text-xs text-slate-400 mt-0.5">Visualize profiling, rule checking, audit, and forecast agents collaborating in real time.</p>
            </div>
            
            <button
              onClick={runSimulation}
              disabled={isSimulating}
              className="flex items-center gap-2 text-xs font-bold text-white bg-blue-600 hover:bg-blue-700 disabled:bg-blue-400 transition px-5 py-2.5 rounded-xl shadow-md shadow-blue-600/5 shrink-0"
            >
              {isSimulating ? (
                <>
                  <RefreshCw className="h-4.5 w-4.5 animate-spin" /> Simulating Agent Steps...
                </>
              ) : (
                <>
                  <Play className="h-4 w-4 fill-white" /> Run Agent Pipeline
                </>
              )}
            </button>
          </div>

          {/* Workflow nodes */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-6 gap-4 relative">
            {pipelineSteps.map((step, idx) => {
              const isCurrent = isSimulating && idx === activeStep;
              const isDone = isSimulating ? idx < activeStep : !isSimulating && activeStep === -1;
              const isIdle = isSimulating && idx > activeStep;

              return (
                <div 
                  key={step.key} 
                  className={`p-4.5 rounded-2xl border transition-all duration-200 flex flex-col justify-between h-40 ${
                    isCurrent 
                      ? 'bg-amber-500/5 border-amber-500 scale-102 shadow-md shadow-amber-500/5' 
                      : isDone 
                        ? 'bg-emerald-500/5 border-emerald-500 shadow-xs' 
                        : 'bg-slate-50 dark:bg-slate-900/50 border-slate-200 dark:border-slate-850 opacity-70'
                  }`}
                >
                  <div className="flex justify-between items-center">
                    <span className={`h-2.5 w-2.5 rounded-full ${
                      isCurrent ? 'bg-amber-500 animate-pulse' : isDone ? 'bg-emerald-500' : 'bg-slate-400'
                    }`} />
                    <span className="text-[10px] font-bold text-slate-400 uppercase">A{idx + 1}</span>
                  </div>
                  
                  <div>
                    <h4 className={`text-xs font-extrabold leading-tight mt-3 ${
                      isCurrent ? 'text-amber-600 dark:text-amber-400' : isDone ? 'text-emerald-600 dark:text-emerald-400' : 'text-slate-800 dark:text-slate-300'
                    }`}>{step.name}</h4>
                    <p className="text-[10px] text-slate-500 mt-1 leading-normal line-clamp-2">{step.desc}</p>
                  </div>
                  
                  <div className="mt-3 text-[9px] font-bold uppercase tracking-wider text-slate-400">
                    {isCurrent ? 'Processing...' : isDone ? 'Completed ✓' : 'Idle'}
                  </div>
                </div>
              );
            })}
          </div>

          {/* Live pipeline logs feed */}
          {simLogs.length > 0 && (
            <div className="mt-6 p-4 bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-900 rounded-2xl max-h-40 overflow-y-auto font-mono text-[10px] space-y-2">
              {simLogs.map((log, index) => (
                <div key={index} className="flex justify-between gap-4">
                  <span className="text-slate-400 shrink-0">[{log.agent}]</span>
                  <span className="text-slate-700 dark:text-slate-300 flex-1">{log.text}</span>
                  <span className="text-slate-400 text-right shrink-0">{log.time}</span>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Lower Grid: Domicile Profile vs Document Status */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          
          {/* Profile Card */}
          <div className="p-6 md:p-8 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-xs flex flex-col justify-between">
            <div>
              <div className="flex justify-between items-center pb-4 border-b border-slate-100 dark:border-slate-800 mb-6">
                <h3 className="font-extrabold text-slate-900 dark:text-white text-base">Demographic Profile</h3>
                <button 
                  onClick={() => setEditingProfile(!editingProfile)} 
                  className="text-slate-500 hover:text-slate-800 dark:text-slate-400 dark:hover:text-white transition p-2 rounded-xl bg-slate-50 dark:bg-slate-850 border border-slate-200 dark:border-slate-800 shadow-xs"
                >
                  {editingProfile ? <Save className="h-4.5 w-4.5 text-blue-600" /> : <Edit2 className="h-4.5 w-4.5" />}
                </button>
              </div>

              {editingProfile ? (
                <form onSubmit={handleSaveProfile} className="space-y-4">
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-[10px] font-bold text-slate-400 dark:text-slate-500 uppercase mb-1">Age (Years)</label>
                      <input 
                        type="number" 
                        value={profileForm.age} 
                        onChange={(e) => setProfileForm({ ...profileForm, age: e.target.value })}
                        className="w-full px-3 py-2.5 bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-850 rounded-xl text-xs text-slate-800 dark:text-white outline-none focus:border-blue-600 transition"
                      />
                    </div>
                    <div>
                      <label className="block text-[10px] font-bold text-slate-400 dark:text-slate-500 uppercase mb-1">Gender</label>
                      <select 
                        value={profileForm.gender} 
                        onChange={(e) => setProfileForm({ ...profileForm, gender: e.target.value })}
                        className="w-full px-3 py-2.5 bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-850 rounded-xl text-xs text-slate-800 dark:text-white outline-none focus:border-blue-600 transition"
                      >
                        <option>Male</option>
                        <option>Female</option>
                        <option>Other</option>
                      </select>
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-[10px] font-bold text-slate-400 dark:text-slate-500 uppercase mb-1">Income (₹ / Yr)</label>
                      <input 
                        type="number" 
                        value={profileForm.income} 
                        onChange={(e) => setProfileForm({ ...profileForm, income: e.target.value })}
                        className="w-full px-3 py-2.5 bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-850 rounded-xl text-xs text-slate-800 dark:text-white outline-none focus:border-blue-600 transition"
                      />
                    </div>
                    <div>
                      <label className="block text-[10px] font-bold text-slate-400 dark:text-slate-500 uppercase mb-1">State Domicile</label>
                      <input 
                        type="text" 
                        value={profileForm.state} 
                        onChange={(e) => setProfileForm({ ...profileForm, state: e.target.value })}
                        className="w-full px-3 py-2.5 bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-850 rounded-xl text-xs text-slate-800 dark:text-white outline-none focus:border-blue-600 transition"
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-[10px] font-bold text-slate-400 dark:text-slate-500 uppercase mb-1">Occupation</label>
                      <select 
                        value={profileForm.occupation} 
                        onChange={(e) => setProfileForm({ ...profileForm, occupation: e.target.value })}
                        className="w-full px-3 py-2.5 bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-850 rounded-xl text-xs text-slate-800 dark:text-white outline-none focus:border-blue-600 transition"
                      >
                        <option>Student</option>
                        <option>Farmer</option>
                        <option>Entrepreneur</option>
                        <option>Artisan</option>
                        <option>Street Vendor</option>
                        <option>Self-Employed</option>
                      </select>
                    </div>
                    <div>
                      <label className="block text-[10px] font-bold text-slate-400 dark:text-slate-500 uppercase mb-1">Education</label>
                      <select 
                        value={profileForm.education} 
                        onChange={(e) => setProfileForm({ ...profileForm, education: e.target.value })}
                        className="w-full px-3 py-2.5 bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-850 rounded-xl text-xs text-slate-800 dark:text-white outline-none focus:border-blue-600 transition"
                      >
                        <option>School</option>
                        <option>Undergraduate</option>
                        <option>Postgraduate</option>
                        <option>PhD</option>
                        <option>None</option>
                      </select>
                    </div>
                  </div>

                  <div className="flex justify-end gap-2 pt-2">
                    <button 
                      type="button" 
                      onClick={() => setEditingProfile(false)} 
                      className="px-4 py-2 text-xs font-bold text-slate-500 bg-slate-100 hover:bg-slate-200 rounded-xl transition"
                    >
                      Cancel
                    </button>
                    <button 
                      type="submit" 
                      disabled={savingProfile} 
                      className="px-4 py-2 text-xs font-bold text-white bg-blue-600 hover:bg-blue-755 disabled:bg-blue-800 rounded-xl flex items-center gap-1.5 transition"
                    >
                      {savingProfile ? 'Running Engine...' : 'Sync Variables'}
                    </button>
                  </div>
                </form>
              ) : (
                <div className="grid grid-cols-2 gap-y-6 gap-x-4">
                  {[
                    { label: "Age Profile", val: profile?.age ? `${profile.age} Years` : '—', icon: Calendar },
                    { label: "Gender", val: profile?.gender || '—', icon: Users },
                    { label: "Family Income", val: profile?.income ? `₹${profile.income.toLocaleString()}` : '—', icon: Coins },
                    { label: "State Domicile", val: profile?.state || '—', icon: MapPin },
                    { label: "Occupation", val: profile?.occupation || '—', icon: Briefcase },
                    { label: "Education Status", val: profile?.education || '—', icon: GraduationCap }
                  ].map((field, index) => {
                    const Icon = field.icon;
                    return (
                      <div key={index} className="flex gap-3 items-center">
                        <div className="p-2.5 rounded-xl bg-blue-50 dark:bg-blue-500/10 border border-blue-100 dark:border-blue-500/20 text-blue-600 dark:text-blue-400">
                          <Icon className="h-4.5 w-4.5" />
                        </div>
                        <div>
                          <span className="text-[10px] text-slate-400 dark:text-slate-500 font-bold uppercase tracking-wider block">{field.label}</span>
                          <span className="text-xs font-bold text-slate-800 dark:text-white capitalize">{field.val}</span>
                        </div>
                      </div>
                    );
                  })}
                </div>
              )}
            </div>
            
            {!editingProfile && (
              <p className="text-[10px] text-slate-400 dark:text-slate-500 mt-6 leading-relaxed italic border-t border-slate-100 dark:border-slate-850 pt-4">
                * Edit details to instantly trigger rules checks across active central and state scholarship guidelines.
              </p>
            )}
          </div>

          {/* Document Status Wallet Summary */}
          <div className="p-6 md:p-8 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-xs flex flex-col justify-between">
            <div>
              <h3 className="font-extrabold text-slate-900 dark:text-white text-base pb-4 border-b border-slate-100 dark:border-slate-800 mb-6 flex items-center gap-2">
                <FileCheck className="h-5 w-5 text-emerald-600" /> Secure Wallet Status
              </h3>
              
              <div className="grid grid-cols-2 gap-3.5">
                {[
                  { name: "Aadhaar Card", key: "Aadhaar Card" },
                  { name: "Income Certificate", key: "Income Certificate" },
                  { name: "Student ID", key: "Student ID" },
                  { name: "Domicile Certificate", key: "Domicile Certificate" }
                ].map((doc) => {
                  const uploaded = walletSummary?.uploadedTypes?.includes(doc.key);
                  return (
                    <div key={doc.name} className={`p-4 rounded-2xl border flex items-center justify-between transition-all duration-200 ${
                      uploaded 
                        ? 'bg-emerald-50 dark:bg-emerald-500/5 border-emerald-200 dark:border-emerald-950/40 text-emerald-600 dark:text-emerald-400' 
                        : 'bg-slate-50 dark:bg-slate-900/40 border-slate-200 dark:border-slate-850/60 text-slate-400'
                    }`}>
                      <span className="text-xs font-bold">{doc.name}</span>
                      {uploaded ? <CheckCircle2 className="h-4.5 w-4.5 text-emerald-600 dark:text-emerald-400" /> : <AlertCircle className="h-4.5 w-4.5 text-slate-300 dark:text-slate-700" />}
                    </div>
                  );
                })}
              </div>
            </div>

            <Link href="/wallet" className="flex items-center justify-center gap-2 text-xs font-bold text-slate-700 dark:text-slate-200 bg-slate-50 hover:bg-slate-100 dark:bg-slate-850 dark:hover:bg-slate-800 border border-slate-200 dark:border-slate-800 transition py-3.5 rounded-2xl mt-8 shadow-xs">
              Manage Secure Wallet <ArrowRight className="h-4 w-4" />
            </Link>
          </div>
        </div>

        {/* Lower Grid: Proactive Lifecycle Recommendations */}
        <div className="p-6 md:p-8 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-xs">
          <h3 className="font-extrabold text-slate-900 dark:text-white text-base pb-4 border-b border-slate-100 dark:border-slate-800 mb-6 flex items-center gap-2">
            <TrendingUp className="h-5 w-5 text-blue-600" /> Proactive Lifecycle Forecasts
          </h3>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {recentRecommendations?.map((rec, idx) => (
              <div key={idx} className="p-5 rounded-2xl bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-900 hover:border-blue-500 dark:hover:border-blue-500/30 transition shadow-xs space-y-3">
                <div className="flex justify-between items-center gap-2">
                  <h4 className="text-xs font-bold text-slate-800 dark:text-slate-100">{rec.title}</h4>
                  <span className="text-[9px] font-bold text-blue-600 dark:text-blue-400 uppercase bg-blue-50 dark:bg-blue-500/10 px-2 py-0.5 rounded border border-blue-100 dark:border-blue-900/30">{rec.category}</span>
                </div>
                <p className="text-[11px] text-slate-500 dark:text-slate-400 leading-relaxed">{rec.description}</p>
                <div className="flex justify-between items-center text-[10px] text-slate-400 border-t border-slate-200 dark:border-slate-900 pt-3 font-semibold">
                  <span>Timeline: <b className="text-slate-700 dark:text-slate-300">{rec.timeline}</b></span>
                  <span>Benefits: <b className="text-emerald-600 dark:text-emerald-400">{rec.reward}</b></span>
                </div>
              </div>
            ))}
          </div>
        </div>

      </div>
    </SidebarLayout>
  );
}
