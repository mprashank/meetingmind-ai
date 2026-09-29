import React from 'react';
import { FileText, GitCompare, History, CheckSquare, Sparkles, UserCheck } from 'lucide-react';

export type ActiveTab = 'prep' | 'before_after' | 'timeline' | 'commitments' | 'post_meeting' | 'profile';

interface NavigationTabsProps {
  activeTab: ActiveTab;
  onTabChange: (tab: ActiveTab) => void;
  openCommitmentCount: number;
}

export const NavigationTabs: React.FC<NavigationTabsProps> = ({
  activeTab,
  onTabChange,
  openCommitmentCount
}) => {
  const tabs = [
    {
      id: 'prep' as ActiveTab,
      label: 'Meeting Prep & Brief',
      icon: FileText,
      badge: 'Active'
    },
    {
      id: 'before_after' as ActiveTab,
      label: 'Before vs After Memory',
      icon: GitCompare,
      highlight: true
    },
    {
      id: 'timeline' as ActiveTab,
      label: 'Memory Timeline',
      icon: History
    },
    {
      id: 'commitments' as ActiveTab,
      label: 'Open Commitments',
      icon: CheckSquare,
      count: openCommitmentCount
    },
    {
      id: 'post_meeting' as ActiveTab,
      label: 'Post-Meeting Learning',
      icon: Sparkles
    },
    {
      id: 'profile' as ActiveTab,
      label: 'Contact Intelligence',
      icon: UserCheck
    }
  ];

  return (
    <div className="border-b border-white/[0.08] bg-[#080b14]/80 sticky top-16 z-30 backdrop-blur-xl">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <nav className="flex space-x-1 sm:space-x-2 overflow-x-auto py-2.5 no-scrollbar" aria-label="Tabs">
          {tabs.map((tab) => {
            const Icon = tab.icon;
            const isActive = activeTab === tab.id;
            return (
              <button
                key={tab.id}
                onClick={() => onTabChange(tab.id)}
                className={`flex items-center space-x-2 px-3.5 py-2 rounded-xl text-xs sm:text-sm font-medium whitespace-nowrap transition-all ${
                  isActive
                    ? 'bg-gradient-to-r from-violet-600 to-indigo-600 text-white shadow-md shadow-violet-900/30 border border-violet-400/30'
                    : 'text-slate-400 hover:text-slate-200 hover:bg-[#0d1222] border border-transparent'
                }`}
              >
                <Icon className={`w-4 h-4 ${isActive ? 'text-cyan-300' : 'text-slate-400'}`} />
                <span>{tab.label}</span>
                {tab.count !== undefined && tab.count > 0 && (
                  <span className={`text-[10px] font-bold px-1.5 py-0.2 rounded-full ${
                    isActive ? 'bg-white text-violet-900' : 'bg-cyan-500/20 text-cyan-300 border border-cyan-500/30'
                  }`}>
                    {tab.count}
                  </span>
                )}
                {tab.badge && !isActive && (
                  <span className="text-[10px] uppercase font-semibold tracking-wider px-1.5 py-0.2 rounded-md bg-violet-500/15 text-violet-300 border border-violet-500/25">
                    {tab.badge}
                  </span>
                )}
              </button>
            );
          })}
        </nav>
      </div>
    </div>
  );
};
