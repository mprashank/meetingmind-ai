import React, { useState } from 'react';
import { Play, ArrowRight, ChevronRight } from 'lucide-react';

interface DemoTourModalProps {
  onClose: () => void;
  onNavigateToTab: (tab: any) => void;
  onRunPrep: () => void;
  onOpenRoleplay: () => void;
  onOpenPostMeeting: () => void;
}

export const DemoTourModal: React.FC<DemoTourModalProps> = ({
  onClose,
  onNavigateToTab,
  onRunPrep,
  onOpenRoleplay,
  onOpenPostMeeting
}) => {
  const [currentStep, setCurrentStep] = useState(0);

  const steps = [
    {
      title: '1. The Real Professional Problem',
      badge: 'The Challenge',
      desc: 'Sales and account executives walk into meetings without remembering what was discussed weeks ago, what promises were made, or what priorities shifted.',
      actionLabel: 'See Sarah Lin Scenario',
      action: () => onNavigateToTab('prep')
    },
    {
      title: '2. Multi-Interaction Relationship History',
      badge: 'Past Interactions',
      desc: 'Sarah Lin (VP Product at Acme) has had 5 previous meetings with our team. In Meeting 2, our team promised a SOC 2 whitepaper by March 30, but missed the deadline!',
      actionLabel: 'Inspect Memory Timeline',
      action: () => onNavigateToTab('timeline')
    },
    {
      title: '3. Contextual Recall & Reflection',
      badge: 'Hindsight in Action',
      desc: 'MeetingMind does not search just Sarah’s name. It generates objective-driven queries to recall the missed commitment, the $75k budget approval, and the Q4 onboarding pivot.',
      actionLabel: 'Generate Executive Brief',
      action: () => {
        onNavigateToTab('prep');
        onRunPrep();
      }
    },
    {
      title: '4. Before vs After Memory Difference',
      badge: 'The Proof',
      desc: 'Witness the difference: Without memory, AI suggests generic slide decks and a 45-page MSA. With memory, MeetingMind immediately confronts the overdue SOC 2 deliverable and pitches the 3-minute quickstart.',
      actionLabel: 'View Comparison',
      action: () => onNavigateToTab('before_after')
    },
    {
      title: '5. Grounded Roleplay Practice',
      badge: 'Simulation',
      desc: 'Practice the high-stakes conversation before stepping into the room. Sarah will challenge you on the delayed SOC 2 report and probe your under-5-minute onboarding metric.',
      actionLabel: 'Open Practice Simulator',
      action: () => onOpenRoleplay()
    },
    {
      title: '6. Post-Meeting Learning Loop',
      badge: 'Continuous Learning',
      desc: 'The meeting concluded successfully! You hand over the SOC 2 report and Sarah signs the order form. Paste the transcript, extract new knowledge, and retain into Hindsight.',
      actionLabel: 'Complete Meeting & Retain',
      action: () => onOpenPostMeeting()
    }
  ];

  const step = steps[currentStep];

  return (
    <div className="fixed inset-0 bg-black/80 backdrop-blur-md z-50 flex items-center justify-center p-3 sm:p-6 overflow-y-auto">
      <div className="bg-[#0d1222] border border-white/[0.12] rounded-2xl max-w-xl w-full p-6 sm:p-7 shadow-2xl space-y-6 animate-card-enter">
        
        {/* Header */}
        <div className="flex items-center justify-between pb-3 border-b border-white/[0.08]">
          <div className="flex items-center space-x-2.5">
            <div className="p-2 rounded-xl bg-violet-600/20 text-cyan-300 border border-violet-500/30">
              <Play className="w-5 h-5 fill-current" />
            </div>
            <div>
              <h3 className="font-bold text-white text-base">MeetingMind Hackathon Narrative Tour</h3>
              <p className="text-xs text-slate-400">Step {currentStep + 1} of {steps.length}</p>
            </div>
          </div>
          <button onClick={onClose} className="text-slate-400 hover:text-white p-1 text-sm rounded-lg">
            ✕
          </button>
        </div>

        {/* Step Content */}
        <div className="bg-[#080b14]/70 p-5 rounded-2xl border border-white/[0.06] space-y-3">
          <div className="flex items-center justify-between">
            <span className="text-[10px] uppercase font-bold px-2 py-0.5 rounded-md bg-violet-500/15 text-violet-300 border border-violet-500/25">
              {step.badge}
            </span>
          </div>
          <h4 className="text-lg font-bold text-white">{step.title}</h4>
          <p className="text-xs sm:text-sm text-slate-300 leading-relaxed">{step.desc}</p>
          
          <div className="pt-2">
            <button
              onClick={() => {
                step.action();
                onClose();
              }}
              className="w-full py-2.5 bg-gradient-to-r from-violet-600 to-indigo-600 hover:from-violet-500 hover:to-indigo-500 text-white font-semibold text-xs rounded-xl shadow-md transition-all flex items-center justify-center space-x-2 border border-violet-400/20"
            >
              <span>{step.actionLabel}</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Navigation */}
        <div className="flex items-center justify-between pt-2">
          <button
            onClick={() => setCurrentStep((prev) => Math.max(0, prev - 1))}
            disabled={currentStep === 0}
            className="px-4 py-2 bg-[#13192f] hover:bg-[#1a2342] disabled:opacity-30 text-white rounded-xl text-xs font-medium transition-colors border border-white/[0.06]"
          >
            Previous
          </button>
          
          <div className="flex space-x-1.5">
            {steps.map((_, idx) => (
              <div
                key={idx}
                className={`w-2.5 h-2.5 rounded-full transition-all ${
                  currentStep === idx ? 'bg-cyan-400 scale-125' : 'bg-slate-700'
                }`}
              />
            ))}
          </div>

          {currentStep < steps.length - 1 ? (
            <button
              onClick={() => setCurrentStep((prev) => prev + 1)}
              className="px-4 py-2 bg-gradient-to-r from-violet-600 to-indigo-600 hover:from-violet-500 hover:to-indigo-500 text-white rounded-xl text-xs font-semibold flex items-center space-x-1 transition-all border border-violet-400/20"
            >
              <span>Next</span>
              <ChevronRight className="w-3.5 h-3.5" />
            </button>
          ) : (
            <button
              onClick={onClose}
              className="px-4 py-2 bg-gradient-to-r from-violet-600 to-indigo-600 hover:from-violet-500 hover:to-indigo-500 text-white rounded-xl text-xs font-semibold transition-all border border-violet-400/20"
            >
              Complete Tour
            </button>
          )}
        </div>
      </div>
    </div>
  );
};
