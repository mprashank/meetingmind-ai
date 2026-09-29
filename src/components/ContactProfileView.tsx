import React from 'react';
import { Contact, Company, Commitment } from '../models/entities';
import { Mail, Shield, CheckCircle2, AlertCircle, Heart, Sparkles } from 'lucide-react';

interface ContactProfileViewProps {
  contact: Contact;
  company: Company | null;
  commitments: Commitment[];
}

export const ContactProfileView: React.FC<ContactProfileViewProps> = ({
  contact,
  company,
  commitments
}) => {
  return (
    <div className="space-y-6 animate-card-enter">
      
      {/* Header Card */}
      <div className="bg-[#0d1222] border border-white/[0.08] rounded-2xl p-6 sm:p-7 shadow-xl relative overflow-hidden">
        <div className="absolute top-0 right-0 w-80 h-80 bg-violet-600/10 rounded-full blur-3xl pointer-events-none" />
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 relative z-10">
          <div className="flex items-center space-x-4">
            <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-violet-600 to-indigo-700 flex items-center justify-center text-white text-xl font-bold shadow-lg shadow-violet-900/30 border border-violet-400/20">
              {contact.name.split(' ').map((n) => n[0]).join('')}
            </div>
            <div>
              <div className="flex items-center space-x-2">
                <h1 className="text-2xl font-bold text-white tracking-tight">{contact.name}</h1>
                <span className={`text-[10px] uppercase font-bold px-2 py-0.5 rounded-md ${
                  contact.relationshipStatus === 'Needs Attention'
                    ? 'bg-amber-500/15 text-amber-300 border border-amber-500/25'
                    : 'bg-cyan-500/15 text-cyan-300 border border-cyan-500/25'
                }`}>
                  {contact.relationshipStatus}
                </span>
              </div>
              <p className="text-sm text-slate-300 mt-0.5">{contact.role} at {contact.companyName}</p>
              <div className="mt-1.5 flex flex-wrap items-center gap-x-4 gap-y-1 text-xs text-slate-400">
                <span className="flex items-center space-x-1">
                  <Mail className="w-3.5 h-3.5 text-slate-400" />
                  <span>{contact.email}</span>
                </span>
                <span>Bank: <code className="text-cyan-300 font-mono text-[11px]">{contact.bankId}</code></span>
              </div>
            </div>
          </div>

          <div className="flex items-center space-x-3 text-xs">
            <div className="bg-[#080b14]/70 px-4 py-2.5 rounded-xl border border-white/[0.06] text-center min-w-[80px]">
              <span className="text-slate-400 block text-[10px]">Meetings</span>
              <span className="text-white font-bold text-base font-mono">{contact.meetingCount}</span>
            </div>
            <div className="bg-[#080b14]/70 px-4 py-2.5 rounded-xl border border-white/[0.06] text-center min-w-[110px]">
              <span className="text-slate-400 block text-[10px]">Last Interaction</span>
              <span className="text-violet-300 font-semibold">{contact.lastInteractionDate}</span>
            </div>
          </div>
        </div>
      </div>

      {/* Relationship Momentum Reason */}
      <div className={`p-4 rounded-xl border flex items-start space-x-3 text-xs sm:text-sm ${
        contact.relationshipStatus === 'Needs Attention'
          ? 'bg-amber-950/20 border-amber-500/30 text-amber-200'
          : 'bg-cyan-950/20 border-cyan-500/30 text-cyan-200'
      }`}>
        <AlertCircle className="w-5 h-5 flex-shrink-0 mt-0.5 text-cyan-400" />
        <div>
          <span className="font-bold text-white">Relationship Status Evidence:</span>
          <p className="mt-0.5 text-xs text-slate-300 leading-relaxed">{contact.relationshipStatusReason}</p>
        </div>
      </div>

      {/* Split: Confirmed Facts vs Inferred Insights */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">

        {/* Confirmed Facts */}
        <div className="bg-[#0d1222] border border-white/[0.08] rounded-2xl p-6 shadow-lg space-y-4">
          <div className="flex items-center space-x-2 pb-3 border-b border-white/[0.06]">
            <CheckCircle2 className="w-5 h-5 text-cyan-400" />
            <div>
              <h2 className="text-base font-bold text-white">Confirmed Historical Facts</h2>
              <p className="text-xs text-slate-400">Explicitly stated in transcripts and documented meetings</p>
            </div>
          </div>

          <ul className="space-y-2.5 text-xs text-slate-200">
            {contact.confirmedFacts.map((fact, idx) => (
              <li key={idx} className="flex items-start space-x-2.5 bg-[#080b14]/70 p-3 rounded-xl border border-white/[0.06]">
                <span className="text-cyan-400 font-bold">•</span>
                <span className="leading-relaxed">{fact}</span>
              </li>
            ))}
          </ul>
        </div>

        {/* AI-Generated Inferences */}
        <div className="bg-[#0d1222] border border-white/[0.08] rounded-2xl p-6 shadow-lg space-y-4">
          <div className="flex items-center space-x-2 pb-3 border-b border-white/[0.06]">
            <Sparkles className="w-5 h-5 text-violet-400" />
            <div>
              <h2 className="text-base font-bold text-white">AI-Generated Inferences</h2>
              <p className="text-xs text-slate-400">Synthesized patterns (clearly separated from confirmed facts)</p>
            </div>
          </div>

          <ul className="space-y-2.5 text-xs text-slate-200">
            {contact.inferredInsights.map((insight, idx) => (
              <li key={idx} className="flex items-start space-x-2.5 bg-[#080b14]/70 p-3 rounded-xl border border-violet-500/20">
                <span className="text-violet-400 font-bold">~</span>
                <span className="leading-relaxed">{insight}</span>
              </li>
            ))}
          </ul>
        </div>
      </div>

      {/* Preferences & Recurring Concerns */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">

        {/* Known Preferences */}
        <div className="bg-[#0d1222] border border-white/[0.08] rounded-2xl p-6 shadow-lg space-y-4">
          <div className="flex items-center space-x-2 pb-3 border-b border-white/[0.06]">
            <Heart className="w-5 h-5 text-violet-400" />
            <div>
              <h2 className="text-base font-bold text-white">Documented Preferences</h2>
              <p className="text-xs text-slate-400">Format, communication, and process guidelines</p>
            </div>
          </div>

          <ul className="space-y-2 text-xs text-slate-200">
            {contact.knownPreferences.map((pref, idx) => (
              <li key={idx} className="flex items-start space-x-2 bg-[#080b14]/70 p-3 rounded-xl border border-white/[0.06]">
                <span className="text-violet-400">♥</span>
                <span>{pref}</span>
              </li>
            ))}
          </ul>
        </div>

        {/* Recurring Concerns */}
        <div className="bg-[#0d1222] border border-white/[0.08] rounded-2xl p-6 shadow-lg space-y-4">
          <div className="flex items-center space-x-2 pb-3 border-b border-white/[0.06]">
            <Shield className="w-5 h-5 text-amber-400" />
            <div>
              <h2 className="text-base font-bold text-white">Repeated Concerns</h2>
              <p className="text-xs text-slate-400">Themes that repeatedly surfaced across meetings</p>
            </div>
          </div>

          <ul className="space-y-2 text-xs text-slate-200">
            {contact.repeatedConcerns.map((concern, idx) => (
              <li key={idx} className="flex items-start space-x-2 bg-[#080b14]/70 p-3 rounded-xl border border-white/[0.06]">
                <span className="text-amber-400 font-bold">⚠</span>
                <span>{concern}</span>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </div>
  );
};
