'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Zap, 
  ArrowRight, 
  Play, 
  Users, 
  FileText, 
  TrendingUp, 
  CheckCircle, 
  HelpCircle,
  FileCheck,
  Award,
  Globe2,
  Clock,
  ExternalLink,
  ShieldCheck,
  X,
  Bot
} from 'lucide-react';
import { initialMockUser, sampleDocuments } from '@/utils/mockData';

export default function LandingPage() {
  const router = useRouter();
  const [showDemoVideo, setShowDemoVideo] = useState(false);

  // Seeding method for Try Demo mode
  const handleTryDemo = () => {
    localStorage.setItem('token', 'mock-jwt-token-sathiai');
    localStorage.setItem('user', JSON.stringify(initialMockUser));
    localStorage.setItem('documents', JSON.stringify(sampleDocuments));
    
    // Seed standard agent log timeline for demo
    const demoLogs = [
      {
        agent_name: "Citizen Profiling Agent",
        log_text: "Parsed profile: Student, Domicile: Rajasthan, Family Income: ₹2 Lakhs.",
        timestamp: new Date().toISOString()
      },
      {
        agent_name: "Eligibility Agent",
        log_text: "Eligible for Rajasthan Yuva Vikas Scholarship & Post-Matric Scholarship.",
        timestamp: new Date(Date.now() - 5000).toISOString()
      },
      {
        agent_name: "Document Readiness Agent",
        log_text: "Wallet scanned: 3 verified. 1 missing ('Domicile Certificate').",
        timestamp: new Date(Date.now() - 10000).toISOString()
      }
    ];
    localStorage.setItem('agentLogs', JSON.stringify(demoLogs));
    
    // Redirect instantly to dashboard
    router.push('/dashboard');
  };

  const stats = [
    { label: "Eligible Citizens Assisted", value: "24,000+" },
    { label: "Welfare Schemes Analyzed", value: "30+ Active" },
    { label: "Application Time Saved", value: "70% Less" },
    { label: "Matching Accuracy", value: "98.7%" }
  ];

  const agents = [
    {
      num: "01",
      name: "Citizen Profiling Agent",
      role: "Demographic Parser",
      desc: "Uses natural language and OCR files to construct a structured profile representing your state, income, age, and occupation."
    },
    {
      num: "02",
      name: "Eligibility Engine Agent",
      role: "Rules Matcher",
      desc: "Cross-references your profile against active central/state criteria tables and calculates a matching percentage."
    },
    {
      num: "03",
      name: "Explainability Agent",
      role: "Rationale Auditor",
      desc: "Translates logical criteria results into user-friendly validation checklist boxes showing exactly why you qualify."
    },
    {
      num: "04",
      name: "Document Readiness Agent",
      role: "Wallet Scanner",
      desc: "Correlates scheme requirements with files in your digital wallet, alerting you of missing uploads and scoring your readiness."
    },
    {
      num: "05",
      name: "Roadmap Planner Agent",
      role: "Application Scheduler",
      desc: "Calculates a step-by-step 4-day checklist timeline for document collection, digital registration, and final submission."
    },
    {
      num: "06",
      name: "Life Event Predictor Agent",
      role: "Proactive Recommender",
      desc: "Analyzes lifecycle transitions (e.g. Student -> Graduate) and dynamically highlights upcoming schemes beforehand."
    }
  ];

  return (
    <div className="min-h-screen bg-[#F8FAFC] dark:bg-[#090d16] text-[#111827] dark:text-[#f1f5f9] font-sans transition-colors duration-200">
      
      {/* Navbar */}
      <nav className="fixed top-0 left-0 right-0 z-50 bg-white/70 dark:bg-[#090d16]/75 backdrop-blur-md border-b border-slate-200/80 dark:border-slate-800/60 py-4 px-6 md:px-12 flex justify-between items-center shadow-xs transition-colors duration-200">
        <div className="flex items-center gap-2">
          <Zap className="h-6 w-6 text-blue-600 fill-blue-600 dark:text-blue-500 dark:fill-blue-500" />
          <span className="font-extrabold text-xl tracking-tight bg-gradient-to-r from-blue-600 via-blue-700 to-emerald-500 dark:from-blue-400 dark:via-blue-500 dark:to-emerald-400 bg-clip-text text-transparent">SchemeSathi AI</span>
        </div>
        <div className="hidden md:flex items-center gap-8 text-sm font-semibold text-slate-500 dark:text-slate-400">
          <a href="#problem" className="hover:text-blue-600 dark:hover:text-white transition">Problem</a>
          <a href="#agents" className="hover:text-blue-600 dark:hover:text-white transition">Agent Network</a>
          <a href="#benefits" className="hover:text-blue-600 dark:hover:text-white transition">Benefits</a>
          <a href="#stats" className="hover:text-blue-600 dark:hover:text-white transition">Statistics</a>
        </div>
        <div className="flex items-center gap-3">
          <button 
            onClick={handleTryDemo}
            className="text-xs font-bold text-slate-700 dark:text-slate-200 bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-750 transition px-4 py-2 rounded-xl"
          >
            Try Demo
          </button>
          <Link href="/login" className="text-xs font-bold text-slate-600 dark:text-slate-300 hover:text-blue-600 transition px-3 py-2">
            Sign In
          </Link>
          <Link href="/register" className="text-xs font-bold text-white bg-blue-600 hover:bg-blue-750 transition px-4.5 py-2.5 rounded-xl shadow-md shadow-blue-600/10">
            Get Started
          </Link>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="pt-36 pb-20 px-6 md:px-12 max-w-7xl mx-auto flex flex-col items-center text-center relative overflow-hidden">
        {/* Glow Effects */}
        <div className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[500px] bg-blue-500/5 dark:bg-blue-500/10 rounded-full blur-[120px] pointer-events-none" />
        <div className="absolute top-1/3 left-1/3 w-[300px] h-[300px] bg-emerald-500/5 rounded-full blur-[100px] pointer-events-none" />

        <motion.div
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-blue-50 dark:bg-blue-950/20 border border-blue-100 dark:border-blue-900/30 text-xs text-blue-600 dark:text-blue-400 font-bold mb-6"
        >
          <span className="h-2 w-2 rounded-full bg-blue-600 dark:bg-blue-500 animate-pulse" />
          The Funded Multi-Agent Citizen Platform
        </motion.div>

        <motion.h1
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.1 }}
          className="text-4xl md:text-6xl lg:text-7xl font-extrabold tracking-tight max-w-4xl leading-[1.1] text-slate-900 dark:text-white"
        >
          Meet Your <br className="hidden md:inline" />
          <span className="bg-gradient-to-r from-blue-600 via-blue-700 to-emerald-500 dark:from-blue-400 dark:via-blue-500 dark:to-emerald-400 bg-clip-text text-transparent">AI Welfare Officer</span>
        </motion.h1>

        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.2 }}
          className="text-slate-500 dark:text-slate-400 text-base md:text-lg max-w-2xl mt-6 leading-relaxed"
        >
          Discover eligibility, parse digital wallets, checklist requirements, and generate custom application timelines automatically via autonomous agent workflows.
        </motion.p>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.3 }}
          className="flex flex-col sm:flex-row items-center gap-4 mt-10 w-full sm:w-auto"
        >
          <button 
            onClick={handleTryDemo}
            className="w-full sm:w-auto flex items-center justify-center gap-2 text-sm font-bold text-white bg-blue-600 hover:bg-blue-700 transition px-8 py-4 rounded-2xl shadow-lg shadow-blue-600/10"
          >
            Launch Demo Mode
            <ArrowRight className="h-4.5 w-4.5" />
          </button>
          
          <button 
            onClick={() => setShowDemoVideo(true)}
            className="w-full sm:w-auto flex items-center justify-center gap-2 text-sm font-bold text-slate-700 dark:text-slate-300 bg-white dark:bg-slate-900 hover:bg-slate-50 dark:hover:bg-slate-850 border border-slate-200 dark:border-slate-800 transition px-8 py-4 rounded-2xl shadow-xs"
          >
            <Play className="h-4 w-4 fill-slate-500 dark:fill-slate-400 text-slate-500 dark:text-slate-400" />
            Watch Framework
          </button>
        </motion.div>
      </section>

      {/* Stats Board */}
      <section id="stats" className="py-12 max-w-6xl mx-auto px-6">
        <div className="p-8 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800/80 shadow-md grid grid-cols-2 lg:grid-cols-4 gap-8">
          {stats.map((stat, idx) => (
            <div key={idx} className="text-center">
              <p className="text-3xl md:text-4xl font-extrabold text-blue-600 dark:text-white">{stat.value}</p>
              <p className="text-xs text-slate-500 dark:text-slate-400 mt-2 font-semibold">{stat.label}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Problem Statement Section */}
      <section id="problem" className="py-20 bg-slate-50 dark:bg-[#070b13] border-y border-slate-200/80 dark:border-slate-900/60 px-6">
        <div className="max-w-6xl mx-auto grid md:grid-cols-2 gap-12 items-center">
          <div>
            <h2 className="text-3xl font-extrabold text-slate-900 dark:text-white">Why Welfare Support Remains Unused</h2>
            <p className="text-slate-500 dark:text-slate-400 mt-4 leading-relaxed text-sm">
              Government information is scattered across 40+ departments. Portals are complicated, criteria limits are difficult to understand, and document formats are confusing.
            </p>
            <div className="space-y-4 mt-8">
              {[
                "Citizens lack structured updates on schemes they qualify for.",
                "Complex, administrative eligibility rules matrices.",
                "No instant validation of files before submissions.",
                "Unpredictable timelines for gathering required certificates."
              ].map((item, idx) => (
                <div key={idx} className="flex gap-3 items-start">
                  <CheckCircle className="h-5 w-5 text-emerald-500 dark:text-emerald-400 shrink-0 mt-0.5" />
                  <span className="text-slate-700 dark:text-slate-300 text-sm font-semibold">{item}</span>
                </div>
              ))}
            </div>
          </div>
          
          <div className="grid grid-cols-2 gap-4">
            {[
              { title: "Fragmented", desc: "Guidelines are hidden deep inside department pages.", color: "border-red-200 bg-red-50/50 text-red-600" },
              { title: "Complex Rules", desc: "Multi-layered parameters cause false rejections.", color: "border-red-200 bg-red-50/50 text-red-600" },
              { title: "Unaware Domiciles", desc: "Over 60% of eligible students miss deadlines.", color: "border-red-200 bg-red-50/50 text-red-600" },
              { title: "Agent Solution", desc: "Automated extraction and verification handles the hurdles.", color: "border-emerald-200 bg-emerald-50/50 text-emerald-600" }
            ].map((card, idx) => (
              <div key={idx} className={`p-6 rounded-2xl border ${card.color} shadow-xs`}>
                <h3 className="font-extrabold text-lg">{card.title}</h3>
                <p className="text-xs text-slate-500 dark:text-slate-400 mt-2 leading-relaxed">{card.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Multi-Agent Architecture Section */}
      <section id="agents" className="py-24 max-w-7xl mx-auto px-6">
        <div className="text-center max-w-3xl mx-auto mb-16">
          <h2 className="text-3xl md:text-4xl font-extrabold text-slate-900 dark:text-white">Six Collaborating Welfare Agents</h2>
          <p className="text-slate-500 dark:text-slate-400 mt-4 leading-relaxed text-sm">
            Our autonomous network runs sequential audits of your status and files, providing real-time eligibility updates.
          </p>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {agents.map((agent) => (
            <div key={agent.num} className="p-6 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 hover:border-blue-500 dark:hover:border-blue-500/40 shadow-xs hover:shadow-md transition duration-200 group">
              <div className="flex justify-between items-center mb-6">
                <span className="text-xs font-bold text-blue-600 dark:text-blue-400 bg-blue-50 dark:bg-blue-500/10 px-2.5 py-1 rounded-md">{agent.role}</span>
                <span className="text-3xl font-black text-slate-200 dark:text-slate-850 group-hover:text-blue-500/20 transition-all">{agent.num}</span>
              </div>
              <h3 className="font-bold text-slate-900 dark:text-white text-lg group-hover:text-blue-600 dark:group-hover:text-blue-400 transition">{agent.name}</h3>
              <p className="text-xs text-slate-500 dark:text-slate-400 mt-2 leading-relaxed">{agent.desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Benefits Section */}
      <section id="benefits" className="py-20 bg-slate-50 dark:bg-[#070b13] border-y border-slate-200 dark:border-slate-900/60 px-6">
        <div className="max-w-6xl mx-auto text-center">
          <h2 className="text-3xl font-extrabold text-slate-900 dark:text-white">Why Citizens Use SchemeSathi</h2>
          <p className="text-slate-500 dark:text-slate-400 mt-4 max-w-xl mx-auto text-sm">
            We are not just a list of links. We verify and prepare you.
          </p>

          <div className="grid md:grid-cols-3 gap-8 mt-12">
            {[
              { title: "Central & State Rules", desc: "Cross-checks central databases and specific domicile updates instantly.", icon: Globe2 },
              { title: "OCR File Auditor", desc: "Upload reports or certificates. The agent scans inputs and flags missing credentials.", icon: FileCheck },
              { title: "Milestone Roadmaps", desc: "Designs a customized checklist timeline so you collect papers and apply step-by-step.", icon: Clock }
            ].map((benefit, idx) => {
              const Icon = benefit.icon;
              return (
                <div key={idx} className="p-8 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-left shadow-xs">
                  <div className="h-12 w-12 rounded-xl bg-blue-50 dark:bg-blue-500/10 flex items-center justify-center text-blue-600 dark:text-blue-400 mb-6">
                    <Icon className="h-6 w-6" />
                  </div>
                  <h3 className="font-bold text-slate-900 dark:text-white text-lg">{benefit.title}</h3>
                  <p className="text-xs text-slate-500 dark:text-slate-400 mt-3 leading-relaxed">{benefit.desc}</p>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* CTA Footer */}
      <section className="py-24 text-center px-6 relative overflow-hidden">
        <div className="absolute inset-0 bg-blue-500/5 blur-[120px] pointer-events-none" />
        <h2 className="text-3xl md:text-5xl font-extrabold text-slate-900 dark:text-white">Discover Your Welfare Support</h2>
        <p className="text-slate-500 dark:text-slate-400 mt-4 max-w-xl mx-auto text-sm leading-relaxed">
          Test SchemeSathi right away. Use Demo mode or create a sandbox profile to verify eligibility in under 30 seconds.
        </p>
        <div className="mt-8 flex justify-center gap-4">
          <button 
            onClick={handleTryDemo}
            className="flex items-center gap-2 text-sm font-bold text-white bg-blue-600 hover:bg-blue-700 transition px-8 py-4 rounded-2xl shadow-lg shadow-blue-600/10"
          >
            Launch Demo Mode
            <ArrowRight className="h-4.5 w-4.5" />
          </button>
        </div>
      </section>

      {/* Demo Modal */}
      <AnimatePresence>
        {showDemoVideo && (
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex items-center justify-center p-6 bg-slate-900/40 dark:bg-black/85 backdrop-blur-xs"
          >
            <motion.div 
              initial={{ scale: 0.95 }}
              animate={{ scale: 1 }}
              exit={{ scale: 0.95 }}
              className="relative w-full max-w-2xl rounded-3xl bg-white dark:bg-[#0c101b] border border-slate-200 dark:border-slate-800 overflow-hidden shadow-2xl p-6 md:p-8 text-left text-slate-800 dark:text-white"
            >
              <button 
                onClick={() => setShowDemoVideo(false)}
                className="absolute top-4 right-4 p-2 text-slate-500 hover:text-slate-800 dark:text-slate-400 dark:hover:text-white rounded-lg bg-slate-100 dark:bg-slate-900"
              >
                <X className="h-4 w-4" />
              </button>
              
              <h3 className="font-extrabold text-lg md:text-xl mb-1 flex items-center gap-2 text-slate-900 dark:text-white">
                <Bot className="h-5 w-5 text-blue-600" /> Multi-Agent Welfare Platform
              </h3>
              <p className="text-xs text-slate-500 dark:text-slate-400 mb-6">Learn how profiling, rules evaluator, and wallet audit agents coordinate.</p>
              
              <div className="aspect-video w-full rounded-2xl bg-slate-50 dark:bg-[#05070e] border border-slate-200 dark:border-slate-800 flex flex-col items-center justify-center gap-4 relative overflow-hidden group">
                <div className="h-14 w-14 rounded-full bg-blue-50 dark:bg-blue-500/10 border border-blue-200 dark:border-blue-500/30 flex items-center justify-center text-blue-600 dark:text-blue-500">
                  <Play className="h-5 w-5 fill-blue-600 text-blue-600" />
                </div>
                <p className="text-xs font-bold text-slate-700 dark:text-slate-300">Run Simulator Walkthrough</p>
                <p className="text-[11px] text-slate-500 dark:text-slate-400 px-6 text-center max-w-sm">No backend setup required. Launch instantly using the preloaded sandbox demo mode credentials.</p>
                <button 
                  onClick={handleTryDemo}
                  className="mt-2 text-xs font-bold text-white bg-blue-600 hover:bg-blue-750 px-5 py-2.5 rounded-xl transition"
                >
                  Enter Demo Workspace
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Footer */}
      <footer className="border-t border-slate-200 dark:border-slate-800/60 bg-white dark:bg-[#04070d] py-12 px-6 text-center text-slate-400 dark:text-slate-500 text-xs transition-colors duration-200">
        <div className="max-w-6xl mx-auto flex flex-col sm:flex-row justify-between items-center gap-6">
          <p>© 2026 SchemeSathi AI. Multi-Agent Citizen Welfare Portal.</p>
          <div className="flex gap-6">
            <a href="#" className="hover:text-blue-600 dark:hover:text-slate-300">Privacy Policy</a>
            <a href="#" className="hover:text-blue-600 dark:hover:text-slate-300">Terms of Service</a>
            <a href="#" className="hover:text-blue-600 dark:hover:text-slate-300">Disclaimer</a>
          </div>
        </div>
      </footer>

    </div>
  );
}
