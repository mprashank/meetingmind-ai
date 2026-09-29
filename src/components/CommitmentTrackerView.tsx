import React, { useState } from 'react';
import { Commitment, Contact } from '../models/entities';
import { CheckSquare, CheckCircle2, Filter } from 'lucide-react';

interface CommitmentTrackerViewProps {
  commitments: Commitment[];
  contact: Contact;
  onUpdateCommitmentStatus: (commitmentId: string, status: 'PENDING' | 'COMPLETED' | 'OVERDUE') => void;
}

export const CommitmentTrackerView: React.FC<CommitmentTrackerViewProps> = ({
  commitments,
  contact,
  onUpdateCommitmentStatus
}) => {
  const [filter, setFilter] = useState<'ALL' | 'OVERDUE' | 'PENDING' | 'COMPLETED'>('ALL');

  const filteredCommitments = commitments.filter((c) => {
    if (filter === 'ALL') return true;
    return c.status === filter;
  });

  const overdueCount = commitments.filter((c) => c.status === 'OVERDUE').length;
  const pendingCount = commitments.filter((c) => c.status === 'PENDING').length;
  const completedCount = commitments.filter((c) => c.status === 'COMPLETED').length;

  return (
    <div className="space-y-6 animate-card-enter">
      
      {/* Header */}
      <div className="bg-[#0d1222] border border-white/[0.08] rounded-2xl p-6 sm:p-7 shadow-xl relative overflow-hidden">
        <div className="absolute top-0 right-0 w-80 h-80 bg-violet-600/10 rounded-full blur-3xl pointer-events-none" />
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 relative z-10">
          <div>
            <div className="flex items-center space-x-2 mb-1.5">
              <CheckSquare className="w-5 h-5 text-violet-400" />
              <span className="text-[11px] uppercase font-bold tracking-wider text-violet-300">
                ACTIVE COMMITMENT LEDGER
              </span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-bold text-white tracking-tight">Commitment &amp; Deliverable Tracker</h1>
            <p className="text-xs sm:text-sm text-slate-300 mt-1">
              Track promises made by our team and {contact.name}. Prevent relationship friction by surfacing overdue commitments.
            </p>
          </div>

          {/* Quick Metrics */}
          <div className="flex items-center space-x-2.5 text-xs">
            <div className="bg-[#080b14]/70 px-3.5 py-2 rounded-xl border border-white/[0.06] text-center min-w-[70px]">
              <span className="text-slate-400 block text-[10px]">Overdue</span>
              <span className="text-rose-400 font-bold text-base font-mono">{overdueCount}</span>
            </div>
            <div className="bg-[#080b14]/70 px-3.5 py-2 rounded-xl border border-white/[0.06] text-center min-w-[70px]">
              <span className="text-slate-400 block text-[10px]">Pending</span>
              <span className="text-amber-300 font-bold text-base font-mono">{pendingCount}</span>
            </div>
            <div className="bg-[#080b14]/70 px-3.5 py-2 rounded-xl border border-white/[0.06] text-center min-w-[70px]">
              <span className="text-slate-400 block text-[10px]">Completed</span>
              <span className="text-cyan-300 font-bold text-base font-mono">{completedCount}</span>
            </div>
          </div>
        </div>

        {/* Filter Bar */}
        <div className="mt-6 pt-4 border-t border-white/[0.06] flex items-center space-x-2 text-xs">
          <span className="text-slate-400 font-medium mr-2 flex items-center space-x-1">
            <Filter className="w-3.5 h-3.5 text-slate-400" />
            <span>Filter:</span>
          </span>
          {(['ALL', 'OVERDUE', 'PENDING', 'COMPLETED'] as const).map((status) => (
            <button
              key={status}
              onClick={() => setFilter(status)}
              className={`px-3 py-1.5 rounded-lg font-medium transition-all ${
                filter === status
                  ? 'bg-gradient-to-r from-violet-600 to-indigo-600 text-white shadow-sm border border-violet-400/30'
                  : 'bg-[#080b14] text-slate-400 hover:text-white border border-white/[0.06]'
              }`}
            >
              {status}
            </button>
          ))}
        </div>
      </div>

      {/* Commitment Cards */}
      <div className="space-y-4">
        {filteredCommitments.map((comm) => (
          <div
            key={comm.id}
            className={`bg-[#0d1222] border rounded-2xl p-5 sm:p-6 shadow-lg transition-all ${
              comm.status === 'OVERDUE'
                ? 'border-rose-500/30 bg-gradient-to-r from-[#0d1222] via-rose-950/15 to-[#0d1222]'
                : comm.status === 'COMPLETED'
                ? 'border-cyan-500/20 opacity-90'
                : 'border-white/[0.08]'
            }`}
          >
            <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
              <div className="space-y-2">
                <div className="flex flex-wrap items-center gap-2">
                  <span className={`text-[10px] uppercase font-bold px-2 py-0.5 rounded-md ${
                    comm.status === 'OVERDUE'
                      ? 'bg-rose-500 text-white font-bold'
                      : comm.status === 'COMPLETED'
                      ? 'bg-cyan-500/20 text-cyan-300 border border-cyan-500/30'
                      : 'bg-amber-500/20 text-amber-300 border border-amber-500/30'
                  }`}>
                    {comm.status}
                  </span>
                  <span className="text-xs font-semibold text-slate-400">
                    Owner: <span className="text-white">{comm.owner}</span>
                  </span>
                  <span className="text-xs text-slate-400">
                    Due: <span className="font-mono text-slate-200 font-semibold">{comm.dueDate}</span>
                  </span>
                </div>

                <h3 className="text-base font-bold text-white">{comm.title}</h3>
                <p className="text-xs sm:text-sm text-slate-300 leading-relaxed">{comm.description}</p>

                <div className="text-xs text-cyan-400 flex items-center space-x-1.5 pt-1">
                  <span>Source Meeting: {comm.sourceMeetingTitle} ({comm.sourceDate})</span>
                </div>
              </div>

              {/* Status Action Buttons */}
              <div className="flex items-center space-x-2 pt-2 lg:pt-0 border-t lg:border-t-0 border-white/[0.06]">
                {comm.status !== 'COMPLETED' ? (
                  <button
                    onClick={() => onUpdateCommitmentStatus(comm.id, 'COMPLETED')}
                    className="flex items-center space-x-1.5 bg-cyan-600/20 hover:bg-cyan-600/30 border border-cyan-500/40 text-cyan-300 px-3.5 py-2 rounded-xl text-xs font-semibold transition-all whitespace-nowrap shadow-sm"
                  >
                    <CheckCircle2 className="w-4 h-4 text-cyan-400" />
                    <span>Mark Completed</span>
                  </button>
                ) : (
                  <button
                    onClick={() => onUpdateCommitmentStatus(comm.id, 'PENDING')}
                    className="flex items-center space-x-1.5 bg-[#13192f] hover:bg-[#1a2342] text-slate-300 px-3.5 py-2 rounded-xl text-xs font-medium transition-colors border border-white/[0.08]"
                  >
                    <span>Re-Open</span>
                  </button>
                )}
              </div>
            </div>
          </div>
        ))}

        {filteredCommitments.length === 0 && (
          <div className="bg-[#0d1222] border border-white/[0.08] rounded-2xl p-12 text-center text-slate-400 text-sm">
            No commitments matching filter "{filter}".
          </div>
        )}
      </div>
    </div>
  );
};
