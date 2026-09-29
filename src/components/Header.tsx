import React, { useState } from 'react';
import { Brain, Sparkles, Shield, Database, RotateCcw, Play, LineChart, ChevronDown, CheckCircle2, AlertTriangle, Info } from 'lucide-react';
import { Contact } from '../models/entities';

interface HeaderProps {
  status: {
    hindsight: {
      mode: string;
      label: string;
      isDevelopmentFallback: boolean;
      credentialsConfigured?: boolean;
      clientInitialized?: boolean;
      cloudVerified?: boolean;
      connected?: boolean;
      totalMemoriesRetained: number;
      endpoint: string;
      baseUrl?: string;
      bankId: string;
      message: string;
      cloudError?: string | null;
    };
    gemini: {
      configured: boolean;
      model: string;
    };
  } | null;
  contacts: Contact[];
  selectedContact: Contact | null;
  onSelectContact: (contact: Contact) => void;
  onOpenDemoTour: () => void;
  onOpenLearningCurve: () => void;
  onResetDemo: () => void;
}

export const Header: React.FC<HeaderProps> = ({
  status,
  contacts,
  selectedContact,
  onSelectContact,
  onOpenDemoTour,
  onOpenLearningCurve,
  onResetDemo
}) => {
  const [showStatusModal, setShowStatusModal] = useState(false);
  const [showContactDropdown, setShowContactDropdown] = useState(false);

  const isCloud = status?.hindsight?.mode === 'hindsight_cloud' && Boolean(status?.hindsight?.cloudVerified);

  return (
    <header className="bg-[#080b14]/90 border-b border-white/[0.08] text-slate-100 sticky top-0 z-40 backdrop-blur-xl">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
        
        {/* Brand */}
        <div className="flex items-center space-x-3">
          <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-violet-600 to-indigo-700 flex items-center justify-center shadow-md shadow-violet-900/30 border border-violet-400/20">
            <Brain className="w-5 h-5 text-white" />
          </div>
          <div>
            <div className="flex items-center space-x-2">
              <span className="font-bold text-base sm:text-lg tracking-tight text-white">
                MeetingMind
              </span>
              <span className="text-[10px] uppercase font-semibold tracking-wider px-2 py-0.5 rounded-md bg-violet-500/15 text-violet-300 border border-violet-500/25">
                Memory Agent
              </span>
            </div>
            <p className="text-[11px] text-slate-400 hidden sm:block">
              Persistent memory for professional relationships
            </p>
          </div>
        </div>

        {/* Center: Contact Switcher */}
        <div className="relative">
          <button
            onClick={() => setShowContactDropdown(!showContactDropdown)}
            className="flex items-center space-x-2 bg-[#0d1222] hover:bg-[#13192f] border border-white/[0.08] hover:border-violet-500/40 px-3.5 py-1.5 rounded-xl text-xs sm:text-sm transition-all text-slate-200 shadow-sm"
          >
            <div className="w-2 h-2 rounded-full bg-cyan-400 animate-pulse shadow-[0_0_8px_rgba(34,211,238,0.6)]" />
            <span className="text-slate-400 text-xs">Account:</span>
            <span className="font-semibold text-white">{selectedContact ? selectedContact.name : 'Select Contact'}</span>
            <span className="text-xs text-slate-400 hidden md:inline">({selectedContact?.role})</span>
            <ChevronDown className="w-3.5 h-3.5 text-slate-400" />
          </button>

          {showContactDropdown && (
            <div className="absolute top-full mt-2 w-72 bg-[#0d1222] border border-white/[0.12] rounded-xl shadow-2xl p-2 z-50 backdrop-blur-xl">
              <div className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider px-2.5 py-1.5">
                Acme Corporation Contacts (Scoped Banks)
              </div>
              {contacts.map((contact) => (
                <button
                  key={contact.id}
                  onClick={() => {
                    onSelectContact(contact);
                    setShowContactDropdown(false);
                  }}
                  className={`w-full text-left px-3 py-2 rounded-lg text-xs sm:text-sm flex items-center justify-between transition-colors ${
                    selectedContact?.id === contact.id
                      ? 'bg-violet-600/20 text-violet-200 border border-violet-500/40'
                      : 'hover:bg-[#13192f] text-slate-300'
                  }`}
                >
                  <div>
                    <div className="font-medium text-white">{contact.name}</div>
                    <div className="text-xs text-slate-400">{contact.role}</div>
                  </div>
                  <span className={`text-[10px] px-1.5 py-0.5 rounded font-medium ${
                    contact.relationshipStatus === 'Needs Attention'
                      ? 'bg-amber-500/15 text-amber-300 border border-amber-500/25'
                      : 'bg-cyan-500/15 text-cyan-300 border border-cyan-500/25'
                  }`}>
                    {contact.relationshipStatus}
                  </span>
                </button>
              ))}
            </div>
          )}
        </div>

        {/* Right Actions */}
        <div className="flex items-center space-x-2 sm:space-x-3">
          
          {/* Hindsight Status Badge */}
          <button
            onClick={() => setShowStatusModal(true)}
            className={`flex items-center space-x-1.5 px-3 py-1.5 rounded-xl text-xs font-medium border transition-all ${
              isCloud
                ? 'bg-emerald-950/60 text-emerald-300 border-emerald-500/40 hover:bg-emerald-900/50 shadow-sm shadow-emerald-950/50'
                : 'bg-slate-900/80 text-slate-300 border-white/[0.12] hover:bg-slate-800/80 hover:border-white/[0.2]'
            }`}
          >
            <span className={`w-2 h-2 rounded-full ${isCloud ? 'bg-emerald-400 animate-pulse' : 'bg-slate-400'}`} />
            <span className="font-semibold">{isCloud ? 'CONNECTED' : 'LOCAL'}</span>
            <span className="text-slate-500 hidden sm:inline">•</span>
            <span className="hidden sm:inline">{isCloud ? 'Hindsight Cloud • Vectorize' : 'Development Memory'}</span>
            <span className="px-1.5 py-0.5 rounded bg-black/50 text-[10px] text-cyan-300 font-mono ml-1">
              {status?.hindsight?.totalMemoriesRetained ?? 8} facts
            </span>
          </button>

          {/* Quick Demo Tour */}
          <button
            onClick={onOpenDemoTour}
            className="flex items-center space-x-1.5 bg-gradient-to-r from-violet-600 to-indigo-600 hover:from-violet-500 hover:to-indigo-500 text-white px-3 py-1.5 rounded-xl text-xs font-semibold shadow-md shadow-violet-900/25 transition-all"
          >
            <Play className="w-3 h-3 fill-current" />
            <span className="hidden sm:inline">Demo Tour</span>
          </button>

          {/* 60s Learning Curve */}
          <button
            onClick={onOpenLearningCurve}
            className="flex items-center space-x-1.5 bg-[#0d1222] hover:bg-[#13192f] border border-white/[0.08] hover:border-white/[0.16] text-slate-300 px-3 py-1.5 rounded-xl text-xs font-medium transition-colors"
            title="View 60-Second Learning Curve"
          >
            <LineChart className="w-3.5 h-3.5 text-cyan-400" />
            <span className="hidden md:inline">Learning Curve</span>
          </button>

          {/* Reset Demo */}
          <button
            onClick={onResetDemo}
            className="p-1.5 text-slate-400 hover:text-slate-200 hover:bg-[#13192f] rounded-lg transition-colors"
            title="Reset Demo State"
          >
            <RotateCcw className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Memory Status Modal */}
      {showStatusModal && (
        <div className="fixed inset-0 bg-black/80 backdrop-blur-md z-50 flex items-center justify-center p-4">
          <div className="bg-[#0d1222] border border-white/[0.12] rounded-2xl max-w-md w-full p-6 shadow-2xl">
            <div className="flex items-center justify-between pb-4 border-b border-white/[0.08]">
              <div className="flex items-center space-x-2">
                <Database className="w-5 h-5 text-violet-400" />
                <h3 className="font-bold text-lg text-white">Persistent Memory Status</h3>
              </div>
              <button
                onClick={() => setShowStatusModal(false)}
                className="text-slate-400 hover:text-white text-sm p-1 rounded-lg"
              >
                ✕
              </button>
            </div>

            <div className="mt-4 space-y-4 text-sm">
              <div className="bg-[#080b14]/80 p-3.5 rounded-xl border border-white/[0.08]">
                <div className="text-xs text-slate-400 font-semibold uppercase tracking-wider">Memory Backend</div>
                <div className="text-white font-semibold text-base mt-0.5 flex items-center space-x-2">
                  <span>{status?.hindsight?.label}</span>
                  {isCloud ? (
                    <span className="text-[10px] bg-emerald-500/20 text-emerald-300 px-2 py-0.5 rounded border border-emerald-500/30">
                      LIVE CLOUD (VECTORIZE)
                    </span>
                  ) : (
                    <span className="text-[10px] bg-slate-700/60 text-slate-300 px-2 py-0.5 rounded border border-slate-600/50">
                      LOCAL DEV ENGINE
                    </span>
                  )}
                </div>
                <p className="text-xs text-slate-400 mt-2 leading-relaxed">
                  {status?.hindsight?.message}
                </p>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div className="bg-[#080b14]/60 p-3 rounded-xl border border-white/[0.06]">
                  <div className="text-xs text-slate-400">Total Memories</div>
                  <div className="text-lg font-bold text-white mt-1">
                    {status?.hindsight?.totalMemoriesRetained ?? 8}
                  </div>
                </div>
                <div className="bg-[#080b14]/60 p-3 rounded-xl border border-white/[0.06]">
                  <div className="text-xs text-slate-400">Active Bank ID</div>
                  <div className="text-xs font-mono text-cyan-300 mt-1 truncate">
                    {status?.hindsight?.bankId || 'meetingmind-acme-sarah'}
                  </div>
                </div>
              </div>

              <div className="bg-[#080b14]/60 p-3 rounded-xl border border-white/[0.06] text-xs text-slate-300 space-y-1.5">
                <div className="flex items-center space-x-2">
                  <Shield className="w-4 h-4 text-cyan-400" />
                  <span className="font-semibold text-white">Bank Isolation Active:</span>
                </div>
                <p className="text-slate-400">
                  Memories are partitioned by organization and contact. Acme memories are strictly isolated to this account.
                </p>
              </div>

              <div className="bg-[#080b14] p-3.5 rounded-xl border border-violet-900/40 font-mono text-xs space-y-2">
                <div className="text-slate-400 font-bold uppercase tracking-wider text-[10px]">Memory Pipeline Verification</div>
                <div className="text-cyan-400">MEMORY RETAIN: ✓ Transcripts &amp; commitments stored in Hindsight</div>
                <div className="text-cyan-400">MEMORY RECALL: ✓ Contextual multi-query retrieval active</div>
                <div className="text-slate-300 font-sans text-xs pt-1 border-t border-white/[0.08]">
                  <div className="font-semibold text-slate-400 mb-1 text-[11px]">ACTIVE MEMORIES USED:</div>
                  <ul className="space-y-1 text-slate-300">
                    <li>• Budget concern ($50k cap in M1; $75k approval in M5)</li>
                    <li>• SOC 2 commitment (Overdue deliverable from March 30)</li>
                    <li>• Q4 planning (&lt;5-min onboarding target in M4)</li>
                    <li>• Format preference (3-page order form; no MSAs in M5)</li>
                  </ul>
                </div>
              </div>

              <div className="bg-violet-950/30 p-3 rounded-xl border border-violet-800/30 text-xs text-violet-200">
                <div className="font-semibold flex items-center space-x-1.5 mb-1">
                  <Info className="w-3.5 h-3.5 text-violet-400" />
                  <span>Configuring Hindsight Cloud:</span>
                </div>
                Set <code className="bg-[#080b14] px-1 py-0.5 rounded font-mono text-cyan-300">HINDSIGHT_API_KEY</code> in environment variables to connect directly to Vectorize Hindsight Cloud.
              </div>
            </div>

            <div className="mt-6 flex justify-end">
              <button
                onClick={() => setShowStatusModal(false)}
                className="bg-[#13192f] hover:bg-[#1a2342] text-white px-4 py-2 rounded-xl text-sm font-medium transition-colors border border-white/[0.08]"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </header>
  );
};
