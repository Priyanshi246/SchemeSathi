'use client';

import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Send, 
  Mic, 
  MicOff, 
  Activity, 
  Bot, 
  User, 
  Zap, 
  ShieldCheck, 
  HelpCircle,
  FileCheck,
  Compass,
  ArrowRight,
  RefreshCw,
  GitPullRequest
} from 'lucide-react';
import SidebarLayout from '@/components/SidebarLayout';
import { api } from '@/utils/api';
import Link from 'next/link';

export default function ChatPage() {
  const [messages, setMessages] = useState([
    { id: 1, sender: 'assistant', text: "Hello! I am your AI Welfare Officer. Tell me about yourself, such as your education, state, family income, and career goals. I will extract your details, analyze eligibility, review document wallet readiness, and map a custom application plan. For example, try typing:\n\n'I am a second-year IT student from Rajasthan and my family income is ₹2 lakh.'" }
  ]);
  const [inputText, setInputText] = useState('');
  const [isListening, setIsListening] = useState(false);
  const [loading, setLoading] = useState(false);
  const [profile, setProfile] = useState({
    age: null,
    gender: null,
    income: null,
    state: null,
    education: null,
    occupation: null
  });

  // Agents status tracker for workflow visualization
  const [agentStatus, setAgentStatus] = useState({
    profiler: 'idle', // idle, running, completed
    eligibility: 'idle',
    explainability: 'idle',
    document: 'idle',
    roadmap: 'idle',
    lifeEvent: 'idle'
  });

  const chatEndRef = useRef(null);
  const recognitionRef = useRef(null);

  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, agentStatus]);

  useEffect(() => {
    // Initial fetch of profile details
    api.getDashboard().then(res => {
      setProfile(res.data.profile);
    }).catch(err => console.log(err));

    // Setup speech recognition
    if (typeof window !== 'undefined') {
      const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
      if (SpeechRecognition) {
        const rec = new SpeechRecognition();
        rec.continuous = false;
        rec.interimResults = false;
        rec.lang = 'en-IN'; // English (India) works great for Indian accents

        rec.onresult = (event) => {
          const transcript = event.results[0][0].transcript;
          setInputText(prev => prev + ' ' + transcript);
          setIsListening(false);
        };

        rec.onerror = (e) => {
          console.error("Speech Recognition Error:", e);
          setIsListening(false);
        };

        rec.onend = () => {
          setIsListening(false);
        };

        recognitionRef.current = rec;
      }
    }
  }, []);

  const handleVoiceInput = () => {
    if (!recognitionRef.current) {
      alert("Voice speech recognition is not supported in this browser. Please use Google Chrome or Microsoft Edge.");
      return;
    }

    if (isListening) {
      recognitionRef.current.stop();
      setIsListening(false);
    } else {
      setIsListening(true);
      recognitionRef.current.start();
    }
  };

  const handleSend = async (e) => {
    e.preventDefault();
    if (!inputText.trim() || loading) return;

    const userPrompt = inputText.trim();
    setInputText('');
    
    // Add user message
    const newMsgId = messages.length + 1;
    setMessages(prev => [...prev, { id: newMsgId, sender: 'user', text: userPrompt }]);
    setLoading(true);

    // Reset Agent statuses to idle
    setAgentStatus({
      profiler: 'running',
      eligibility: 'idle',
      explainability: 'idle',
      document: 'idle',
      roadmap: 'idle',
      lifeEvent: 'idle'
    });

    try {
      // Execute backend orchestration workflow
      const res = await api.runAgentChat(userPrompt, messages);
      const output = res.data;

      // Simulate sequential workflow steps on frontend to show coordination
      setTimeout(() => {
        setAgentStatus(prev => ({ ...prev, profiler: 'completed', eligibility: 'running' }));
        if (output.profile) setProfile(output.profile);
      }, 1500);

      setTimeout(() => {
        setAgentStatus(prev => ({ ...prev, eligibility: 'completed', explainability: 'running' }));
      }, 2500);

      setTimeout(() => {
        setAgentStatus(prev => ({ ...prev, explainability: 'completed', document: 'running' }));
      }, 3500);

      setTimeout(() => {
        setAgentStatus(prev => ({ ...prev, document: 'completed', roadmap: 'running' }));
      }, 4500);

      setTimeout(() => {
        setAgentStatus(prev => ({ ...prev, roadmap: 'completed', lifeEvent: 'running' }));
      }, 5500);

      setTimeout(() => {
        setAgentStatus(prev => ({ ...prev, lifeEvent: 'completed' }));
        
        // Final assistant response construction based on agent outcomes
        const matched = output.matchedSchemes;
        let responseText = "";
        
        if (matched && matched.length > 0) {
          responseText = `I have updated your digital twin profile and mapped it against active policies. Good news! You are eligible for **${matched.length} government schemes**. Here are the top matches:\n\n`;
          
          matched.forEach((m, idx) => {
            responseText += `${idx + 1}. **${m.scheme_name}** (${m.match_percentage}% Match)\n`;
            responseText += `   • **Benefits:** ${m.benefits}\n`;
            responseText += `   • **Eligibility Check:** ${m.explanation.summary}\n`;
            responseText += `   • **Document Wallet Checklist:** ${m.documentStatus.available.length} uploaded, ${m.documentStatus.missing.length} missing (Readiness: ${m.documentStatus.readinessScore}%)\n\n`;
          });
          
          responseText += `I have created custom, day-by-day application roadmaps for these schemes. Navigate to the **Schemes Explorer** page to check out the details!`;
        } else {
          responseText = `I analyzed your profile details against our guidelines database, but could not locate schemes matching your specific parameters with high confidence. Try checking your profile parameters in the Dashboard, or type details about your farm holdings, business ideas, or academic studies to search again.`;
        }

        setMessages(prev => [...prev, { 
          id: prev.length + 1, 
          sender: 'assistant', 
          text: responseText,
          sources: matched?.map(m => m.scheme_name)
        }]);
        setLoading(false);
      }, 6500);

    } catch (err) {
      console.error(err);
      setMessages(prev => [...prev, { 
        id: prev.length + 1, 
        sender: 'assistant', 
        text: `Error during agent processing: ${err.message || 'Workflow timeout'}. Please try again.` 
      }]);
      setLoading(false);
      setAgentStatus({
        profiler: 'idle',
        eligibility: 'idle',
        explainability: 'idle',
        document: 'idle',
        roadmap: 'idle',
        lifeEvent: 'idle'
      });
    }
  };

  const getAgentBadge = (status) => {
    switch (status) {
      case 'running':
        return <span className="h-2 w-2 rounded-full bg-amber-500 animate-pulse active-agent-glow" />;
      case 'completed':
        return <span className="h-2 w-2 rounded-full bg-emerald-500" />;
      default:
        return <span className="h-2 w-2 rounded-full bg-slate-700" />;
    }
  };

  const getAgentTextClass = (status) => {
    switch (status) {
      case 'running':
        return 'text-amber-400 font-bold';
      case 'completed':
        return 'text-emerald-400 font-semibold';
      default:
        return 'text-slate-500';
    }
  };

  return (
    <SidebarLayout>
      <div className="grid grid-cols-1 lg:grid-cols-4 gap-8 h-[calc(100vh-140px)] max-w-7xl mx-auto">
        
        {/* Left: Chat Area (3 columns on lg) */}
        <div className="lg:col-span-3 flex flex-col h-full bg-[#090e18]/40 border border-slate-900/80 rounded-3xl overflow-hidden relative">
          
          {/* Header */}
          <div className="px-6 py-4 border-b border-slate-900 flex items-center gap-3 bg-[#0a0f1c]/90">
            <Bot className="h-6 w-6 text-blue-500" />
            <div>
              <h3 className="font-extrabold text-sm text-white">AI Welfare Officer</h3>
              <p className="text-[10px] text-slate-500 mt-0.5">Autonomous Agent Network Active</p>
            </div>
          </div>

          {/* Messages Feed */}
          <div className="flex-1 overflow-y-auto p-6 space-y-6">
            {messages.map((msg) => (
              <div 
                key={msg.id} 
                className={`flex gap-4 max-w-2xl ${msg.sender === 'user' ? 'ml-auto flex-row-reverse' : ''}`}
              >
                {/* Icon */}
                <div className={`h-8 w-8 rounded-xl shrink-0 flex items-center justify-center border font-bold text-xs ${
                  msg.sender === 'user' 
                    ? 'bg-blue-600/10 border-blue-500/20 text-blue-400' 
                    : 'bg-slate-950 border-slate-800 text-slate-400'
                }`}>
                  {msg.sender === 'user' ? 'U' : <Bot className="h-4.5 w-4.5 text-blue-400" />}
                </div>

                {/* Text Bubble */}
                <div className={`p-4 rounded-2xl border text-sm leading-relaxed whitespace-pre-line ${
                  msg.sender === 'user'
                    ? 'bg-blue-600/10 border-blue-500/15 text-blue-100 rounded-tr-none shadow-[inset_0_0_15px_rgba(37,99,235,0.05)]'
                    : 'bg-slate-900/60 border-slate-850/60 text-slate-200 rounded-tl-none'
                }`}>
                  {msg.text}
                  
                  {/* Sources display */}
                  {msg.sources && msg.sources.length > 0 && (
                    <div className="mt-4 pt-3 border-t border-slate-800/40 flex flex-wrap gap-2 items-center text-[10px]">
                      <span className="text-slate-500 font-bold uppercase tracking-wider">Citations:</span>
                      {msg.sources.map((s, i) => (
                        <span key={i} className="px-2 py-0.5 rounded bg-slate-950 border border-slate-800 text-slate-400">
                          {s}
                        </span>
                      ))}
                    </div>
                  )}
                </div>
              </div>
            ))}

            {/* Simulated Live Agent Actions Bubble while loading */}
            {loading && (
              <div className="flex gap-4 max-w-2xl">
                <div className="h-8 w-8 rounded-xl bg-slate-950 border border-slate-800 flex items-center justify-center font-bold text-xs text-slate-500">
                  <Activity className="h-4.5 w-4.5 text-amber-500 animate-spin" />
                </div>
                <div className="p-4 rounded-2xl border bg-slate-900/50 border-slate-850/60 text-slate-400 rounded-tl-none w-full space-y-3">
                  <div className="flex items-center gap-2 text-xs font-semibold">
                    <RefreshCw className="h-3.5 w-3.5 text-amber-500 animate-spin" />
                    <span>Agent Workflow Processing...</span>
                  </div>
                  
                  <div className="space-y-1.5 pl-5 border-l border-slate-800 text-[11px]">
                    <p className={agentStatus.profiler === 'running' ? 'text-amber-400 font-bold' : 'text-slate-500'}>
                      ● Profiling Agent: Extracting structured JSON keys from text...
                    </p>
                    <p className={agentStatus.eligibility === 'running' ? 'text-amber-400 font-bold' : 'text-slate-500'}>
                      ● Eligibility Agent: Evaluating state/income criteria matrices...
                    </p>
                    <p className={agentStatus.explainability === 'running' ? 'text-amber-400 font-bold' : 'text-slate-500'}>
                      ● Explainability Agent: Audit guidelines rationale checks...
                    </p>
                    <p className={agentStatus.document === 'running' ? 'text-amber-400 font-bold' : 'text-slate-500'}>
                      ● Document Agent: Cross-referencing missing wallet papers...
                    </p>
                    <p className={agentStatus.roadmap === 'running' ? 'text-amber-400 font-bold' : 'text-slate-500'}>
                      ● Roadmap Agent: Charting application day checklists...
                    </p>
                    <p className={agentStatus.lifeEvent === 'running' ? 'text-amber-400 font-bold' : 'text-slate-500'}>
                      ● Life Event Agent: Estimating lifecycle opportunities...
                    </p>
                  </div>

                  <div className="flex gap-1 items-center pt-2">
                    <span className="h-2 w-2 rounded-full bg-blue-500 dot-blink" />
                    <span className="h-2 w-2 rounded-full bg-blue-500 dot-blink" />
                    <span className="h-2 w-2 rounded-full bg-blue-500 dot-blink" />
                  </div>
                </div>
              </div>
            )}
            
            <div ref={chatEndRef} />
          </div>

          {/* Prompt Form */}
          <form onSubmit={handleSend} className="p-4 border-t border-slate-900 bg-[#0a0f1c]/90 flex gap-3 items-center">
            <button
              type="button"
              onClick={handleVoiceInput}
              className={`p-3 rounded-xl border transition-all ${
                isListening 
                  ? 'bg-red-500/10 border-red-500 text-red-500 animate-pulse' 
                  : 'bg-slate-900 hover:bg-slate-850 border-slate-800 text-slate-400 hover:text-slate-200'
              }`}
              title="Speak to AI Officer"
            >
              {isListening ? <MicOff className="h-5 w-5" /> : <Mic className="h-5 w-5" />}
            </button>
            
            <input
              type="text"
              value={inputText}
              onChange={(e) => setInputText(e.target.value)}
              placeholder={isListening ? "Listening... Speak now" : "Tell me about your status (e.g. state, occupation, income)..."}
              className="flex-1 px-4 py-3 bg-[#070b13] border border-slate-800 focus:border-blue-500 rounded-xl text-sm text-white placeholder-slate-600 outline-none transition"
              disabled={loading}
            />

            <button
              type="submit"
              disabled={!inputText.trim() || loading}
              className="p-3 bg-blue-600 hover:bg-blue-700 disabled:bg-blue-800/50 disabled:cursor-not-allowed text-white rounded-xl shadow-lg transition"
            >
              <Send className="h-5 w-5" />
            </button>
          </form>

        </div>

        {/* Right: Dynamic Profile Summary & Agent visualizer (1 col) */}
        <div className="hidden lg:flex flex-col gap-6 h-full overflow-y-auto">
          
          {/* Extracted Profile */}
          <div className="p-5 rounded-2xl bg-[#090e18]/60 border border-slate-900/80">
            <h4 className="font-extrabold text-white text-xs uppercase tracking-wider pb-3 border-b border-slate-900 mb-4 flex items-center gap-1.5">
              <User className="h-4.5 w-4.5 text-blue-400" />
              Extracted Profile
            </h4>
            
            <div className="space-y-3 text-xs">
              {[
                { label: "Age", val: profile?.age ? `${profile.age} Years` : '—' },
                { label: "Gender", val: profile?.gender || '—' },
                { label: "Income", val: profile?.income ? `₹${profile.income.toLocaleString()}` : '—' },
                { label: "State", val: profile?.state || '—' },
                { label: "Occupation", val: profile?.occupation || '—' },
                { label: "Education", val: profile?.education || '—' }
              ].map((p, idx) => (
                <div key={idx} className="flex justify-between items-center py-1.5 border-b border-slate-850/30">
                  <span className="text-slate-500 font-medium">{p.label}</span>
                  <span className="text-slate-300 font-bold capitalize">{p.val}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Agent Workflow Connections */}
          <div className="p-5 rounded-2xl bg-[#090e18]/60 border border-slate-900/80 flex-1 flex flex-col">
            <h4 className="font-extrabold text-white text-xs uppercase tracking-wider pb-3 border-b border-slate-900 mb-5 flex items-center gap-1.5">
              <GitPullRequest className="h-4.5 w-4.5 text-emerald-400" />
              Agent Workflow Pipeline
            </h4>

            <div className="flex-1 flex flex-col justify-around text-xs pl-2 relative">
              {/* Connected Line */}
              <div className="absolute left-3.5 top-5 bottom-5 w-px bg-slate-800 z-0" />
              
              {[
                { key: 'profiler', name: "Citizen Profiling Agent", role: "A1: Demographic Extractor" },
                { key: 'eligibility', name: "Eligibility Agent", role: "A2: Rules Evaluator" },
                { key: 'explainability', name: "Explainability Agent", role: "A3: Rationale Auditor" },
                { key: 'document', name: "Document Readiness Agent", role: "A4: Wallet Checker" },
                { key: 'roadmap', name: "Roadmap Planner Agent", role: "A5: Process Scheduler" },
                { key: 'lifeEvent', name: "Life Event Agent", role: "A6: Future Forecaster" }
              ].map((node) => {
                const status = agentStatus[node.key];
                return (
                  <div key={node.key} className="flex gap-4 items-center relative z-10 py-1.5">
                    <div className={`h-3 w-3 rounded-full border-2 flex items-center justify-center transition-all duration-300 ${
                      status === 'running' 
                        ? 'bg-amber-500 border-amber-500 active-agent-glow scale-125' 
                        : status === 'completed'
                          ? 'bg-emerald-500 border-emerald-500 scale-100'
                          : 'bg-slate-950 border-slate-800 scale-100'
                    }`} />
                    <div>
                      <p className={`font-bold text-[11px] ${getAgentTextClass(status)}`}>
                        {node.name}
                      </p>
                      <p className="text-[9px] text-slate-500 mt-0.5">{node.role}</p>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

        </div>

      </div>
    </SidebarLayout>
  );
}
