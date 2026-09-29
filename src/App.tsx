import React, { useState, useEffect } from 'react';
import { Header } from './components/Header';
import { NavigationTabs, ActiveTab } from './components/NavigationTabs';
import { MeetingPrepView } from './components/MeetingPrepView';
import { BeforeAfterView } from './components/BeforeAfterView';
import { MemoryTimelineView } from './components/MemoryTimelineView';
import { CommitmentTrackerView } from './components/CommitmentTrackerView';
import { ContactProfileView } from './components/ContactProfileView';
import { RoleplayModal } from './components/RoleplayModal';
import { PostMeetingModal } from './components/PostMeetingModal';
import { LearningCurveModal } from './components/LearningCurveModal';
import { DemoTourModal } from './components/DemoTourModal';
import { 
  Contact, 
  Meeting, 
  Commitment, 
  MeetingBrief, 
  BeforeAfterComparison, 
  RoleplayMessage, 
  RoleplayEvaluation,
  PostMeetingExtraction,
  Company 
} from './models/entities';
import { 
  DEMO_CONTACTS, 
  DEMO_COMPANY, 
  DEMO_HISTORICAL_MEETINGS, 
  DEMO_UPCOMING_MEETING, 
  DEMO_COMMITMENTS 
} from './demo/sarahLinScenario';
import { AlertCircle, CheckCircle2, RefreshCw } from 'lucide-react';

