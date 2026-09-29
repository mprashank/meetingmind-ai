import React, { useState } from 'react';
import { DEMO_LEARNING_CURVE_STEPS } from '../demo/sarahLinScenario';
import { LineChart, ChevronRight } from 'lucide-react';

interface LearningCurveModalProps {
  onClose: () => void;
}

export const LearningCurveModal: React.FC<LearningCurveModalProps> = ({ onClose }) => {
  const [activeStepIndex, setActiveStepIndex] = useState(0);

  const steps = DEMO_LEARNING_CURVE_STEPS;
  const currentStep = steps[activeStepIndex];

  return (
    <div className="fixed inset-0 bg-black/80 backdrop-blur-md z-50 flex items-center justify-center p-3 sm:p-6 overflow-y-auto">
      <div className="bg-[#0d1222] border border-white/[0.12] rounded-2xl max-w-3xl w-full p-6 sm:p-7 shadow-2xl space-y-6 animate-card-enter">
        
        {/* Header */}
        <div className="flex items-center justify-between pb-4 border-b border-white/[0.08]">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 rounded-xl bg-violet-600/20 text-cyan-300 flex items-center justify-center border border-violet-500/30 shadow-sm">
              <LineChart className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center space-x-2">
                <h3 className="font-bold text-white text-lg">60-Second Persistent Learning Curve</h3>
                <span className="text-[10px] uppercase font-bold px-2 py-0.5 rounded-md bg-cyan-500/15 text-cyan-300 border border-cyan-500/25">
                  Hindsight Retain
                </span>
              </div>
              <p className="text-xs text-slate-400">
                Watch MeetingMind compound relationship intelligence across 5 progressive interactions
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

        {/* Step Selector Pills */}
        <div className="grid grid-cols-5 gap-2">
          {steps.map((s, idx) => (
            <button
              key={s.stepNumber}
              onClick={() => setActiveStepIndex(idx)}
              className={`p-2.5 rounded-xl border text-center transition-all ${
                activeStepIndex === idx
                  ? 'bg-gradient-to-r from-violet-600 to-indigo-600 border-violet-400/50 text-white shadow-md shadow-violet-900/30 scale-[1.02]'
                  : activeStepIndex > idx
                  ? 'bg-[#13192f] border-white/[0.08] text-slate-300'
                  : 'bg-[#080b14]/60 border-white/[0.04] text-slate-500'
              }`}
            >
              <div className="text-[10px] font-bold uppercase tracking-wider">
                Step {s.stepNumber}
              </div>
              <div className="text-xs font-semibold mt-0.5 truncate hidden sm:block">
                Meeting {s.stepNumber}
              </div>
            </button>
          ))}
        </div>

        {/* Step Visual Detail Card */}
        <div className="bg-[#080b14]/70 border border-white/[0.08] rounded-2xl p-6 space-y-4 relative overflow-hidden">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pb-3 border-b border-white/[0.06]">
            <div>
              <span className="text-xs font-bold text-cyan-400 uppercase tracking-wider block">
                {currentStep.date}
              </span>
              <h4 className="text-xl font-bold text-white mt-0.5">
                {currentStep.meetingTitle}
              </h4>
            </div>
            <div className="bg-[#0d1222] px-3 py-1.5 rounded-xl border border-white/[0.08] text-xs text-violet-300 font-mono">
              Total Retained: <strong className="text-cyan-300">{currentStep.retainedCount} memories</strong>
            </div>
          </div>

          <div className="space-y-3 text-sm">
            <div className="bg-[#0d1222] p-3.5 rounded-xl border border-white/[0.06]">
              <span className="text-xs font-bold text-cyan-400 uppercase tracking-wider block mb-1">
                Newly Ingested Knowledge
              </span>
              <p className="text-slate-200 text-xs sm:text-sm">{currentStep.knowledgeLearned}</p>
            </div>

            <div className="bg-[#0d1222] p-3.5 rounded-xl border border-white/[0.06]">
              <span className="text-xs font-bold text-violet-400 uppercase tracking-wider block mb-1">
                Agent Capability Advancement
              </span>
              <p className="text-slate-200 text-xs sm:text-sm">{currentStep.agentAdvancement}</p>
            </div>

            <div className="bg-[#0d1222] p-3.5 rounded-xl border border-white/[0.06]">
              <span className="text-xs font-bold text-slate-400 uppercase tracking-wider block mb-1">
                Evolved Briefing Snippet
              </span>
              <p className="text-slate-200 font-mono text-xs italic">{currentStep.sampleBriefSnippet}</p>
            </div>
          </div>
        </div>

        {/* Navigation Footer */}
        <div className="flex items-center justify-between pt-2">
          <button
            onClick={() => setActiveStepIndex((prev) => Math.max(0, prev - 1))}
            disabled={activeStepIndex === 0}
            className="px-4 py-2 bg-[#13192f] hover:bg-[#1a2342] disabled:opacity-30 text-white rounded-xl text-xs font-medium transition-colors border border-white/[0.06]"
          >
            Previous
          </button>
          <div className="text-xs text-slate-400 font-medium">
            Interaction {activeStepIndex + 1} of {steps.length}
          </div>
          {activeStepIndex < steps.length - 1 ? (
            <button
              onClick={() => setActiveStepIndex((prev) => Math.min(steps.length - 1, prev + 1))}
              className="px-5 py-2 bg-gradient-to-r from-violet-600 to-indigo-600 hover:from-violet-500 hover:to-indigo-500 text-white rounded-xl text-xs font-semibold flex items-center space-x-1.5 transition-all shadow-md shadow-violet-900/25 border border-violet-400/20"
            >
              <span>Next Interaction</span>
              <ChevronRight className="w-4 h-4" />
            </button>
          ) : (
            <button
              onClick={onClose}
              className="px-5 py-2 bg-gradient-to-r from-violet-600 to-indigo-600 hover:from-violet-500 hover:to-indigo-500 text-white rounded-xl text-xs font-semibold transition-all border border-violet-400/20"
            >
              Got It
            </button>
          )}
        </div>
      </div>
    </div>
  );
};
