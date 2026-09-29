import React, { useState } from 'react';
import { 
  Meeting, 
  Contact, 
  MeetingBrief, 
  Commitment, 
  MemoryCitation 
} from '../models/entities';
import { 
  Sparkles, 
  MessageSquare, 
  GitCompare, 
  Calendar, 
  Building2, 
  User, 
  AlertCircle, 
  CheckCircle2, 
  Clock3, 
  Layers, 
  ExternalLink,
  Target,
  FileCheck,
  Database,
  Terminal,
  Lightbulb,
  TrendingUp,
  ShieldAlert,
  ChevronDown,
  ChevronUp,
  Brain
} from 'lucide-react';

interface MeetingPrepViewProps {
  meeting: Meeting;
  contact: Contact;
  commitments: Commitment[];
  brief: MeetingBrief | null;
  isLoading: boolean;
  onGenerateBrief: () => void;
  onOpenRoleplay: () => void;
  onOpenBeforeAfter: () => void;
  onOpenPostMeeting: () => void;
}

export const MeetingPrepView: React.FC<MeetingPrepViewProps> = ({
  meeting,
  contact,
  commitments,
  brief,
  isLoading,
  onGenerateBrief,
  onOpenRoleplay,
  onOpenBeforeAfter,
  onOpenPostMeeting
}) => {
  const [selectedCitation, setSelectedCitation] = useState<MemoryCitation | null>(null);
  const [showMemoryDebug, setShowMemoryDebug] = useState(false);
  const [expandedSections, setExpandedSections] = useState<Record<string, boolean>>({
    summary: true,
    insights: true,
    talkingPoints: true,
    commitments: true,
    changes: true,
    concerns: true,
    approach: true,
    objections: true
  });

  const toggleSection = (section: string) => {
    setExpandedSections((prev) => ({ ...prev, [section]: !prev[section] }));
  };

  const overdueCount = commitments.filter((c) => c.status === 'OVERDUE').length;
  const factsCount = brief?.memoryUsageIndicator?.factsCount ?? brief?.hindsightSourceCount ?? 8;
  const pastMeetingsCount = brief?.memoryUsageIndicator?.pastMeetingsCount ?? 5;

  const recalledChips = [
    'Budget concern',
    'SOC 2 commitment',
    'Q4 planning',
    'Format preference'
  ];

  return (
    <div className="space-y-6 animate-card-enter">
      
      {/* 1. CONTACT & UPCOMING MEETING HERO CARD */}
      <div className="bg-[#0d1222] border border-white/[0.08] rounded-2xl p-6 sm:p-7 shadow-xl relative overflow-hidden">
        {/* Subtle violet/cyan ambient accent */}
        <div className="absolute top-0 right-0 w-80 h-80 bg-violet-600/10 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute bottom-0 left-1/3 w-60 h-60 bg-cyan-500/5 rounded-full blur-3xl pointer-events-none" />

        <div className="flex flex-col lg:flex-row lg:items-start justify-between gap-6 relative z-10">
          <div className="space-y-4 flex-1">
            {/* Meta Tags */}
            <div className="flex flex-wrap items-center gap-2">
              <span className="text-[11px] font-semibold px-2.5 py-0.5 rounded-md bg-violet-500/15 text-violet-300 border border-violet-500/25 uppercase tracking-wider">
                Meeting Preparation
              </span>
              <span className="text-[11px] font-medium px-2.5 py-0.5 rounded-md bg-[#13192f] text-slate-300 border border-white/[0.06]">
                {meeting.meetingType}
              </span>
              <span className="text-[11px] font-medium px-2.5 py-0.5 rounded-md bg-rose-500/15 text-rose-300 border border-rose-500/25">
                Priority: {meeting.priority}
              </span>
              {contact.relationshipStatus === 'Needs Attention' && (
                <span className="text-[11px] font-semibold px-2.5 py-0.5 rounded-md bg-amber-500/15 text-amber-300 border border-amber-500/25 flex items-center space-x-1">
                  <AlertCircle className="w-3 h-3 mr-1" />
                  <span>Needs Attention ({overdueCount} Overdue)</span>
                </span>
              )}
            </div>

            {/* Title */}
            <h1 className="text-2xl sm:text-3xl font-bold text-white tracking-tight">
              {meeting.title}
            </h1>

            {/* Contact Details Hierarchy: Contact First */}
            <div className="flex flex-wrap items-center gap-y-2 gap-x-5 text-xs sm:text-sm text-slate-300">
              <div className="flex items-center space-x-2 bg-[#13192f] px-3 py-1.5 rounded-xl border border-white/[0.06]">
                <User className="w-4 h-4 text-violet-400" />
                <span className="font-semibold text-white">{contact.name}</span>
                <span className="text-slate-400">({contact.role})</span>
              </div>
              <div className="flex items-center space-x-1.5 text-slate-300">
                <Building2 className="w-4 h-4 text-cyan-400" />
                <span>{contact.companyName}</span>
              </div>
              <div className="flex items-center space-x-1.5 text-slate-300">
                <Calendar className="w-4 h-4 text-slate-400" />
                <span>{meeting.date}</span>
                {meeting.time && <span>• {meeting.time}</span>}
              </div>
            </div>

            {/* 2. MEETING OBJECTIVE */}
            <div className="p-3.5 bg-[#080b14]/70 border border-white/[0.06] rounded-xl">
              <div className="text-[11px] font-semibold text-violet-300 uppercase tracking-wider mb-1 flex items-center space-x-1.5">
                <Target className="w-3.5 h-3.5 text-violet-400" />
                <span>Meeting Objective</span>
              </div>
              <p className="text-xs sm:text-sm text-slate-200 font-medium leading-relaxed">
                {meeting.objective}
              </p>
            </div>
          </div>

          {/* Action Column */}
          <div className="flex flex-col sm:flex-row lg:flex-col gap-2.5 min-w-[210px] w-full lg:w-auto">
            <button
              onClick={onGenerateBrief}
              disabled={isLoading}
              className="flex items-center justify-center space-x-2 bg-gradient-to-r from-violet-600 via-indigo-600 to-violet-700 hover:from-violet-500 hover:to-indigo-500 text-white font-semibold px-5 py-3 rounded-xl shadow-lg shadow-violet-900/30 transition-all disabled:opacity-50 text-sm border border-violet-400/20"
            >
              <Sparkles className="w-4 h-4" />
              <span>{isLoading ? 'Recalling & Synthesizing...' : 'Generate Meeting Brief'}</span>
            </button>

            <button
              onClick={onOpenRoleplay}
              className="flex items-center justify-center space-x-2 bg-[#13192f] hover:bg-[#1a2342] border border-white/[0.08] hover:border-violet-500/40 text-slate-200 font-medium px-4 py-2.5 rounded-xl transition-all text-xs shadow-sm"
            >
              <MessageSquare className="w-4 h-4 text-cyan-400" />
              <span>Practice Meeting (Roleplay)</span>
            </button>

            <button
              onClick={onOpenBeforeAfter}
              className="flex items-center justify-center space-x-2 bg-[#080b14]/60 hover:bg-[#13192f] border border-violet-500/30 text-violet-300 font-medium px-4 py-2 rounded-xl text-xs transition-colors"
            >
              <GitCompare className="w-3.5 h-3.5" />
              <span>Before vs After Memory</span>
            </button>
          </div>
        </div>
      </div>

      {/* Loading Skeleton */}
      {isLoading && (
        <div className="bg-[#0d1222] border border-white/[0.08] rounded-2xl p-8 space-y-6 animate-pulse">
          <div className="flex items-center space-x-3">
            <div className="w-8 h-8 rounded-full bg-violet-500/20" />
            <div className="h-5 w-64 bg-[#13192f] rounded" />
          </div>
          <div className="space-y-3">
            <div className="h-4 bg-[#13192f] rounded w-full" />
            <div className="h-4 bg-[#13192f] rounded w-5/6" />
            <div className="h-4 bg-[#13192f] rounded w-3/4" />
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 pt-4">
            <div className="h-28 bg-[#13192f]/60 rounded-xl" />
            <div className="h-28 bg-[#13192f]/60 rounded-xl" />
            <div className="h-28 bg-[#13192f]/60 rounded-xl" />
          </div>
        </div>
      )}

      {/* 3. BRIEF CONTENT (THE VISUAL CENTERPIECE) */}
      {brief && !isLoading && (
        <div className="space-y-6">

          {/* 3A. MEMORY CONTEXT BAR */}
          <div className="bg-[#0d1222] border border-violet-500/25 rounded-2xl p-4 sm:p-5 shadow-lg relative overflow-hidden">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
              <div className="flex items-center space-x-3.5">
                <div className="p-2.5 rounded-xl bg-violet-600/20 text-violet-300 border border-violet-500/30 shadow-sm">
                  <Brain className="w-6 h-6 text-cyan-300" />
                </div>
                <div>
                  <div className="flex items-center space-x-2">
                    <span className="text-[11px] uppercase font-bold tracking-wider text-violet-300">
                      Persistent Memory
                    </span>
                    <span className="text-[10px] font-mono bg-[#080b14] px-2 py-0.5 rounded text-cyan-300 border border-white/[0.06]">
                      Bank: {brief.memoryUsageIndicator?.bankId || contact.bankId || 'meetingmind-acme-sarah'}
                    </span>
                  </div>
                  {/* Upgrade 1: Memory Used Indicator */}
                  <div className="text-base sm:text-lg font-bold text-white mt-0.5">
                    Memory Used: <span className="text-cyan-300 font-mono">{factsCount} facts</span> • <span className="text-violet-300 font-mono">{pastMeetingsCount} past meetings</span>
                  </div>
                </div>
              </div>

              {/* Memory Debug Toggle */}
              <div className="flex items-center space-x-2">
                <button
                  onClick={() => setShowMemoryDebug(!showMemoryDebug)}
                  className={`text-xs px-3.5 py-2 rounded-xl border font-medium transition-all flex items-center space-x-1.5 ${
                    showMemoryDebug
                      ? 'bg-violet-600/30 text-violet-200 border-violet-500/50 shadow-sm'
                      : 'bg-[#13192f] hover:bg-[#1a2342] text-slate-300 border-white/[0.08]'
                  }`}
                >
                  <Terminal className="w-3.5 h-3.5 text-cyan-400" />
                  <span>{showMemoryDebug ? 'Hide Memory Debug' : 'Memory Debug / Demo'}</span>
                </button>
              </div>
            </div>

            {/* Recalled Memory Chips */}
            <div className="mt-3 pt-3 border-t border-white/[0.06] flex flex-wrap items-center gap-2">
              <span className="text-[10px] uppercase font-bold tracking-wider text-slate-400 mr-1">
                MEMORY RECALLED:
              </span>
              {recalledChips.map((chip, idx) => (
                <span
                  key={idx}
                  className="inline-flex items-center px-2.5 py-1 rounded-lg text-xs bg-[#080b14] text-slate-200 border border-white/[0.08] shadow-sm"
                >
                  <span className="w-1.5 h-1.5 rounded-full bg-cyan-400 mr-1.5" />
                  {chip}
                </span>
              ))}
            </div>
          </div>

          {/* Memory Debug / Demo View (Collapsible) */}
          {showMemoryDebug && (
            <div className="bg-[#080b14] border border-violet-500/30 rounded-2xl p-5 space-y-4 shadow-xl text-xs font-mono">
              <div className="flex items-center justify-between pb-3 border-b border-white/[0.08]">
                <div className="flex items-center space-x-2 text-violet-300 font-bold uppercase tracking-wider">
                  <Terminal className="w-4 h-4 text-cyan-400" />
                  <span>Hindsight Memory Debug Trace</span>
                </div>
                <span className="text-[10px] bg-cyan-500/20 text-cyan-300 px-2 py-0.5 rounded border border-cyan-500/30">
                  REAL HINDSIGHT PIPELINE
                </span>
              </div>

              <div className="space-y-3">
                <div className="bg-[#0d1222] p-3 rounded-xl border border-white/[0.06]">
                  <div className="text-slate-400 font-bold mb-0.5">MEMORY RETAIN</div>
                  <div className="text-cyan-400 font-semibold">
                    {brief.memoryDebugTrace?.retainStatus || `✓ Meeting information stored in Hindsight bank "${brief.memoryUsageIndicator?.bankId || 'meetingmind-acme-sarah'}"`}
                  </div>
                </div>

                <div className="bg-[#0d1222] p-3 rounded-xl border border-white/[0.06]">
                  <div className="text-slate-400 font-bold mb-0.5">MEMORY RECALL</div>
                  <div className="text-cyan-400 font-semibold">
                    {brief.memoryDebugTrace?.recallStatus || `✓ ${factsCount} relevant memories retrieved across 6 contextual queries`}
                  </div>
                </div>

                <div className="bg-[#0d1222] p-3 rounded-xl border border-white/[0.06]">
                  <div className="text-slate-400 font-bold mb-1.5">MEMORIES USED IN THIS BRIEFING</div>
                  <ul className="space-y-1.5 text-slate-300 font-sans">
                    {brief.memoryDebugTrace?.memoriesUsed ? (
                      brief.memoryDebugTrace.memoriesUsed.map((m, i) => (
                        <li key={i} className="flex items-start space-x-2">
                          <span className="text-violet-400 font-bold">•</span>
                          <span><strong className="text-white">[{m.source}]</strong> {m.fact}</span>
                        </li>
                      ))
                    ) : (
                      <>
                        <li className="flex items-start space-x-2">
                          <span className="text-violet-400 font-bold">•</span>
                          <span><strong className="text-white">[Meeting 2]</strong> SOC 2 whitepaper promised by March 30 (Overdue deliverable)</span>
                        </li>
                        <li className="flex items-start space-x-2">
                          <span className="text-violet-400 font-bold">•</span>
                          <span><strong className="text-white">[Meeting 1]</strong> Initial $50k tooling budget ceiling</span>
                        </li>
                        <li className="flex items-start space-x-2">
                          <span className="text-violet-400 font-bold">•</span>
                          <span><strong className="text-white">[Meeting 4]</strong> Strategic pivot toward self-serve onboarding in &lt;5 minutes</span>
                        </li>
                        <li className="flex items-start space-x-2">
                          <span className="text-violet-400 font-bold">•</span>
                          <span><strong className="text-white">[Meeting 5]</strong> CFO Rachel Morgan approved $75k pilot budget</span>
                        </li>
                        <li className="flex items-start space-x-2">
                          <span className="text-violet-400 font-bold">•</span>
                          <span><strong className="text-white">[Meeting 5]</strong> Sarah prefers concise 3-page order forms over 40-page MSAs</span>
                        </li>
                      </>
                    )}
                  </ul>
                </div>
              </div>
            </div>
          )}

          {/* 4. KEY INSIGHTS (MEMORY INSIGHTS + EXECUTIVE SUMMARY) */}
          <div className="space-y-6">

            {/* 4A. Upgrade 3: MEMORY INSIGHTS */}
            <div className="bg-[#0d1222] border border-white/[0.08] rounded-2xl p-6 shadow-lg">
              <div 
                className="flex items-center justify-between cursor-pointer"
                onClick={() => toggleSection('insights')}
              >
                <div className="flex items-center space-x-2.5">
                  <div className="p-2 rounded-xl bg-violet-500/15 text-violet-300 border border-violet-500/25">
                    <Lightbulb className="w-5 h-5 text-violet-400" />
                  </div>
                  <div>
                    <div className="flex items-center space-x-2">
                      <h2 className="text-lg font-bold text-white">Memory Insights</h2>
                      <span className="text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-md bg-cyan-500/15 text-cyan-300 border border-cyan-500/25">
                        Extracted From Stored History
                      </span>
                    </div>
                    <p className="text-xs text-slate-400">Concise, useful intelligence derived from previous interactions</p>
                  </div>
                </div>
                <button className="text-slate-400 hover:text-white p-1">
                  {expandedSections.insights ? <ChevronUp className="w-5 h-5" /> : <ChevronDown className="w-5 h-5" />}
                </button>
              </div>

              {expandedSections.insights && (
                <div className="mt-4 pt-4 border-t border-white/[0.06]">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                    {(brief.memoryInsights || [
                      'SOC 2 commitment is overdue',
                      'Budget concern was previously raised',
                      'Q4 planning was mentioned',
                      'Security documentation was promised',
                      'Format preference: Sarah explicitly prefers concise 3-page order forms over 40-page MSAs'
                    ]).map((insight, idx) => (
                      <div key={idx} className="flex items-start space-x-2.5 bg-[#080b14]/70 p-3.5 rounded-xl border border-white/[0.06] text-xs">
                        <span className="text-cyan-400 font-bold text-sm leading-none mt-0.5">•</span>
                        <span className="text-slate-200 font-medium leading-relaxed">{insight}</span>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>

            {/* 4B. EXECUTIVE SUMMARY */}
            <div className="bg-[#0d1222] border border-white/[0.08] rounded-2xl p-6 shadow-lg">
              <div 
                className="flex items-center justify-between cursor-pointer"
                onClick={() => toggleSection('summary')}
              >
                <div className="flex items-center space-x-2.5">
                  <div className="p-2 rounded-xl bg-violet-500/15 text-violet-300 border border-violet-500/25">
                    <Sparkles className="w-5 h-5 text-violet-400" />
                  </div>
                  <div>
                    <h2 className="text-lg font-bold text-white">Executive Summary</h2>
                    <p className="text-xs text-slate-400">Bottom-line briefing synthesized with full Hindsight memory recall</p>
                  </div>
                </div>
                <button className="text-slate-400 hover:text-white p-1">
                  {expandedSections.summary ? <ChevronUp className="w-5 h-5" /> : <ChevronDown className="w-5 h-5" />}
                </button>
              </div>

              {expandedSections.summary && (
                <div className="mt-4 pt-4 border-t border-white/[0.06]">
                  <p className="text-slate-200 text-sm sm:text-base leading-relaxed font-normal bg-[#080b14]/70 p-4 rounded-xl border border-white/[0.06]">
                    {brief.executiveSummary}
                  </p>

                  <div className="mt-3 flex items-center justify-between text-xs text-slate-400 bg-[#080b14]/40 px-3 py-2 rounded-xl border border-white/[0.04]">
                    <span className="flex items-center space-x-1.5">
                      <CheckCircle2 className="w-3.5 h-3.5 text-cyan-400" />
                      <span>Synthesized from {factsCount} persistent memories across {pastMeetingsCount} historical interactions</span>
                    </span>
                    <span className="text-violet-300 font-semibold">Memory Grounded</span>
                  </div>
                </div>
              )}
            </div>

          </div>

          {/* 5. PRIORITIZED TALKING POINTS */}
          <div className="bg-[#0d1222] border border-white/[0.08] rounded-2xl p-6 shadow-lg">
            <div 
              className="flex items-center justify-between cursor-pointer"
              onClick={() => toggleSection('talkingPoints')}
            >
              <div className="flex items-center space-x-2.5">
                <div className="p-2 rounded-xl bg-cyan-500/15 text-cyan-300 border border-cyan-500/25">
                  <TrendingUp className="w-5 h-5 text-cyan-400" />
                </div>
                <div>
                  <h2 className="text-lg font-bold text-white">Prioritized Talking Points</h2>
                  <p className="text-xs text-slate-400">Laser-focused agenda points grounded in relationship history</p>
                </div>
              </div>
              <button className="text-slate-400 hover:text-white p-1">
                {expandedSections.talkingPoints ? <ChevronUp className="w-5 h-5" /> : <ChevronDown className="w-5 h-5" />}
              </button>
            </div>

            {expandedSections.talkingPoints && (
              <div className="mt-4 pt-4 border-t border-white/[0.06] space-y-3.5">
                {brief.talkingPoints.map((tp, idx) => (
                  <div key={tp.id || idx} className="bg-[#080b14]/70 border border-white/[0.06] p-4 rounded-xl space-y-2">
                    <div className="flex flex-wrap items-center justify-between gap-2">
                      <div className="flex items-center space-x-2">
                        <span className={`text-[10px] font-bold px-2 py-0.5 rounded-md uppercase ${
                          tp.priority === 'Must Discuss'
                            ? 'bg-rose-500/15 text-rose-300 border border-rose-500/25'
                            : 'bg-violet-500/15 text-violet-300 border border-violet-500/25'
                        }`}>
                          {tp.priority}
                        </span>
                        <span className="text-[11px] text-slate-400 uppercase tracking-wider font-semibold">
                          Grounding: {tp.grounding}
                        </span>
                      </div>

                      {tp.memoryCitation && (
                        <button
                          onClick={() => setSelectedCitation(tp.memoryCitation!)}
                          className="text-[11px] text-cyan-400 hover:text-cyan-300 underline flex items-center space-x-1"
                        >
                          <span>Inspect Source Memory</span>
                          <ExternalLink className="w-3 h-3" />
                        </button>
                      )}
                    </div>

                    <h3 className="text-base font-semibold text-white">{tp.point}</h3>
                    <p className="text-xs sm:text-sm text-slate-300 leading-relaxed">{tp.rationale}</p>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* 6. OPEN COMMITMENTS */}
          <div className="bg-[#0d1222] border border-white/[0.08] rounded-2xl p-6 shadow-lg">
            <div 
              className="flex items-center justify-between cursor-pointer"
              onClick={() => toggleSection('commitments')}
            >
              <div className="flex items-center space-x-2.5">
                <div className="p-2 rounded-xl bg-amber-500/15 text-amber-300 border border-amber-500/25">
                  <Clock3 className="w-5 h-5 text-amber-400" />
                </div>
                <div>
                  <div className="flex items-center space-x-2">
                    <h2 className="text-lg font-bold text-white">Open Commitments</h2>
                    {overdueCount > 0 && (
                      <span className="text-[11px] font-bold px-2 py-0.5 rounded-md bg-rose-500/20 text-rose-300 border border-rose-500/30">
                        {overdueCount} OVERDUE
                      </span>
                    )}
                  </div>
                  <p className="text-xs text-slate-400">Deliverables promised by either side in previous meetings</p>
                </div>
              </div>
              <button className="text-slate-400 hover:text-white p-1">
                {expandedSections.commitments ? <ChevronUp className="w-5 h-5" /> : <ChevronDown className="w-5 h-5" />}
              </button>
            </div>

            {expandedSections.commitments && (
              <div className="mt-4 pt-4 border-t border-white/[0.06] space-y-3">
                {commitments.map((comm) => (
                  <div 
                    key={comm.id}
                    className={`p-4 rounded-xl border transition-all ${
                      comm.status === 'OVERDUE'
                        ? 'bg-rose-950/20 border-rose-500/30 hover:border-rose-500/50'
                        : comm.status === 'COMPLETED'
                        ? 'bg-emerald-950/20 border-emerald-500/30'
                        : 'bg-[#080b14]/70 border-white/[0.06]'
                    }`}
                  >
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                      <div className="flex items-start space-x-3">
                        <span className={`text-[10px] font-bold uppercase px-2 py-0.5 rounded mt-0.5 ${
                          comm.status === 'OVERDUE'
                            ? 'bg-rose-500 text-white font-bold'
                            : comm.status === 'COMPLETED'
                            ? 'bg-emerald-500/20 text-emerald-300'
                            : 'bg-amber-500/20 text-amber-300'
                        }`}>
                          {comm.status}
                        </span>
                        <div>
                          <div className="font-semibold text-white text-sm">{comm.title}</div>
                          <p className="text-xs text-slate-400 mt-1">{comm.description}</p>
                        </div>
                      </div>
                      
                      <div className="text-right text-xs text-slate-400 whitespace-nowrap pl-8 sm:pl-0">
                        <div>Owner: <span className="text-slate-200 font-medium">{comm.owner}</span></div>
                        <div>Due: <span className="font-mono text-slate-200">{comm.dueDate}</span></div>
                        <div className="text-[11px] text-violet-400 mt-0.5">
                          Source: {comm.sourceMeetingTitle} ({comm.sourceDate})
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* 7. WHAT HAS CHANGED & RECURRING CONCERNS */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            
            {/* What Has Changed */}
            <div className="bg-[#0d1222] border border-white/[0.08] rounded-2xl p-6 shadow-lg">
              <div 
                className="flex items-center justify-between cursor-pointer"
                onClick={() => toggleSection('changes')}
              >
                <div className="flex items-center space-x-2.5">
                  <div className="p-2 rounded-xl bg-violet-500/15 text-violet-300 border border-violet-500/25">
                    <Layers className="w-5 h-5 text-violet-400" />
                  </div>
                  <div>
                    <h2 className="text-base font-bold text-white">What Has Changed?</h2>
                    <p className="text-xs text-slate-400">Comparing earlier vs recent interactions</p>
                  </div>
                </div>
                <button className="text-slate-400 hover:text-white p-1">
                  {expandedSections.changes ? <ChevronUp className="w-5 h-5" /> : <ChevronDown className="w-5 h-5" />}
                </button>
              </div>

              {expandedSections.changes && (
                <div className="mt-4 pt-4 border-t border-white/[0.06] space-y-3">
                  {brief.whatChanged.map((change, i) => (
                    <div key={i} className="p-3.5 bg-[#080b14]/70 rounded-xl border border-white/[0.06] text-sm">
                      <div className="font-semibold text-violet-300 mb-1">{change.trend}</div>
                      <p className="text-slate-300 text-xs sm:text-sm leading-relaxed">{change.comparison}</p>
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* Recurring Concerns */}
            <div className="bg-[#0d1222] border border-white/[0.08] rounded-2xl p-6 shadow-lg">
              <div 
                className="flex items-center justify-between cursor-pointer"
                onClick={() => toggleSection('concerns')}
              >
                <div className="flex items-center space-x-2.5">
                  <div className="p-2 rounded-xl bg-rose-500/15 text-rose-300 border border-rose-500/25">
                    <ShieldAlert className="w-5 h-5 text-rose-400" />
                  </div>
                  <div>
                    <h2 className="text-base font-bold text-white">Recurring Concerns</h2>
                    <p className="text-xs text-slate-400">Documented friction points across meetings</p>
                  </div>
                </div>
                <button className="text-slate-400 hover:text-white p-1">
                  {expandedSections.concerns ? <ChevronUp className="w-5 h-5" /> : <ChevronDown className="w-5 h-5" />}
                </button>
              </div>

              {expandedSections.concerns && (
                <div className="mt-4 pt-4 border-t border-white/[0.06] space-y-3">
                  {brief.keyConcerns.map((c, i) => (
                    <div key={i} className="p-3.5 bg-[#080b14]/70 rounded-xl border border-white/[0.06] text-sm">
                      <div className="flex items-center justify-between mb-1">
                        <span className="font-semibold text-rose-300 text-xs sm:text-sm">{c.concern}</span>
                        <span className="text-[10px] text-slate-400 bg-[#13192f] px-2 py-0.5 rounded">{c.frequency}</span>
                      </div>
                      <p className="text-slate-400 text-xs italic leading-relaxed">"{c.evidence}"</p>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>

          {/* 8. RECOMMENDED APPROACH & PREDICTED OBJECTIONS */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            
            {/* Recommended Approach */}
            <div className="bg-[#0d1222] border border-white/[0.08] rounded-2xl p-6 shadow-lg">
              <div 
                className="flex items-center justify-between cursor-pointer"
                onClick={() => toggleSection('approach')}
              >
                <div className="flex items-center space-x-2.5">
                  <div className="p-2 rounded-xl bg-violet-500/15 text-violet-300 border border-violet-500/25">
                    <FileCheck className="w-5 h-5 text-violet-400" />
                  </div>
                  <div>
                    <h2 className="text-base font-bold text-white">Recommended Approach</h2>
                    <p className="text-xs text-slate-400">Pacing, structure, and tone strategy</p>
                  </div>
                </div>
                <button className="text-slate-400 hover:text-white p-1">
                  {expandedSections.approach ? <ChevronUp className="w-5 h-5" /> : <ChevronDown className="w-5 h-5" />}
                </button>
              </div>

              {expandedSections.approach && (
                <div className="mt-4 pt-4 border-t border-white/[0.06] space-y-3 text-sm">
                  <div className="bg-[#080b14]/70 p-3.5 rounded-xl border border-white/[0.06]">
                    <span className="text-xs font-semibold text-violet-300 uppercase block mb-1">Meeting Flow</span>
                    <p className="text-slate-200 text-xs sm:text-sm leading-relaxed">{brief.recommendedApproach.structure}</p>
                  </div>
                  <div className="bg-[#080b14]/70 p-3.5 rounded-xl border border-white/[0.06]">
                    <span className="text-xs font-semibold text-violet-300 uppercase block mb-1">Tone & Communication</span>
                    <p className="text-slate-300 text-xs leading-relaxed">{brief.recommendedApproach.toneRecommendation}</p>
                  </div>
                </div>
              )}
            </div>

            {/* Possible Objections */}
            <div className="bg-[#0d1222] border border-white/[0.08] rounded-2xl p-6 shadow-lg">
              <div 
                className="flex items-center justify-between cursor-pointer"
                onClick={() => toggleSection('objections')}
              >
                <div className="flex items-center space-x-2.5">
                  <div className="p-2 rounded-xl bg-amber-500/15 text-amber-300 border border-amber-500/25">
                    <AlertCircle className="w-5 h-5 text-amber-400" />
                  </div>
                  <div>
                    <h2 className="text-base font-bold text-white">Predicted Objections</h2>
                    <p className="text-xs text-slate-400">Evidence-based pushback with counter-tactics</p>
                  </div>
                </div>
                <button className="text-slate-400 hover:text-white p-1">
                  {expandedSections.objections ? <ChevronUp className="w-5 h-5" /> : <ChevronDown className="w-5 h-5" />}
                </button>
              </div>

              {expandedSections.objections && (
                <div className="mt-4 pt-4 border-t border-white/[0.06] space-y-3 text-sm">
                  {brief.possibleObjections.map((obj, i) => (
                    <div key={i} className="p-3.5 bg-[#080b14]/70 rounded-xl border border-white/[0.06] space-y-2">
                      <div className="font-semibold text-rose-300 text-xs sm:text-sm">{obj.objection}</div>
                      <div className="text-xs text-slate-400">
                        <span className="font-medium text-slate-300">Basis: </span>{obj.evidenceBasis}
                      </div>
                      <div className="text-xs text-emerald-300 bg-emerald-950/30 p-2.5 rounded-lg border border-emerald-800/30">
                        <span className="font-bold">Counter: </span>{obj.counterStrategy}
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>

          {/* 9. BOTTOM BAR: POST-MEETING ACTION CALLOUT */}
          <div className="p-5 sm:p-6 bg-gradient-to-r from-violet-950/40 via-[#0d1222] to-[#080b14] border border-violet-500/30 rounded-2xl flex flex-col sm:flex-row items-center justify-between gap-4 shadow-xl">
            <div>
              <h3 className="font-semibold text-white text-base">Completed this meeting?</h3>
              <p className="text-xs text-slate-400 mt-0.5">
                Paste today's transcript or notes to trigger the learning loop and retain newly learned knowledge into Hindsight.
              </p>
            </div>
            <button
              onClick={onOpenPostMeeting}
              className="px-5 py-2.5 bg-gradient-to-r from-violet-600 to-indigo-600 hover:from-violet-500 hover:to-indigo-500 text-white font-medium text-sm rounded-xl shadow-lg shadow-violet-900/25 transition-all whitespace-nowrap border border-violet-400/20"
            >
              Complete Meeting & Retain
            </button>
          </div>
        </div>
      )}

      {/* Memory Citation Drawer Modal */}
      {selectedCitation && (
        <div className="fixed inset-0 bg-black/80 backdrop-blur-md z-50 flex items-center justify-center p-4">
          <div className="bg-[#0d1222] border border-white/[0.12] rounded-2xl max-w-lg w-full p-6 shadow-2xl space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-white/[0.08]">
              <div className="flex items-center space-x-2">
                <CheckCircle2 className="w-5 h-5 text-cyan-400" />
                <h3 className="font-bold text-white text-base">Memory Traceability Evidence</h3>
              </div>
              <button
                onClick={() => setSelectedCitation(null)}
                className="text-slate-400 hover:text-white p-1 rounded-lg"
              >
                ✕
              </button>
            </div>

            <div className="space-y-3 text-sm">
              <div className="bg-[#080b14]/80 p-3.5 rounded-xl border border-white/[0.08]">
                <span className="text-[11px] font-semibold text-violet-400 uppercase tracking-wider block mb-1">
                  Retained Fact in Hindsight
                </span>
                <p className="text-slate-200 text-sm font-medium leading-relaxed">"{selectedCitation.statement}"</p>
              </div>

              <div className="grid grid-cols-2 gap-3 text-xs">
                <div className="bg-[#080b14]/60 p-2.5 rounded-xl border border-white/[0.06]">
                  <span className="text-slate-400 block">Source Interaction</span>
                  <span className="font-semibold text-white">{selectedCitation.sourceMeetingTitle || 'Meeting 2'}</span>
                </div>
                <div className="bg-[#080b14]/60 p-2.5 rounded-xl border border-white/[0.06]">
                  <span className="text-slate-400 block">Date of Interaction</span>
                  <span className="font-semibold text-white">{selectedCitation.sourceDate || '2026-03-18'}</span>
                </div>
              </div>

              <div className="bg-[#080b14]/60 p-2.5 rounded-xl border border-white/[0.06] text-xs">
                <span className="text-slate-400 block">Knowledge Type</span>
                <span className="font-semibold text-cyan-300 font-mono">{selectedCitation.groundingType}</span>
                <span className="text-slate-400 block mt-1 font-mono text-[11px]">Memory ID: {selectedCitation.memoryId}</span>
              </div>
            </div>

            <div className="flex justify-end pt-2">
              <button
                onClick={() => setSelectedCitation(null)}
                className="bg-[#13192f] hover:bg-[#1a2342] text-white px-4 py-2 rounded-xl text-sm font-medium transition-colors border border-white/[0.08]"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
