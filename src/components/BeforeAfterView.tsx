import React from 'react';
import { BeforeAfterComparison, Contact, Meeting } from '../models/entities';
import { GitCompare, AlertTriangle, Sparkles, CheckCircle2, XCircle, Database, History, CheckSquare, Heart, Shield } from 'lucide-react';

interface BeforeAfterViewProps {
  comparison: BeforeAfterComparison | null;
  contact: Contact;
  meeting: Meeting;
  onPrepareWithMemory: () => void;
}

export const BeforeAfterView: React.FC<BeforeAfterViewProps> = ({
  comparison,
  contact,
  meeting,
  onPrepareWithMemory
}) => {
  if (!comparison) {
    return (
      <div className="bg-[#0d1222] border border-white/[0.08] rounded-2xl p-12 text-center space-y-4 animate-card-enter">
        <GitCompare className="w-10 h-10 text-violet-400 mx-auto" />
        <h3 className="text-xl font-bold text-white">Before vs After Memory</h3>
        <p className="text-slate-400 max-w-md mx-auto text-sm">
          Generate an executive brief to run the side-by-side memory differential analysis.
        </p>
        <button
          onClick={onPrepareWithMemory}
          className="px-6 py-2.5 bg-gradient-to-r from-violet-600 to-indigo-600 hover:from-violet-500 hover:to-indigo-500 text-white font-medium text-sm rounded-xl shadow-lg shadow-violet-900/25 transition-all border border-violet-400/20"
        >
          Generate Comparison
        </button>
      </div>
    );
  }

  const { withoutMemory, withMemory } = comparison;

  return (
    <div className="space-y-6 animate-card-enter">
      
      {/* Header Banner */}
      <div className="bg-[#0d1222] border border-violet-500/25 rounded-2xl p-6 sm:p-7 shadow-xl relative overflow-hidden">
        <div className="absolute top-0 right-0 w-80 h-80 bg-violet-600/10 rounded-full blur-3xl pointer-events-none" />
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 relative z-10">
          <div>
            <div className="flex items-center space-x-2 mb-1.5">
              <GitCompare className="w-5 h-5 text-violet-400" />
              <span className="text-[11px] uppercase font-bold tracking-wider text-violet-300">
                PERSISTENT MEMORY DIFFERENTIAL
              </span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-bold text-white tracking-tight">
              Before vs After Memory
            </h1>
            <p className="text-xs sm:text-sm text-slate-300 mt-1">
              Direct comparison: see the dramatic difference between a stateless AI model and an agent equipped with persistent Hindsight memory.
            </p>
          </div>
          <div className="flex items-center space-x-3">
            <span className="text-xs font-semibold px-3.5 py-1.5 rounded-xl bg-[#13192f] text-slate-200 border border-white/[0.08] shadow-sm">
              Account: {contact.name} ({contact.companyName})
            </span>
          </div>
        </div>
      </div>

      {/* Side-by-Side Comparison Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">

        {/* LEFT: Without Memory */}
        <div className="bg-[#0d1222] border border-rose-500/20 rounded-2xl p-6 shadow-lg space-y-5 relative">
          <div className="flex items-center justify-between pb-3.5 border-b border-white/[0.06]">
            <div className="flex items-center space-x-2.5">
              <XCircle className="w-5 h-5 text-rose-400" />
              <div>
                <h2 className="font-bold text-white text-lg">{withoutMemory.title}</h2>
                <p className="text-[11px] text-slate-400">{withoutMemory.subtitle}</p>
              </div>
            </div>
            <span className="text-[10px] uppercase font-bold px-2 py-0.5 rounded-md bg-rose-500/15 text-rose-300 border border-rose-500/25">
              Generic Baseline
            </span>
          </div>

          {/* 1. Generic Meeting Preparation */}
          <div className="space-y-1.5">
            <div className="text-xs font-semibold text-rose-400 uppercase tracking-wider">
              Generic meeting preparation
            </div>
            <p className="text-xs sm:text-sm text-slate-300 bg-[#080b14]/70 p-3.5 rounded-xl border border-white/[0.06] leading-relaxed italic">
              "{withoutMemory.executiveSummary}"
            </p>
          </div>

          {/* 2. No Historical Context */}
          <div className="space-y-1.5">
            <div className="text-xs font-semibold text-slate-400 uppercase tracking-wider flex items-center space-x-1.5">
              <History className="w-3.5 h-3.5 text-rose-400" />
              <span>No historical context</span>
            </div>
            <p className="text-xs text-slate-300 bg-[#080b14]/50 p-3 rounded-xl border border-white/[0.06] leading-relaxed">
              {withoutMemory.historicalContext}
            </p>
          </div>

          {/* 3. No Previous Commitments */}
          <div className="space-y-1.5">
            <div className="text-xs font-semibold text-slate-400 uppercase tracking-wider flex items-center space-x-1.5">
              <CheckSquare className="w-3.5 h-3.5 text-rose-400" />
              <span>No previous commitments</span>
            </div>
            <p className="text-xs text-slate-300 bg-[#080b14]/50 p-3 rounded-xl border border-white/[0.06] leading-relaxed">
              {withoutMemory.previousCommitments}
            </p>
          </div>

          {/* 4. No Relationship-Specific Insights */}
          <div className="space-y-1.5">
            <div className="text-xs font-semibold text-slate-400 uppercase tracking-wider flex items-center space-x-1.5">
              <Shield className="w-3.5 h-3.5 text-rose-400" />
              <span>No relationship-specific insights</span>
            </div>
            <p className="text-xs text-slate-300 bg-[#080b14]/50 p-3 rounded-xl border border-white/[0.06] leading-relaxed">
              {withoutMemory.customerConcerns}
            </p>
          </div>

          {/* 5. Generic Talking Points */}
          <div className="space-y-1.5">
            <div className="text-xs font-semibold text-slate-400 uppercase tracking-wider">Suggested Talking Points</div>
            <ul className="space-y-2 text-xs text-slate-400">
              {withoutMemory.talkingPoints.map((tp, idx) => (
                <li key={idx} className="flex items-start space-x-2 bg-[#080b14]/40 p-2.5 rounded-lg border border-white/[0.04]">
                  <span className="text-rose-400 font-bold">•</span>
                  <span>{tp}</span>
                </li>
              ))}
            </ul>
          </div>

          {/* Fatal Blindspot Callout */}
          <div className="bg-rose-950/20 border border-rose-500/30 p-4 rounded-xl space-y-1.5 text-xs text-rose-200">
            <div className="font-bold flex items-center space-x-1.5 text-rose-300">
              <AlertTriangle className="w-4 h-4 text-rose-400" />
              <span>Fatal Blindspot:</span>
            </div>
            <p className="leading-relaxed">
              {withoutMemory.weaknessReason}
            </p>
          </div>
        </div>

        {/* RIGHT: With Memory */}
        <div className="bg-[#0d1222] border border-violet-500/30 rounded-2xl p-6 shadow-lg space-y-5 relative">
          <div className="flex items-center justify-between pb-3.5 border-b border-white/[0.06]">
            <div className="flex items-center space-x-2.5">
              <CheckCircle2 className="w-5 h-5 text-cyan-400" />
              <div>
                <h2 className="font-bold text-white text-lg">{withMemory.title}</h2>
                <p className="text-[11px] text-cyan-300">{withMemory.subtitle}</p>
              </div>
            </div>
            <span className="text-[10px] uppercase font-bold px-2 py-0.5 rounded-md bg-violet-500/20 text-violet-300 border border-violet-500/30">
              Memory Powered
            </span>
          </div>

          {/* 1. Relevant Past Discussions */}
          <div className="space-y-1.5">
            <div className="text-xs font-semibold text-cyan-400 uppercase tracking-wider flex items-center space-x-1.5">
              <History className="w-3.5 h-3.5 text-cyan-400" />
              <span>Relevant past discussions</span>
            </div>
            <p className="text-xs sm:text-sm text-slate-100 bg-[#080b14]/70 p-3.5 rounded-xl border border-white/[0.06] leading-relaxed font-medium">
              "{withMemory.executiveSummary}"
            </p>
            <p className="text-xs text-cyan-300 bg-cyan-950/20 p-2.5 rounded-lg border border-cyan-500/25">
              {withMemory.historicalContext}
            </p>
          </div>

          {/* 2. Previous Commitments */}
          <div className="space-y-1.5">
            <div className="text-xs font-semibold text-cyan-400 uppercase tracking-wider flex items-center space-x-1.5">
              <CheckSquare className="w-3.5 h-3.5 text-cyan-400" />
              <span>Previous commitments</span>
            </div>
            <p className="text-xs text-rose-200 bg-rose-950/20 p-3 rounded-xl border border-rose-500/30 font-medium leading-relaxed">
              {withMemory.previousCommitments}
            </p>
          </div>

          {/* 3. Customer Concerns */}
          <div className="space-y-1.5">
            <div className="text-xs font-semibold text-cyan-400 uppercase tracking-wider flex items-center space-x-1.5">
              <Shield className="w-3.5 h-3.5 text-cyan-400" />
              <span>Customer concerns</span>
            </div>
            <p className="text-xs text-slate-200 bg-[#080b14]/50 p-3 rounded-xl border border-white/[0.06] leading-relaxed">
              {withMemory.customerConcerns}
            </p>
          </div>

          {/* 4. Important Preferences */}
          <div className="space-y-1.5">
            <div className="text-xs font-semibold text-cyan-400 uppercase tracking-wider flex items-center space-x-1.5">
              <Heart className="w-3.5 h-3.5 text-cyan-400" />
              <span>Important preferences</span>
            </div>
            <p className="text-xs text-slate-200 bg-[#080b14]/50 p-3 rounded-xl border border-white/[0.06] leading-relaxed">
              {withMemory.importantPreferences}
            </p>
          </div>

          {/* 5. Personalized Talking Points */}
          <div className="space-y-1.5">
            <div className="text-xs font-semibold text-violet-300 uppercase tracking-wider">Personalized talking points</div>
            <ul className="space-y-2 text-xs text-slate-200">
              {withMemory.talkingPoints.map((tp, idx) => (
                <li key={idx} className="flex items-start space-x-2 bg-[#080b14]/60 p-2.5 rounded-lg border border-white/[0.06]">
                  <span className="text-cyan-400 font-bold">✓</span>
                  <span>{tp}</span>
                </li>
              ))}
            </ul>
          </div>

          {/* Advantage Callout */}
          <div className="bg-violet-950/30 border border-violet-500/30 p-4 rounded-xl space-y-1.5 text-xs text-violet-200">
            <div className="font-bold flex items-center space-x-1.5 text-cyan-300">
              <Database className="w-4 h-4 text-cyan-400" />
              <span>Persistent Memory Advantage:</span>
            </div>
            <p className="leading-relaxed">
              Detects the missed March 30 deliverable before you step into the meeting, aligns your live demo with Acme's Q4 speed metric, and structures commercial terms to Sarah's exact 3-page order form specification.
            </p>
          </div>
        </div>
      </div>

      {/* Driving Memories Breakdown */}
      <div className="bg-[#0d1222] border border-white/[0.08] rounded-2xl p-6 shadow-lg space-y-4">
        <div className="flex items-center space-x-2">
          <Sparkles className="w-5 h-5 text-violet-400" />
          <h3 className="font-bold text-white text-base">Specific Persistent Memories That Drove The Difference</h3>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {withMemory.criticalMemoriesRecalled.map((item, idx) => (
            <div key={idx} className="bg-[#080b14]/70 border border-white/[0.06] p-4 rounded-xl space-y-2 text-xs">
              <div className="flex items-center justify-between text-violet-300 font-semibold">
                <span>{item.date}</span>
                <span className="text-[10px] text-slate-400 bg-[#13192f] px-2 py-0.5 rounded">{item.meetingTitle}</span>
              </div>
              <p className="text-slate-300 italic leading-relaxed">"{item.memory}"</p>
              <div className="pt-2 border-t border-white/[0.06] text-cyan-300 font-medium">
                → {item.impactOnBrief}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
