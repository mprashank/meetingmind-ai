import React, { useState } from 'react';
import { Meeting, MemoryItem, Contact } from '../models/entities';
import { History, Calendar, Clock, ArrowRight } from 'lucide-react';

interface TimelineEvent {
  meeting: Meeting;
  memories: MemoryItem[];
  keyTakeaway: string;
}

interface MemoryTimelineViewProps {
  timelineEvents: TimelineEvent[];
  contact: Contact;
  onSelectMeeting?: (meeting: Meeting) => void;
}

export const MemoryTimelineView: React.FC<MemoryTimelineViewProps> = ({
  timelineEvents,
  contact,
  onSelectMeeting
}) => {
  const [selectedFilter, setSelectedFilter] = useState<'ALL' | 'FACT' | 'COMMITMENT' | 'CONCERN' | 'DECISION'>('ALL');
  const [selectedEvent, setSelectedEvent] = useState<TimelineEvent | null>(
    timelineEvents.length > 0 ? timelineEvents[timelineEvents.length - 1] : null
  );

  // Helper to format relationship milestone evolution
  const getEvolutionPair = (evt: TimelineEvent, idx: number) => {
    switch (evt.meeting.id) {
      case 'meet-1':
        return {
          relativeTime: '1 month ago',
          topic: 'API integration discussed',
          turningPoint: 'Budget concern raised'
        };
      case 'meet-2':
        return {
          relativeTime: '2 weeks ago',
          topic: 'SOC 2 discussed',
          turningPoint: 'Security whitepaper promised'
        };
      case 'meet-3':
        return {
          relativeTime: '1 week ago',
          topic: 'SOC 2 report still pending',
          turningPoint: 'Q4 planning mentioned'
        };
      case 'meet-4':
        return {
          relativeTime: '4 days ago',
          topic: 'Strategic roadmap shift discussed',
          turningPoint: 'Q4 pivot to self-serve onboarding in <5 minutes'
        };
      case 'meet-5':
        return {
          relativeTime: 'Yesterday',
          topic: 'Pre-contract commercial review',
          turningPoint: '$75k pilot approved by CFO conditional on SOC 2'
        };
      case 'meet-6':
      case 'meet-6-upcoming':
        return {
          relativeTime: evt.meeting.status === 'Completed' ? 'Just completed' : 'Today / Upcoming',
          topic: evt.memories.length > 0 ? evt.memories[0].content.slice(0, 50) : 'Executive Pilot Sign-Off',
          turningPoint: evt.memories.length > 1 ? evt.memories[1].content.slice(0, 60) : 'Deliver overdue SOC 2 & prove 3-minute quickstart'
        };
      default:
        return {
          relativeTime: `${idx + 1} interactions ago`,
          topic: evt.memories.length > 0 ? evt.memories[0].content.slice(0, 50) : evt.meeting.title,
          turningPoint: evt.memories.length > 1 ? evt.memories[1].content.slice(0, 60) : evt.keyTakeaway
        };
    }
  };

  return (
    <div className="space-y-6 animate-card-enter">
      
      {/* Header */}
      <div className="bg-[#0d1222] border border-white/[0.08] rounded-2xl p-6 sm:p-7 shadow-xl relative overflow-hidden">
        <div className="absolute top-0 right-0 w-80 h-80 bg-violet-600/10 rounded-full blur-3xl pointer-events-none" />
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 relative z-10">
          <div>
            <div className="flex items-center space-x-2 mb-1.5">
              <History className="w-5 h-5 text-violet-400" />
              <span className="text-[11px] uppercase font-bold tracking-wider text-violet-300">
                RELATIONSHIP EVOLUTION TIMELINE
              </span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-bold text-white tracking-tight">
              Relationship Memory Timeline
            </h1>
            <p className="text-xs sm:text-sm text-slate-300 mt-1">
              Visualizes how previous discussions, commitments, and priorities evolved over time with {contact.name}.
            </p>
          </div>

          {/* Filter Segmented Control */}
          <div className="flex items-center space-x-1 bg-[#080b14] p-1.5 rounded-xl border border-white/[0.08] text-xs">
            {(['ALL', 'FACT', 'COMMITMENT', 'CONCERN', 'DECISION'] as const).map((filter) => (
              <button
                key={filter}
                onClick={() => setSelectedFilter(filter)}
                className={`px-3 py-1.5 rounded-lg font-medium transition-all ${
                  selectedFilter === filter
                    ? 'bg-gradient-to-r from-violet-600 to-indigo-600 text-white shadow-sm border border-violet-400/30'
                    : 'text-slate-400 hover:text-white'
                }`}
              >
                {filter}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Main Timeline Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">

        {/* Timeline Path (Left 7 Cols) */}
        <div className="lg:col-span-7 bg-[#0d1222] border border-white/[0.08] rounded-2xl p-6 shadow-lg space-y-6">
          <div className="flex items-center justify-between pb-3 border-b border-white/[0.06]">
            <h2 className="text-base font-bold text-white flex items-center space-x-2">
              <Clock className="w-4 h-4 text-cyan-400" />
              <span>Relationship Evolution ({timelineEvents.length} Interactions)</span>
            </h2>
            <span className="text-xs text-slate-400">Chronological Progression</span>
          </div>

          <div className="relative pl-6 sm:pl-8 border-l-2 border-violet-500/25 space-y-7 ml-2">
            {timelineEvents.map((evt, idx) => {
              const isSelected = selectedEvent?.meeting.id === evt.meeting.id;
              const hasOverdue = evt.memories.some((m) => m.content.toLowerCase().includes('failed') || m.content.toLowerCase().includes('missed'));
              const isUpcoming = evt.meeting.status === 'Upcoming';
              const evolution = getEvolutionPair(evt, idx);

              return (
                <div 
                  key={evt.meeting.id || idx}
                  onClick={() => setSelectedEvent(evt)}
                  className={`relative group cursor-pointer transition-all ${
                    isSelected ? 'scale-[1.01]' : 'opacity-90 hover:opacity-100'
                  }`}
                >
                  {/* Timeline Dot Indicator */}
                  <div className={`absolute -left-[31px] sm:-left-[39px] top-2.5 w-5 h-5 rounded-full border-2 flex items-center justify-center transition-all ${
                    isUpcoming
                      ? 'bg-violet-600 border-violet-300 text-white animate-pulse shadow-[0_0_10px_rgba(124,58,237,0.5)]'
                      : hasOverdue
                      ? 'bg-rose-500 border-rose-300 text-white'
                      : isSelected
                      ? 'bg-cyan-500 border-white text-white shadow-[0_0_10px_rgba(34,211,238,0.5)]'
                      : 'bg-[#13192f] border-slate-600 text-slate-400'
                  }`}>
                    <div className="w-2 h-2 rounded-full bg-white" />
                  </div>

                  {/* Event Card */}
                  <div className={`p-4 sm:p-5 rounded-xl border transition-all ${
                    isSelected
                      ? 'bg-[#13192f] border-violet-500/60 shadow-lg shadow-violet-900/20'
                      : 'bg-[#080b14]/70 border-white/[0.06] hover:border-white/[0.14]'
                  }`}>
                    
                    {/* Header Row: Relative time + Date */}
                    <div className="flex flex-wrap items-center justify-between gap-2 text-xs mb-2">
                      <div className="flex items-center space-x-2">
                        <span className="font-bold text-cyan-300 bg-cyan-950/40 px-2.5 py-0.5 rounded-md border border-cyan-500/25 text-[11px]">
                          {evolution.relativeTime}
                        </span>
                        <span className="text-slate-400 flex items-center space-x-1">
                          <Calendar className="w-3 h-3 text-slate-500" />
                          <span>{evt.meeting.date}</span>
                        </span>
                      </div>
                      <span className={`text-[10px] uppercase font-bold px-2 py-0.5 rounded-md ${
                        isUpcoming
                          ? 'bg-violet-500/20 text-violet-300 border border-violet-500/30'
                          : hasOverdue
                          ? 'bg-rose-500/20 text-rose-300 border border-rose-500/30'
                          : 'bg-[#13192f] text-slate-300 border border-white/[0.06]'
                      }`}>
                        {isUpcoming ? 'UPCOMING' : evt.meeting.meetingType}
                      </span>
                    </div>

                    <h3 className="text-base font-bold text-white group-hover:text-violet-300 transition-colors">
                      {evt.meeting.title}
                    </h3>

                    {/* Evolution Flow: Topic -> Turning Point */}
                    <div className="mt-3 p-3.5 rounded-xl bg-[#080b14] border border-white/[0.06] text-xs space-y-1.5">
                      <div className="text-slate-200 font-medium">
                        {evolution.topic}
                      </div>
                      <div className="flex items-center space-x-1.5 text-violet-300 font-semibold text-sm">
                        <span className="text-cyan-400 font-bold">→</span>
                        <span>{evolution.turningPoint}</span>
                      </div>
                    </div>

                    <div className="mt-3 flex items-center justify-between text-[11px] text-slate-400 pt-2 border-t border-white/[0.06]">
                      <span>{evt.memories.length} durable facts in Hindsight</span>
                      <span className="text-cyan-400 font-medium group-hover:translate-x-0.5 transition-transform flex items-center space-x-1">
                        <span>Inspect Stored Facts</span>
                        <ArrowRight className="w-3 h-3" />
                      </span>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Selected Event Memory Inspector (Right 5 Cols) */}
        <div className="lg:col-span-5 bg-[#0d1222] border border-white/[0.08] rounded-2xl p-6 shadow-lg space-y-4">
          <div className="flex items-center justify-between pb-3 border-b border-white/[0.06]">
            <div>
              <h2 className="text-base font-bold text-white">Retained Memories</h2>
              <p className="text-xs text-slate-400 truncate max-w-[220px]">
                {selectedEvent ? selectedEvent.meeting.title : 'Select an event to inspect'}
              </p>
            </div>
            {selectedEvent?.meeting.status === 'Completed' && (
              <span className="text-[10px] uppercase font-bold px-2 py-0.5 rounded-md bg-cyan-500/20 text-cyan-300 border border-cyan-500/30">
                RETAINED
              </span>
            )}
          </div>

          {selectedEvent ? (
            <div className="space-y-4">
              
              {/* Meeting Meta */}
              <div className="bg-[#080b14]/70 p-3.5 rounded-xl border border-white/[0.06] text-xs space-y-1.5">
                <div><span className="text-slate-400">Date:</span> <span className="font-semibold text-white">{selectedEvent.meeting.date}</span></div>
                <div><span className="text-slate-400">Objective:</span> <span className="text-slate-200">{selectedEvent.meeting.objective}</span></div>
              </div>

              {/* Memory List */}
              <div className="space-y-2.5 max-h-[500px] overflow-y-auto pr-1">
                {selectedEvent.memories
                  .filter((m) => selectedFilter === 'ALL' || m.groundingType === selectedFilter || m.category === selectedFilter.toLowerCase())
                  .map((mem) => (
                    <div key={mem.id} className="bg-[#080b14]/70 border border-white/[0.06] p-3.5 rounded-xl space-y-2 text-xs">
                      <div className="flex items-center justify-between">
                        <span className={`text-[9px] font-bold px-1.5 py-0.5 rounded uppercase ${
                          mem.groundingType === 'COMMITMENT'
                            ? 'bg-amber-500/15 text-amber-300 border border-amber-500/25'
                            : mem.category === 'concern'
                            ? 'bg-rose-500/15 text-rose-300 border border-rose-500/25'
                            : 'bg-violet-500/15 text-violet-300 border border-violet-500/25'
                        }`}>
                          {mem.groundingType} • {mem.category}
                        </span>
                        <span className="text-[10px] text-slate-400 font-mono">
                          ID: {mem.id}
                        </span>
                      </div>
                      <p className="text-slate-200 font-medium leading-relaxed">
                        "{mem.content}"
                      </p>
                      <div className="text-[10px] text-slate-400 flex items-center justify-between pt-1">
                        <span>Confidence: {Math.round((mem.confidence || 0.95) * 100)}%</span>
                        <span className="text-cyan-400 font-mono">Tags: {mem.tags.join(', ')}</span>
                      </div>
                    </div>
                  ))}

                {selectedEvent.memories.length === 0 && (
                  <div className="text-center py-8 text-xs text-slate-400">
                    No memories retained for this interaction yet.
                  </div>
                )}
              </div>

              {selectedEvent.meeting.transcript && (
                <div className="pt-2">
                  <details className="text-xs text-slate-400 bg-[#080b14]/40 p-2.5 rounded-xl border border-white/[0.06]">
                    <summary className="cursor-pointer font-semibold text-violet-300">
                      View Raw Transcript Excerpt
                    </summary>
                    <pre className="mt-2 text-[11px] whitespace-pre-wrap text-slate-300 font-mono bg-[#080b14] p-3 rounded-lg border border-white/[0.04]">
                      {selectedEvent.meeting.transcript.slice(0, 400)}...
                    </pre>
                  </details>
                </div>
              )}
            </div>
          ) : (
            <div className="text-center py-12 text-slate-400 text-sm">
              Click any timeline node to inspect stored memories.
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
