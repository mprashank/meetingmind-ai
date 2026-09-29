import React, { useState } from 'react';
import { Contact, Meeting, PostMeetingExtraction } from '../models/entities';
import { DEMO_SAMPLE_POST_MEETING_TRANSCRIPT } from '../demo/sarahLinScenario';
import { Sparkles, CheckCircle2, RefreshCw, Database } from 'lucide-react';

interface PostMeetingModalProps {
  contact: Contact;
  meeting: Meeting;
  onClose: () => void;
  onCompleteMeeting: (transcript: string) => Promise<{
    extraction: PostMeetingExtraction;
    retainedMemoriesCount: number;
    resolvedCommitmentIds: string[];
  }>;
  onRefreshBrief: () => void;
}

export const PostMeetingModal: React.FC<PostMeetingModalProps> = ({
  contact,
  meeting,
  onClose,
  onCompleteMeeting,
  onRefreshBrief
}) => {
  const [transcript, setTranscript] = useState(DEMO_SAMPLE_POST_MEETING_TRANSCRIPT);
  const [isProcessing, setIsProcessing] = useState(false);
  const [result, setResult] = useState<{
    extraction: PostMeetingExtraction;
    retainedMemoriesCount: number;
    resolvedCommitmentIds: string[];
  } | null>(null);

  const handleSubmit = async () => {
    setIsProcessing(true);
    try {
      const data = await onCompleteMeeting(transcript);
      setResult(data);
    } catch (err) {
      console.error('Post meeting error:', err);
    } finally {
      setIsProcessing(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black/80 backdrop-blur-md z-50 flex items-center justify-center p-3 sm:p-6 overflow-y-auto">
      <div className="bg-[#0d1222] border border-white/[0.12] rounded-2xl max-w-2xl w-full flex flex-col max-h-[90vh] shadow-2xl overflow-hidden animate-card-enter">
        
        {/* Header */}
        <div className="p-4 sm:p-5 border-b border-white/[0.08] bg-[#080b14]/90 flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 rounded-xl bg-violet-500/20 text-violet-300 flex items-center justify-center border border-violet-500/30 shadow-sm">
              <Sparkles className="w-5 h-5 text-cyan-300" />
            </div>
            <div>
              <div className="flex items-center space-x-2">
                <h3 className="font-bold text-white text-base">Post-Meeting Learning Loop</h3>
                <span className="text-[10px] uppercase font-bold px-2 py-0.5 rounded-md bg-cyan-500/15 text-cyan-300 border border-cyan-500/25">
                  Hindsight Retain
                </span>
              </div>
              <p className="text-xs text-slate-400">
                Complete meeting with <span className="text-white font-medium">{contact.name}</span> &amp; update persistent relationship memory
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="text-slate-400 hover:text-white p-1 text-sm rounded-lg"
          >
            ✕
          </button>
        </div>

        {/* Content */}
        <div className="flex-1 p-4 sm:p-6 overflow-y-auto space-y-4">
          {!result ? (
            <>
              <div className="bg-[#080b14]/70 p-4 rounded-xl border border-white/[0.06] space-y-2 text-xs text-slate-300">
                <div className="font-semibold text-white flex items-center space-x-1.5">
                  <Database className="w-4 h-4 text-violet-400" />
                  <span>How the Learning Loop Works:</span>
                </div>
                <p className="leading-relaxed">
                  MeetingMind extracts newly established facts, resolved commitments, new promises, and shifting priorities, then persists them directly into Hindsight long-term memory so future meetings become smarter.
                </p>
              </div>

              <div className="space-y-2">
                <div className="flex items-center justify-between text-xs">
                  <label className="font-semibold text-slate-200">
                    Meeting Transcript or Summary Notes:
                  </label>
                  <button
                    onClick={() => setTranscript(DEMO_SAMPLE_POST_MEETING_TRANSCRIPT)}
                    className="text-cyan-400 hover:text-cyan-300 underline text-[11px]"
                  >
                    Reset to Demo Transcript
                  </button>
                </div>
                <textarea
                  value={transcript}
                  onChange={(e) => setTranscript(e.target.value)}
                  rows={8}
                  disabled={isProcessing}
                  className="w-full bg-[#080b14] border border-white/[0.08] rounded-xl p-3.5 text-xs text-slate-200 font-mono focus:outline-none focus:border-violet-500"
                  placeholder="Paste raw conversation transcript, audio summary, or key notes here..."
                />
              </div>

              <div className="pt-2 flex justify-end">
                <button
                  onClick={handleSubmit}
                  disabled={!transcript.trim() || isProcessing}
                  className="bg-gradient-to-r from-violet-600 to-indigo-600 hover:from-violet-500 hover:to-indigo-500 disabled:opacity-50 text-white font-semibold px-6 py-2.5 rounded-xl text-xs sm:text-sm shadow-lg shadow-violet-900/25 flex items-center space-x-2 transition-all border border-violet-400/20"
                >
                  <Sparkles className="w-4 h-4" />
                  <span>{isProcessing ? 'Analyzing & Retaining Memory...' : 'Analyze & Retain New Memory'}</span>
                </button>
              </div>
            </>
          ) : (
            /* Result Screen */
            <div className="space-y-5 animate-in fade-in duration-300">
              <div className="bg-cyan-950/20 border border-cyan-500/30 p-4 rounded-xl flex items-center space-x-3">
                <CheckCircle2 className="w-6 h-6 text-cyan-400 flex-shrink-0" />
                <div>
                  <h4 className="font-bold text-white text-base">Persistent Memory Updated!</h4>
                  <p className="text-xs text-cyan-200">
                    Retained {result.retainedMemoriesCount} new knowledge units into Hindsight bank "{contact.bankId}".
                  </p>
                </div>
              </div>

              {/* What I Learned Report */}
              <div className="space-y-4 text-xs">
                <div className="bg-[#080b14]/70 p-4 rounded-xl border border-white/[0.06] space-y-2">
                  <div className="font-bold text-violet-300 uppercase tracking-wider text-[11px]">
                    New Confirmed Facts
                  </div>
                  <ul className="space-y-1.5 text-slate-200">
                    {result.extraction.newFacts.map((fact, idx) => (
                      <li key={idx} className="flex items-start space-x-2">
                        <span className="text-cyan-400 font-bold">•</span>
                        <span>{fact}</span>
                      </li>
                    ))}
                  </ul>
                </div>

                <div className="bg-[#080b14]/70 p-4 rounded-xl border border-white/[0.06] space-y-2">
                  <div className="font-bold text-cyan-300 uppercase tracking-wider text-[11px]">
                    Resolved Commitments ({result.resolvedCommitmentIds.length})
                  </div>
                  <ul className="space-y-1.5 text-slate-200">
                    {result.extraction.completedCommitments.map((comp, idx) => (
                      <li key={idx} className="flex items-start space-x-2 text-cyan-200">
                        <span className="text-cyan-400 font-bold">✓</span>
                        <span>{comp}</span>
                      </li>
                    ))}
                  </ul>
                </div>

                <div className="bg-[#080b14]/70 p-4 rounded-xl border border-white/[0.06] space-y-2">
                  <div className="font-bold text-amber-300 uppercase tracking-wider text-[11px]">
                    New Commitments Logged
                  </div>
                  <ul className="space-y-1.5 text-slate-200">
                    {result.extraction.newCommitments.map((comm, idx) => (
                      <li key={idx} className="flex items-start space-x-2">
                        <span className="text-amber-400 font-bold">→</span>
                        <span>{comm.title} (Owner: {comm.owner}, Due: {comm.dueDate})</span>
                      </li>
                    ))}
                  </ul>
                </div>

                <div className="bg-[#080b14]/70 p-4 rounded-xl border border-white/[0.06] space-y-2">
                  <div className="font-bold text-violet-300 uppercase tracking-wider text-[11px]">
                    Decisions &amp; Next Steps
                  </div>
                  <ul className="space-y-1.5 text-slate-200">
                    {result.extraction.decisions.map((dec, idx) => (
                      <li key={idx} className="flex items-start space-x-2">
                        <span className="text-violet-400 font-bold">◆</span>
                        <span>{dec}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>

              <div className="pt-2 flex justify-between items-center border-t border-white/[0.06]">
                <span className="text-xs text-slate-400">
                  Relationship momentum updated to <strong className="text-cyan-300">Positive Momentum</strong>.
                </span>
                <button
                  onClick={() => {
                    onRefreshBrief();
                    onClose();
                  }}
                  className="bg-gradient-to-r from-violet-600 to-indigo-600 hover:from-violet-500 hover:to-indigo-500 text-white font-medium px-4 py-2 rounded-xl text-xs flex items-center space-x-1.5 shadow-md shadow-violet-900/25 border border-violet-400/20"
                >
                  <RefreshCw className="w-3.5 h-3.5" />
                  <span>Re-Generate Brief With New Memory</span>
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
