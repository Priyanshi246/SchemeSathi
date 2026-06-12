'use client';

import React, { useState } from 'react';
import { Calendar, CheckCircle2, Clock, Play, ArrowRight, ClipboardList, Info } from 'lucide-react';
import SidebarLayout from '@/components/SidebarLayout';

export default function RoadmapsPage() {
  const [activeRoadmap, setActiveRoadmap] = useState('scholarship');

  const roadmaps = {
    scholarship: {
      title: "Rajasthan Yuva Vikas Scholarship Roadmap",
      subtitle: "Active Day Checklist for Aarav Sharma",
      days: [
        {
          day: "Day 1",
          title: "Certificate Gathering & Audits",
          desc: "Collect Rajasthan Domicile Certificate from e-Mitra or local authorities. Verify family income parameters match guidelines.",
          status: "completed"
        },
        {
          day: "Day 2",
          title: "Rajasthan SSO ID Registration",
          desc: "Create unified SSO (Single Sign-On) credentials on the state portal. Ensure Aadhaar is connected to OTP matching.",
          status: "in-progress"
        },
        {
          day: "Day 3",
          title: "Welfare Profile Match Verification",
          desc: "Select Scholar Welfare schemes from the SSO dashboard. Verify state demographic variables match successfully.",
          status: "pending"
        },
        {
          day: "Day 4",
          title: "Application Submission & Receipt",
          desc: "Upload verified transcripts and digital signature. Submit form and print receipt for future department tracking.",
          status: "pending"
        }
      ]
    },
    entrepreneur: {
      title: "PM Yuva Entrepreneurship Scheme Roadmap",
      subtitle: "Micro-business Startup Capital Roadmap",
      days: [
        {
          day: "Day 1",
          title: "Business Proposal Blueprinting",
          desc: "Write detailed micro-enterprise project report explaining goals, resources, and expected revenue projections.",
          status: "completed"
        },
        {
          day: "Day 2",
          title: "Udyam Register Registration",
          desc: "Obtain MSME registration on the central government Udyam portal to become eligible for subsidies.",
          status: "pending"
        },
        {
          day: "Day 3",
          title: "Subsidized Capital Application",
          desc: "Submit proposal details to local partner bank. Present MSME certificates and Aadhaar digital identity.",
          status: "pending"
        }
      ]
    }
  };

  const selected = roadmaps[activeRoadmap];

  return (
    <SidebarLayout>
      <div className="space-y-8 max-w-7xl mx-auto text-slate-800 dark:text-slate-200">
        
        {/* Header Title */}
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
          <div>
            <h1 className="text-xl md:text-2xl font-extrabold text-slate-900 dark:text-white flex items-center gap-2">
              <Calendar className="h-6 w-6 text-blue-600" />
              Application Roadmaps
            </h1>
            <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
              Custom checklists generated dynamically by the Roadmap Planner Agent to guide you from registration to submission.
            </p>
          </div>
        </div>

        {/* Selector Tabs */}
        <div className="flex gap-2 bg-white dark:bg-slate-900 p-2 border border-slate-200 dark:border-slate-800 rounded-2xl w-fit shadow-3xs">
          <button
            onClick={() => setActiveRoadmap('scholarship')}
            className={`px-4 py-2.5 rounded-xl text-xs font-bold transition ${
              activeRoadmap === 'scholarship'
                ? 'bg-blue-600 text-white shadow-xs'
                : 'text-slate-500 hover:bg-slate-50 dark:hover:bg-slate-850'
            }`}
          >
            Rajasthan Yuva Vikas Scholarship
          </button>
          <button
            onClick={() => setActiveRoadmap('entrepreneur')}
            className={`px-4 py-2.5 rounded-xl text-xs font-bold transition ${
              activeRoadmap === 'entrepreneur'
                ? 'bg-blue-600 text-white shadow-xs'
                : 'text-slate-500 hover:bg-slate-50 dark:hover:bg-slate-850'
            }`}
          >
            PM Yuva Entrepreneurship Scheme
          </button>
        </div>

        {/* Roadmap Display */}
        <div className="p-6 md:p-8 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl shadow-3xs">
          <div className="mb-8 border-b border-slate-100 dark:border-slate-850 pb-4">
            <h2 className="text-base font-extrabold text-slate-900 dark:text-white flex items-center gap-2">
              <ClipboardList className="h-5 w-5 text-blue-600" /> {selected.title}
            </h2>
            <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">{selected.subtitle}</p>
          </div>

          {/* Vertical Timeline */}
          <div className="relative pl-6 space-y-8">
            {/* Center line */}
            <div className="absolute left-2.5 top-2 bottom-2 w-0.5 bg-slate-100 dark:bg-slate-800 z-0" />

            {selected.days.map((item, idx) => {
              const isDone = item.status === 'completed';
              const isCurrent = item.status === 'in-progress';
              
              return (
                <div key={idx} className="relative z-10 flex gap-6 items-start group">
                  {/* Node icon indicator */}
                  <div className={`h-6.5 w-6.5 rounded-full border-2 flex items-center justify-center shrink-0 shadow-3xs transition-all duration-200 ${
                    isDone 
                      ? 'bg-emerald-500 border-emerald-500 text-white' 
                      : isCurrent 
                        ? 'bg-amber-500 border-amber-500 text-white animate-pulse' 
                        : 'bg-white dark:bg-slate-950 border-slate-200 dark:border-slate-800 text-slate-400'
                  }`}>
                    {isDone ? <CheckCircle2 className="h-4 w-4" /> : <Clock className="h-4.5 w-4.5" />}
                  </div>

                  {/* Day Content */}
                  <div className="space-y-1.5 flex-1 p-4.5 bg-slate-50 dark:bg-slate-950/40 hover:bg-slate-100/50 dark:hover:bg-slate-950/70 border border-slate-150 dark:border-slate-900 rounded-2xl transition">
                    <div className="flex justify-between items-center">
                      <span className="text-[10px] font-bold text-blue-600 dark:text-blue-450 uppercase">{item.day}</span>
                      <span className={`text-[9px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-md ${
                        isDone 
                          ? 'bg-emerald-50 dark:bg-emerald-500/10 text-emerald-600' 
                          : isCurrent 
                            ? 'bg-amber-50 dark:bg-amber-500/10 text-amber-500' 
                            : 'bg-slate-100 dark:bg-slate-900 text-slate-400'
                      }`}>
                        {item.status}
                      </span>
                    </div>
                    
                    <h3 className="text-xs md:text-sm font-bold text-slate-800 dark:text-white">{item.title}</h3>
                    <p className="text-[11.5px] leading-relaxed text-slate-500 dark:text-slate-400">{item.desc}</p>
                  </div>
                </div>
              );
            })}
          </div>

          <div className="mt-8 p-4.5 bg-blue-50/50 dark:bg-blue-950/15 border border-blue-100 dark:border-blue-900/30 rounded-2xl flex items-start gap-3 text-xs leading-relaxed text-slate-655 dark:text-slate-455">
            <Info className="h-5 w-5 text-blue-600 dark:text-blue-500 shrink-0 mt-0.5" />
            <div>
              <p className="font-bold text-slate-800 dark:text-slate-200">SSO Portal Integration</p>
              <p className="mt-0.5">Rajasthan scholarship portals utilize Unified SSO interfaces. Our planner structures these steps to prevent certificate mismatches before SSO uploads. Follow these timelines to prevent rejection errors.</p>
            </div>
          </div>
        </div>

      </div>
    </SidebarLayout>
  );
}