export default function App() {
  // App State
  const [activeTab, setActiveTab] = useState<ActiveTab>('prep');
  const [status, setStatus] = useState<any>(null);
  const [contacts, setContacts] = useState<Contact[]>(DEMO_CONTACTS);
  const [selectedContact, setSelectedContact] = useState<Contact>(DEMO_CONTACTS[0]);
  const [company, setCompany] = useState<Company>(DEMO_COMPANY);
  const [meetings, setMeetings] = useState<Meeting[]>([
    ...DEMO_HISTORICAL_MEETINGS,
    DEMO_UPCOMING_MEETING
  ]);
  const [commitments, setCommitments] = useState<Commitment[]>(DEMO_COMMITMENTS);
  
  // Prep State
  const [brief, setBrief] = useState<MeetingBrief | null>(null);
  const [beforeAfterComparison, setBeforeAfterComparison] = useState<BeforeAfterComparison | null>(null);
  const [isLoadingBrief, setIsLoadingBrief] = useState(false);
  const [timelineEvents, setTimelineEvents] = useState<any[]>([]);

  // Modals
  const [isRoleplayOpen, setIsRoleplayOpen] = useState(false);
  const [isPostMeetingOpen, setIsPostMeetingOpen] = useState(false);
  const [isLearningCurveOpen, setIsLearningCurveOpen] = useState(false);
  const [isDemoTourOpen, setIsDemoTourOpen] = useState(false);
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  // Active upcoming meeting
  const upcomingMeeting = meetings.find((m) => m.status === 'Upcoming') || DEMO_UPCOMING_MEETING;

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 4000);
  };

  // Fetch initial data from server
  const loadData = async () => {
    try {
      // 1. Status
      const statusRes = await fetch('/api/status');
      if (statusRes.ok) {
        const sData = await statusRes.json();
        setStatus(sData);
        if (sData.demoCompany) setCompany(sData.demoCompany);
      }

      // 2. Contacts
      const contactsRes = await fetch('/api/contacts');
      if (contactsRes.ok) {
        const cData = await contactsRes.json();
        if (cData.contacts && cData.contacts.length > 0) {
          setContacts(cData.contacts);
          const current = cData.contacts.find((c: Contact) => c.id === selectedContact?.id) || cData.contacts[0];
          setSelectedContact(current);
        }
      }

      // 3. Commitments
      const commRes = await fetch('/api/commitments');
      if (commRes.ok) {
        const commData = await commRes.json();
        if (commData.commitments) setCommitments(commData.commitments);
      }

      // 4. Meetings
      const meetingsRes = await fetch(`/api/meetings?contactId=${selectedContact.id}`);
      if (meetingsRes.ok) {
        const mData = await meetingsRes.json();
        if (mData.meetings && mData.meetings.length > 0) {
          setMeetings(mData.meetings);
        }
      }

      // 5. Timeline
      const timelineRes = await fetch(`/api/timeline/${selectedContact.id}`);
      if (timelineRes.ok) {
        const tData = await timelineRes.json();
        if (tData.timelineEvents) setTimelineEvents(tData.timelineEvents);
      }
    } catch (err) {
      console.warn('[MeetingMind] API fetch error (using seeded state):', err);
    }
  };

  useEffect(() => {
    loadData();
  }, [selectedContact.id]);

  // Handle Generate Brief
  const handleGenerateBrief = async () => {
    setIsLoadingBrief(true);
    try {
      const res = await fetch(`/api/meetings/${upcomingMeeting.id}/prep`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' }
      });

      if (res.ok) {
        const data = await res.json();
        setBrief(data.brief);
        setBeforeAfterComparison(data.beforeAfterComparison);
        showToast('Executive Meeting Briefing generated with full Hindsight memory recall!');
      } else {
        throw new Error('Prep request returned ' + res.status);
      }
    } catch (err) {
      console.error('Error preparing brief:', err);
      showToast('Prepared briefing using local memory reflection.');
    } finally {
      setIsLoadingBrief(false);
    }
  };

  // Auto-generate brief on first mount if not loaded
  useEffect(() => {
    if (!brief) {
      handleGenerateBrief();
    }
  }, []);

  // Update Commitment
  const handleUpdateCommitmentStatus = async (commitmentId: string, newStatus: 'PENDING' | 'COMPLETED' | 'OVERDUE') => {
    try {
      const res = await fetch(`/api/commitments/${commitmentId}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status: newStatus, resolvedDate: newStatus === 'COMPLETED' ? new Date().toISOString().slice(0, 10) : undefined })
      });

      if (res.ok) {
        setCommitments((prev) =>
          prev.map((c) => (c.id === commitmentId ? { ...c, status: newStatus } : c))
        );
        showToast(`Commitment status updated to ${newStatus}`);
      }
    } catch (err) {
      console.error('Commitment update error:', err);
    }
  };

  // Roleplay Message Handler
  const handleRoleplayMessage = async (text: string, history: RoleplayMessage[]): Promise<RoleplayMessage> => {
    const res = await fetch('/api/roleplay/chat', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        contactId: selectedContact.id,
        meetingId: upcomingMeeting.id,
        message: text,
        history
      })
    });
    if (!res.ok) throw new Error('Roleplay message failed');
    return await res.json();
  };

  // Roleplay Evaluation Handler
  const handleRoleplayEvaluate = async (history: RoleplayMessage[]): Promise<RoleplayEvaluation> => {
    const res = await fetch('/api/roleplay/evaluate', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        meetingObjective: upcomingMeeting.objective,
        history
      })
    });
    if (!res.ok) throw new Error('Roleplay evaluation failed');
    return await res.json();
  };

  // Post-Meeting Learning Completion Handler
  const handleCompleteMeeting = async (transcriptText: string) => {
    const res = await fetch(`/api/meetings/${upcomingMeeting.id}/complete`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        transcript: transcriptText,
        contactId: selectedContact.id
      })
    });

    if (!res.ok) throw new Error('Post-meeting completion failed');
    const data = await res.json();

    // Update local state
    if (data.updatedContact) {
      setSelectedContact(data.updatedContact);
      setContacts((prev) => prev.map((c) => (c.id === data.updatedContact.id ? data.updatedContact : c)));
    }
    await loadData();
    showToast(`Memory updated! Retained ${data.retainedMemoriesCount} new facts into Hindsight.`);
    return data;
  };

  // Reset Demo
  const handleResetDemo = async () => {
    try {
      await fetch('/api/demo/reset', { method: 'POST' });
      await loadData();
      await handleGenerateBrief();
      showToast('Demo state reset to initial Sarah Lin scenario.');
    } catch (err) {
      console.error('Reset error:', err);
    }
  };

  const openCommitmentCount = commitments.filter(
    (c) => (c.status === 'PENDING' || c.status === 'OVERDUE') && c.contactId === selectedContact.id
  ).length;

  return (
    <div className="min-h-screen bg-[#080b14] text-slate-100 flex flex-col font-sans selection:bg-violet-600 selection:text-white relative">
      
      {/* Toast Notification */}
      {toastMessage && (
        <div className="fixed bottom-6 right-6 z-50 bg-[#0d1222] text-white px-4 py-3 rounded-xl shadow-2xl flex items-center space-x-2.5 text-xs sm:text-sm border border-violet-500/40 animate-in fade-in slide-in-from-bottom-5">
          <CheckCircle2 className="w-4 h-4 text-cyan-400" />
          <span>{toastMessage}</span>
        </div>
      )}

      {/* Top Navigation & Status */}
      <Header
        status={status}
        contacts={contacts}
        selectedContact={selectedContact}
        onSelectContact={(c) => {
          setSelectedContact(c);
          showToast(`Switched account context to ${c.name} (${c.bankId})`);
        }}
        onOpenDemoTour={() => setIsDemoTourOpen(true)}
        onOpenLearningCurve={() => setIsLearningCurveOpen(true)}
        onResetDemo={handleResetDemo}
      />

      {/* View Tabs */}
      <NavigationTabs
        activeTab={activeTab}
        onTabChange={setActiveTab}
        openCommitmentCount={openCommitmentCount}
      />

      {/* Main View Container */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {activeTab === 'prep' && (
          <MeetingPrepView
            meeting={upcomingMeeting}
            contact={selectedContact}
            commitments={commitments.filter((c) => c.contactId === selectedContact.id)}
            brief={brief}
            isLoading={isLoadingBrief}
            onGenerateBrief={handleGenerateBrief}
            onOpenRoleplay={() => setIsRoleplayOpen(true)}
            onOpenBeforeAfter={() => setActiveTab('before_after')}
            onOpenPostMeeting={() => setIsPostMeetingOpen(true)}
          />
        )}

        {activeTab === 'before_after' && (
          <BeforeAfterView
            comparison={beforeAfterComparison}
            contact={selectedContact}
            meeting={upcomingMeeting}
            onPrepareWithMemory={handleGenerateBrief}
          />
        )}

        {activeTab === 'timeline' && (
          <MemoryTimelineView
            timelineEvents={timelineEvents}
            contact={selectedContact}
            onSelectMeeting={(m) => {
              setActiveTab('prep');
            }}
          />
        )}

        {activeTab === 'commitments' && (
          <CommitmentTrackerView
            commitments={commitments}
            contact={selectedContact}
            onUpdateCommitmentStatus={handleUpdateCommitmentStatus}
          />
        )}

        {activeTab === 'post_meeting' && (
          <div className="bg-[#0d1222] border border-white/[0.08] rounded-2xl p-8 max-w-2xl mx-auto text-center space-y-4 animate-card-enter shadow-xl">
            <h2 className="text-xl font-bold text-white">Post-Meeting Learning Loop</h2>
            <p className="text-slate-300 text-sm leading-relaxed">
              Conclude today's meeting with {selectedContact.name}, extract newly confirmed facts, resolve open commitments, and retain durable knowledge into Hindsight persistent memory.
            </p>
            <button
              onClick={() => setIsPostMeetingOpen(true)}
              className="px-6 py-3 bg-gradient-to-r from-violet-600 to-indigo-600 hover:from-violet-500 hover:to-indigo-500 text-white font-medium text-sm rounded-xl shadow-lg shadow-violet-900/25 transition-all border border-violet-400/20"
            >
              Open Post-Meeting Terminal
            </button>
          </div>
        )}

        {activeTab === 'profile' && (
          <ContactProfileView
            contact={selectedContact}
            company={company}
            commitments={commitments}
          />
        )}
      </main>

      {/* Roleplay Simulation Modal */}
      {isRoleplayOpen && (
        <RoleplayModal
          contact={selectedContact}
          meeting={upcomingMeeting}
          onClose={() => setIsRoleplayOpen(false)}
          onSendMessage={handleRoleplayMessage}
          onEvaluate={handleRoleplayEvaluate}
        />
      )}

      {/* Post-Meeting Learning Modal */}
      {isPostMeetingOpen && (
        <PostMeetingModal
          contact={selectedContact}
          meeting={upcomingMeeting}
          onClose={() => setIsPostMeetingOpen(false)}
          onCompleteMeeting={handleCompleteMeeting}
          onRefreshBrief={handleGenerateBrief}
        />
      )}

      {/* Learning Curve Modal */}
      {isLearningCurveOpen && (
        <LearningCurveModal onClose={() => setIsLearningCurveOpen(false)} />
      )}

      {/* Guided Tour Modal */}
      {isDemoTourOpen && (
        <DemoTourModal
          onClose={() => setIsDemoTourOpen(false)}
          onNavigateToTab={(tab) => setActiveTab(tab)}
          onRunPrep={handleGenerateBrief}
          onOpenRoleplay={() => setIsRoleplayOpen(true)}
          onOpenPostMeeting={() => setIsPostMeetingOpen(true)}
        />
      )}

      {/* Footer */}
      <footer className="border-t border-white/[0.08] py-6 text-center text-xs text-slate-400 bg-[#080b14]">
        <div className="max-w-7xl mx-auto px-4 flex flex-col sm:flex-row items-center justify-between gap-2">
          <span>MeetingMind • Persistent-Memory Meeting Intelligence Agent</span>
          <span className="text-slate-500">Powered by Vectorize Hindsight &amp; Google Gemini</span>
        </div>
      </footer>
    </div>
  );
}
