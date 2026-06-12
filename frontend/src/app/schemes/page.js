'use client';

import React, { useState, useEffect } from 'react';
import { Compass, Search, Filter, CheckCircle2, AlertCircle, ArrowRight, ArrowUpRight, Award, Info, RefreshCw } from 'lucide-react';
import SidebarLayout from '@/components/SidebarLayout';
import { api } from '@/utils/api';
import Link from 'next/link';

export default function SchemesPage() {
  const [schemes, setSchemes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [activeTab, setActiveTab] = useState('All');

  useEffect(() => {
    loadSchemes();
  }, []);

  const loadSchemes = async () => {
    try {
      setLoading(true);
      const res = await api.getSchemes();
      setSchemes(res.data || []);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const filteredSchemes = schemes.filter(s => {
    const matchesSearch = s.scheme_name.toLowerCase().includes(searchQuery.toLowerCase()) || 
                          s.description.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesTab = activeTab === 'All' || s.category === activeTab || (activeTab === 'Matches' && s.match_percentage >= 50);
    return matchesSearch && matchesTab;
  });

  return (
    <SidebarLayout>
      <div className="space-y-8 max-w-7xl mx-auto text-slate-800 dark:text-slate-200">
        
        {/* Header Title */}
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
          <div>
            <h1 className="text-xl md:text-2xl font-extrabold text-slate-900 dark:text-white flex items-center gap-2">
              <Compass className="h-6 w-6 text-blue-600" />
              Welfare Schemes Explorer
            </h1>
            <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">Cross-check live central and state policies against your profile parameters.</p>
          </div>
        </div>

        {/* Search & Tabs */}
        <div className="flex flex-col sm:flex-row gap-4 justify-between items-stretch sm:items-center bg-white dark:bg-slate-900 p-4 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-3xs">
          {/* Tabs */}
          <div className="flex gap-2">
            {['All', 'Matches', 'Education', 'Business'].map(tab => (
              <button
                key={tab}
                onClick={() => setActiveTab(tab)}
                className={`px-4 py-2 rounded-xl text-xs font-bold transition ${
                  activeTab === tab
                    ? 'bg-blue-600 text-white shadow-xs'
                    : 'bg-slate-50 dark:bg-slate-950 text-slate-550 dark:text-slate-400 border border-slate-200 dark:border-slate-850 hover:bg-slate-100'
                }`}
              >
                {tab} {tab === 'Matches' && `(${schemes.filter(s => s.match_percentage >= 50).length})`}
              </button>
            ))}
          </div>

          {/* Search bar */}
          <div className="relative flex-1 max-w-md">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
            <input
              type="text"
              placeholder="Search scheme name or key criteria..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-10 pr-4 py-2 bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-850 rounded-xl text-xs outline-none focus:border-blue-600 focus:bg-white transition"
            />
          </div>
        </div>

        {/* Schemes List */}
        {loading ? (
          <div className="flex justify-center items-center py-20">
            <RefreshCw className="h-6 w-6 text-blue-600 animate-spin" />
          </div>
        ) : filteredSchemes.length === 0 ? (
          <div className="text-center py-20 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl p-8">
            <Info className="h-8 w-8 text-slate-400 mx-auto mb-3" />
            <p className="text-sm font-bold text-slate-700 dark:text-slate-300">No schemes match your filter criteria.</p>
            <p className="text-xs text-slate-550 dark:text-slate-400 mt-1">Try resetting the tabs or modifying state variables in the Dashboard.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {filteredSchemes.map((scheme) => (
              <div 
                key={scheme.id}
                className="p-6 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-3xs hover:shadow-md hover:border-blue-600/35 transition-all duration-200 flex flex-col justify-between"
              >
                <div className="space-y-4">
                  {/* Category & Matching badge */}
                  <div className="flex justify-between items-center">
                    <span className="text-[10px] font-bold text-blue-600 dark:text-blue-450 uppercase bg-blue-50 dark:bg-blue-500/10 px-2.5 py-1 rounded-lg border border-blue-100 dark:border-blue-900/30">
                      {scheme.category}
                    </span>
                    <div className="flex items-center gap-1.5">
                      <span className={`h-2 w-2 rounded-full ${scheme.match_percentage >= 80 ? 'bg-emerald-500' : 'bg-amber-500'}`} />
                      <span className="text-xs font-bold text-slate-800 dark:text-slate-200">{scheme.match_percentage}% Eligibility Match</span>
                    </div>
                  </div>

                  {/* Title & Description */}
                  <div>
                    <h3 className="font-extrabold text-slate-900 dark:text-white text-base flex items-center justify-between group cursor-pointer">
                      {scheme.scheme_name}
                      <ArrowUpRight className="h-4.5 w-4.5 text-slate-400 group-hover:text-blue-600 transition" />
                    </h3>
                    <p className="text-xs text-slate-550 dark:text-slate-400 mt-2 leading-relaxed">{scheme.description}</p>
                  </div>

                  {/* Rationale Checklist */}
                  <div className="p-3.5 bg-slate-50 dark:bg-slate-950 rounded-2xl border border-slate-100 dark:border-slate-900 text-xs">
                    <p className="font-bold text-slate-400 dark:text-slate-500 text-[10px] uppercase mb-1.5 flex items-center gap-1">
                      <Award className="h-3.5 w-3.5" /> Explainability Agent Audit
                    </p>
                    <p className="text-slate-600 dark:text-slate-400 leading-normal font-medium">{scheme.eligibility.summary}</p>
                  </div>

                  {/* Wallet requirements status */}
                  <div className="space-y-2">
                    <p className="text-[10px] font-bold text-slate-400 dark:text-slate-500 uppercase">Document Readiness Checklist ({scheme.documentStatus.readinessScore}% Score)</p>
                    <div className="flex flex-wrap gap-2">
                      {scheme.documentStatus.available.map(doc => (
                        <span key={doc} className="inline-flex items-center gap-1 px-2.5 py-1 bg-emerald-50 dark:bg-emerald-500/10 text-emerald-600 dark:text-emerald-450 border border-emerald-100 dark:border-emerald-950/40 rounded-xl text-[10px] font-bold">
                          <CheckCircle2 className="h-3 w-3" /> {doc}
                        </span>
                      ))}
                      {scheme.documentStatus.missing.map(doc => (
                        <span key={doc} className="inline-flex items-center gap-1 px-2.5 py-1 bg-red-50 dark:bg-red-500/10 text-red-600 dark:text-red-400 border border-red-100 dark:border-red-950/40 rounded-xl text-[10px] font-bold">
                          <AlertCircle className="h-3 w-3" /> {doc}
                        </span>
                      ))}
                    </div>
                  </div>
                </div>

                {/* Roadmaps action footer */}
                <div className="mt-6 pt-5 border-t border-slate-100 dark:border-slate-850 flex justify-between items-center text-xs font-bold">
                  <div>
                    <span className="text-slate-400 dark:text-slate-500 block font-normal text-[10px]">Financial Support</span>
                    <span className="text-emerald-600 dark:text-emerald-400">{scheme.benefits}</span>
                  </div>
                  
                  <Link href="/roadmaps" className="flex items-center gap-1 text-xs text-white bg-blue-600 hover:bg-blue-755 transition px-4.5 py-2.5 rounded-xl shadow-xs">
                    View Roadmap
                    <ArrowRight className="h-4 w-4" />
                  </Link>
                </div>

              </div>
            ))}
          </div>
        )}

      </div>
    </SidebarLayout>
  );
}
