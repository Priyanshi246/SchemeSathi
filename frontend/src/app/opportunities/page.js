'use client';

import React from 'react';
import { TrendingUp, Sparkles, GraduationCap, Calendar, Rocket, Briefcase, Award, ArrowRight } from 'lucide-react';
import SidebarLayout from '@/components/SidebarLayout';

export default function OpportunitiesPage() {
  const forecasts = [
    {
      milestone: "Graduation Milestone",
      time: "June 2027 (Expected)",
      title: "Graduate Apprentice Training Scheme (GATS)",
      benefits: "₹12,000 per month stipend with 1-year training certification",
      desc: "Centrally funded apprenticeship training program for engineering and diploma graduates to acquire on-the-job training in public/private sectors.",
      agentNote: "Calculated based on undergraduate status. Will trigger active match rules once age turns 21 and education changes to Graduate.",
      icon: GraduationCap,
      color: "border-blue-200 dark:border-blue-900 bg-blue-50/20 dark:bg-blue-950/10 text-blue-600"
    },
    {
      milestone: "Post-Graduate scholarship",
      time: "September 2027 (Forecasted)",
      title: "PG Indira Gandhi Scholarship for Single Girl Child",
      benefits: "₹36,200 per annum for two years",
      desc: "UGC scholarship program aiming to compensate direct costs of higher education for girls pursuing master degrees.",
      agentNote: "Simulated scenario projection. Requires gender verification and PG enrollment certificates.",
      icon: Award,
      color: "border-purple-205 dark:border-purple-900 bg-purple-50/20 dark:bg-purple-950/10 text-purple-600"
    },
    {
      milestone: "Launch Startup",
      time: "Rolling Forecast",
      title: "PMRY Startup Capital Subsidy",
      benefits: "Up to ₹5 Lakhs collateral-free credit with 35% state subsidy",
      desc: "Prime Minister's youth employment scheme assisting college-graduates to launch micro-enterprises.",
      agentNote: "Will match eligibility guidelines if profile occupation parameters change from Student to Entrepreneur.",
      icon: Rocket,
      color: "border-emerald-202 dark:border-emerald-900 bg-emerald-50/20 dark:bg-emerald-950/10 text-emerald-600"
    }
  ];

  return (
    <SidebarLayout>
      <div className="space-y-8 max-w-7xl mx-auto text-slate-800 dark:text-slate-200">
        
        {/* Header Title */}
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
          <div>
            <h1 className="text-xl md:text-2xl font-extrabold text-slate-900 dark:text-white flex items-center gap-2">
              <TrendingUp className="h-6 w-6 text-blue-600" />
              Future Opportunities
            </h1>
            <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
              Lifecycle projections created by the Life Event Agent. Track upcoming milestones and preview qualifying welfare programs beforehand.
            </p>
          </div>
        </div>

        {/* Forecast cards */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {forecasts.map((item, idx) => {
            const Icon = item.icon;
            return (
              <div 
                key={idx}
                className="p-6 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-3xs flex flex-col justify-between"
              >
                <div className="space-y-4">
                  {/* Milestone title */}
                  <div className="flex justify-between items-center">
                    <span className="text-[10px] font-bold text-slate-400 dark:text-slate-500 uppercase tracking-wider flex items-center gap-1">
                      <Calendar className="h-3.5 w-3.5" /> {item.milestone}
                    </span>
                    <span className="text-[9px] font-bold text-emerald-600 dark:text-emerald-400 bg-emerald-50 dark:bg-emerald-500/10 px-2 py-0.5 rounded border border-emerald-100 dark:border-emerald-950/30">
                      {item.time}
                    </span>
                  </div>

                  {/* Title & Icon */}
                  <div className="flex gap-3 items-start">
                    <div className={`p-3 rounded-2xl border ${item.color} shrink-0`}>
                      <Icon className="h-5 w-5" />
                    </div>
                    <div>
                      <h3 className="font-extrabold text-slate-900 dark:text-white text-xs md:text-sm leading-snug">{item.title}</h3>
                      <p className="text-[10.5px] text-slate-500 dark:text-slate-400 mt-2 leading-relaxed">{item.desc}</p>
                    </div>
                  </div>

                  {/* Benefit highlights */}
                  <div className="p-3.5 bg-slate-50 dark:bg-slate-950 rounded-2xl border border-slate-100 dark:border-slate-850 text-xs">
                    <p className="font-bold text-[9px] text-slate-400 dark:text-slate-500 uppercase">Benefits Projections</p>
                    <p className="text-emerald-600 dark:text-emerald-450 font-bold mt-1">{item.benefits}</p>
                  </div>
                </div>

                {/* Agent note */}
                <div className="mt-6 pt-5 border-t border-slate-100 dark:border-slate-850 text-[10px] text-slate-400 dark:text-slate-500 leading-normal flex items-start gap-2">
                  <Sparkles className="h-4 w-4 text-blue-600 dark:text-blue-500 shrink-0 mt-0.5" />
                  <span><b>Agent Forecast:</b> {item.agentNote}</span>
                </div>
              </div>
            );
          })}
        </div>

      </div>
    </SidebarLayout>
  );
}
