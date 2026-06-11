'use client';

import React, { useState } from 'react';
import Link from 'next/link';
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
  ExternalLink
} from 'lucide-react';

export default function LandingPage() {
  const [showDemoVideo, setShowDemoVideo] = useState(false);

  const stats = [
    { label: "Eligible Citizens Assisted", value: "24,000+" },
    { label: "Welfare Schemes Analyzed", value: "30+ Active" },
    { label: "Application Time Saved", value: "70% Less" },
    { label: "Eligibility Matching Accuracy", value: "98.7%" }
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
    <div className="min-h-screen bg-[#070b13] text-slate-100 selection:bg-blue-600/30 font-sans">
      
      {/* Navbar */}
      <nav className="fixed top-0 left-0 right-0 z-50 glass-panel border-b border-slate-900/60 py-4 px-6 md:px-12 flex justify-between items-center">
        <div className="flex items-center gap-2">
          <Zap className="h-6 w-6 text-blue-500 fill-blue-500" />
          <span className="font-extrabold text-xl tracking-tight bg-gradient-to-r from-blue-400 via-blue-500 to-emerald-400 bg-clip-text text-transparent">SchemeSathi AI</span>
        </div>
        <div className="hidden md:flex items-center gap-8 text-sm font-medium text-slate-400">
          <a href="#problem" className="hover:text-white transition">Problem</a>
          <a href="#agents" className="hover:text-white transition">Multi-Agent System</a>
          <a href="#benefits" className="hover:text-white transition">Benefits</a>
          <a href="#stats" className="hover:text-white transition">Statistics</a>
        </div>
        <div className="flex items-center gap-4">
          <Link href="/login" className="text-sm font-medium text-slate-300 hover:text-white transition px-4 py-2">
            Sign In
          </Link>
          <Link href="/register" className="text-sm font-semibold text-white bg-blue-600 hover:bg-blue-700 transition px-5 py-2.5 rounded-xl shadow-lg shadow-blue-500/20">
            Get Started
          </Link>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="pt-32 pb-20 px-6 md:px-12 max-w-7xl mx-auto flex flex-col items-center text-center relative overflow-hidden">
        {/* Glow Effects */}
        <div className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[500px] bg-blue-500/10 rounded-full blur-[120px] pointer-events-none" />
        <div className="absolute top-1/3 left-1/3 w-[300px] h-[300px] bg-emerald-500/5 rounded-full blur-[100px] pointer-events-none" />

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-blue-500/10 border border-blue-500/20 text-xs text-blue-400 font-semibold mb-6"
        >
          <span className="h-1.5 w-1.5 rounded-full bg-blue-500 animate-pulse" />
          Introducing Your AI Welfare Officer
        </motion.div>

        <motion.h1
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.1 }}
          className="text-4xl md:text-6xl lg:text-7xl font-extrabold tracking-tight max-w-4xl leading-[1.1] text-white"
        >
          Meet Your <br className="hidden md:inline" />
          <span className="bg-gradient-to-r from-blue-400 via-blue-500 to-emerald-400 bg-clip-text text-transparent">AI Welfare Officer</span>
        </motion.h1>

        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.2 }}
          className="text-slate-400 text-lg md:text-xl max-w-2xl mt-6 leading-relaxed"
        >
          Discover government schemes, verify eligibility, analyze documents, and receive personalized application guidance through autonomous AI agents.
        </motion.p>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.3 }}
          className="flex flex-col sm:flex-row items-center gap-4 mt-10 w-full sm:w-auto"
        >
          <Link href="/register" className="w-full sm:w-auto flex items-center justify-center gap-2 text-sm font-semibold text-white bg-blue-600 hover:bg-blue-700 transition px-8 py-4 rounded-xl shadow-lg shadow-blue-500/25">
            Get Started
            <ArrowRight className="h-4 w-4" />
          </Link>
          <button 
            onClick={() => setShowDemoVideo(true)}
            className="w-full sm:w-auto flex items-center justify-center gap-2 text-sm font-semibold text-slate-300 hover:text-white bg-slate-900 border border-slate-800 hover:border-slate-700 transition px-8 py-4 rounded-xl"
          >
            <Play className="h-4 w-4 fill-slate-300" />
            Watch Demo
          </button>
        </motion.div>
      </section>

      {/* Problem Statement Section */}
      <section id="problem" className="py-20 bg-[#060a12]/50 border-y border-slate-900/80 px-6">
        <div className="max-w-6xl mx-auto grid md:grid-cols-2 gap-12 items-center">
          <div>
            <h2 className="text-3xl font-extrabold text-white">Why Millions Miss Out on Welfare Benefits</h2>
            <p className="text-slate-400 mt-4 leading-relaxed text-sm">
              Government information is highly fragmented. Portals are complicated, eligibility criteria is difficult to calculate, and documents requirements are confusing. 
            </p>
            <div className="space-y-4 mt-8">
              {[
                "Citizens do not know schemes matching their profiles exist.",
                "Complex, confusing administrative language and jargon.",
                "Lack of verification tools for required application documents.",
                "Complex, manual roadmap timelines."
              ].map((item, idx) => (
                <div key={idx} className="flex gap-3 items-start">
                  <CheckCircle className="h-5 w-5 text-emerald-400 shrink-0 mt-0.5" />
                  <span className="text-slate-300 text-sm">{item}</span>
                </div>
              ))}
            </div>
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div className="p-6 rounded-2xl bg-gradient-to-br from-red-500/5 to-red-500/0 border border-red-500/10">
              <h3 className="font-extrabold text-red-400 text-2xl">Fragmented</h3>
              <p className="text-xs text-slate-400 mt-2 leading-relaxed">Welfare updates are scattered across 40+ departments.</p>
            </div>
            <div className="p-6 rounded-2xl bg-gradient-to-br from-red-500/5 to-red-500/0 border border-red-500/10">
              <h3 className="font-extrabold text-red-400 text-2xl">Complex</h3>
              <p className="text-xs text-slate-400 mt-2 leading-relaxed">Difficult rules lead to wrong assumptions and rejects.</p>
            </div>
            <div className="p-6 rounded-2xl bg-gradient-to-br from-red-500/5 to-red-500/0 border border-red-500/10">
              <h3 className="font-extrabold text-red-400 text-2xl">Unaware</h3>
              <p className="text-xs text-slate-400 mt-2 leading-relaxed">Over 60% of eligible rural citizens remain unaware.</p>
            </div>
            <div className="p-6 rounded-2xl bg-gradient-to-br from-blue-500/5 to-emerald-500/5 border border-emerald-500/15">
              <h3 className="font-extrabold text-emerald-400 text-2xl">Solution</h3>
              <p className="text-xs text-slate-300 mt-2 leading-relaxed">SchemeSathi automates mapping, checks, and guides.</p>
            </div>
          </div>
        </div>
      </section>

      {/* Multi-Agent Architecture Section */}
      <section id="agents" className="py-24 max-w-7xl mx-auto px-6">
        <div className="text-center max-w-3xl mx-auto mb-16">
          <h2 className="text-3xl md:text-4xl font-extrabold text-white">The Multi-Agent Welfare Network</h2>
          <p className="text-slate-400 mt-4 leading-relaxed text-sm">
            Six autonomous, specialized AI agents collaborating dynamically to analyze your status and guide you from eligibility lookup to final submission receipt.
          </p>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {agents.map((agent) => (
            <div key={agent.num} className="p-6 rounded-2xl bg-[#090e18]/80 border border-slate-900 hover:border-blue-500/20 hover:bg-slate-900/30 transition-all duration-300 group">
              <div className="flex justify-between items-center mb-6">
                <span className="text-xs font-semibold text-blue-500 tracking-wider bg-blue-500/5 px-2.5 py-1 rounded-md">{agent.role}</span>
                <span className="text-3xl font-black text-slate-800 group-hover:text-blue-500/20 transition-all">{agent.num}</span>
              </div>
              <h3 className="font-bold text-white text-lg group-hover:text-blue-400 transition">{agent.name}</h3>
              <p className="text-xs text-slate-400 mt-2 leading-relaxed">{agent.desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Benefits Section */}
      <section id="benefits" className="py-20 bg-[#060a12]/50 border-y border-slate-900/60 px-6">
        <div className="max-w-6xl mx-auto text-center">
          <h2 className="text-3xl font-extrabold text-white">Why Choose SchemeSathi AI?</h2>
          <p className="text-slate-400 mt-4 max-w-xl mx-auto text-sm">
            We move beyond simple government directories. We are your interactive guide.
          </p>

          <div className="grid md:grid-cols-3 gap-8 mt-12">
            <div className="p-8 rounded-2xl bg-[#070b13] border border-slate-900 text-left">
              <div className="h-12 w-12 rounded-xl bg-blue-500/10 flex items-center justify-center text-blue-400 mb-6">
                <Globe2 className="h-6 w-6" />
              </div>
              <h3 className="font-bold text-white text-lg">Central & State Mapping</h3>
              <p className="text-xs text-slate-400 mt-3 leading-relaxed">
                Connects demographic parameters to both central government programs and specific state-level updates in one sweep.
              </p>
            </div>
            <div className="p-8 rounded-2xl bg-[#070b13] border border-slate-900 text-left">
              <div className="h-12 w-12 rounded-xl bg-emerald-500/10 flex items-center justify-center text-emerald-400 mb-6">
                <FileCheck className="h-6 w-6" />
              </div>
              <h3 className="font-bold text-white text-lg">AI-Powered OCR Wallet</h3>
              <p className="text-xs text-slate-400 mt-3 leading-relaxed">
                Upload your Aadhaar or Income papers. The platform scans text instantly, validates authenticity, and auto-fills profile details.
              </p>
            </div>
            <div className="p-8 rounded-2xl bg-[#070b13] border border-slate-900 text-left">
              <div className="h-12 w-12 rounded-xl bg-blue-500/10 flex items-center justify-center text-blue-400 mb-6">
                <Clock className="h-6 w-6" />
              </div>
              <h3 className="font-bold text-white text-lg">Actionable Roadmaps</h3>
              <p className="text-xs text-slate-400 mt-3 leading-relaxed">
                Instead of giving static instructions, our planner designs a custom timeline to help you gather papers and submit applications.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section id="stats" className="py-20 max-w-6xl mx-auto px-6">
        <div className="p-8 md:p-12 rounded-3xl bg-gradient-to-r from-blue-950/20 via-[#0a0f1d] to-emerald-950/10 border border-slate-800/80 grid grid-cols-2 lg:grid-cols-4 gap-8">
          {stats.map((stat, idx) => (
            <div key={idx} className="text-center">
              <p className="text-3xl md:text-4xl font-extrabold text-white">{stat.value}</p>
              <p className="text-xs text-slate-500 mt-2 font-medium">{stat.label}</p>
            </div>
          ))}
        </div>
      </section>

      {/* CTA Footer */}
      <section className="py-24 text-center px-6 relative overflow-hidden">
        <div className="absolute inset-0 bg-blue-600/5 blur-[120px] pointer-events-none" />
        <h2 className="text-3xl md:text-5xl font-extrabold text-white">Maximize Your Entitlements Today</h2>
        <p className="text-slate-400 mt-4 max-w-xl mx-auto text-sm leading-relaxed">
          Log in with our preloaded Hackathon credentials instantly to explore 32+ seeded schemes, live agent chat, and document OCR.
        </p>
        <div className="mt-8">
          <Link href="/register" className="inline-flex items-center gap-2 text-sm font-bold text-white bg-blue-600 hover:bg-blue-700 transition px-8 py-4 rounded-xl shadow-lg shadow-blue-500/25">
            Get Started Free
            <ArrowRight className="h-4 w-4" />
          </Link>
        </div>
      </section>

      {/* Demo Video Modal */}
      <AnimatePresence>
        {showDemoVideo && (
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex items-center justify-center p-6 bg-black/80 backdrop-blur-sm"
          >
            <motion.div 
              initial={{ scale: 0.95 }}
              animate={{ scale: 1 }}
              exit={{ scale: 0.95 }}
              className="relative w-full max-w-4xl rounded-3xl bg-[#0c101b] border border-slate-800 overflow-hidden shadow-2xl p-6 md:p-10"
            >
              <button 
                onClick={() => setShowDemoVideo(false)}
                className="absolute top-4 right-4 p-2 text-slate-400 hover:text-white rounded-lg bg-slate-900"
              >
                <X className="h-5 w-5" />
              </button>
              
              <h3 className="font-extrabold text-white text-xl md:text-2xl mb-2">SchemeSathi AI Agent Walkthrough</h3>
              <p className="text-xs text-slate-400 mb-6">See how the Citizen Profiling, Eligibility, and Document Readiness agents coordinate.</p>
              
              {/* Dummy video layout */}
              <div className="aspect-video w-full rounded-2xl bg-[#05070e] border border-slate-800/80 flex flex-col items-center justify-center gap-4 relative overflow-hidden group">
                <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,rgba(37,99,235,0.1),transparent)] pointer-events-none" />
                <div className="h-16 w-16 rounded-full bg-blue-500/10 border border-blue-500/30 flex items-center justify-center text-blue-500 group-hover:scale-110 transition duration-300">
                  <Play className="h-6 w-6 fill-blue-500" />
                </div>
                <p className="text-sm font-semibold text-slate-300">Start Sandbox Interactive Demo Tour</p>
                <p className="text-xs text-slate-500 px-6 text-center max-w-md">Our multi-agent system runs instantly. Sign in with <b>citizen@schemesathi.ai</b> and <b>password123</b> to run a live chat test.</p>
                <Link href="/login" className="mt-2 text-xs font-bold text-white bg-blue-600 hover:bg-blue-700 px-5 py-2.5 rounded-xl transition">
                  Proceed to Login
                </Link>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Footer */}
      <footer className="border-t border-slate-900/60 bg-[#04070d] py-12 px-6 text-center text-slate-500 text-xs">
        <div className="max-w-6xl mx-auto flex flex-col sm:flex-row justify-between items-center gap-6">
          <p>© 2026 SchemeSathi AI. Active Welfare System.</p>
          <div className="flex gap-6">
            <a href="#" className="hover:text-slate-300">Privacy Policy</a>
            <a href="#" className="hover:text-slate-300">Terms of Service</a>
            <a href="#" className="hover:text-slate-300">Government Disclaimer</a>
          </div>
        </div>
      </footer>

    </div>
  );
}
