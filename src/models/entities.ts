/**
 * Core entity models for MeetingMind persistent memory agent.
 */

export type MemoryCategory =
  | 'relationship'
  | 'meeting'
  | 'commitment'
  | 'concern'
  | 'preference'
  | 'decision'
  | 'outcome'
  | 'priority_change'
  | 'company_context'
  | 'user_preference';

export type GroundingType =
  | 'FACT'
  | 'COMMITMENT'
  | 'OUTCOME'
  | 'PREFERENCE'
  | 'INFERENCE'
  | 'RECOMMENDATION';

export type CommitmentStatus = 'PENDING' | 'COMPLETED' | 'OVERDUE' | 'UNKNOWN';

export interface MemoryItem {
  id: string;
  bankId: string;
  category: MemoryCategory;
  groundingType: GroundingType;
  content: string;
  timestamp: string; // ISO string
  sourceMeetingId?: string;
  sourceMeetingTitle?: string;
  sourceDate?: string;
  confidence: number; // 0 to 1
  tags: string[];
  metadata: {
    participantId: string;
    companyId: string;
    owner?: string;
    dueDate?: string;
    status?: CommitmentStatus;
    inferredFromFactIds?: string[];
    [key: string]: unknown;
  };
}

export interface Contact {
  id: string;
  name: string;
  role: string;
  companyId: string;
  companyName: string;
  email: string;
  relationshipStatus: 'Needs Attention' | 'Stable' | 'Positive Momentum' | 'New Relationship';
  relationshipStatusReason: string;
  confirmedFacts: string[];
  inferredInsights: string[];
  knownPreferences: string[];
  repeatedConcerns: string[];
  meetingCount: number;
  lastInteractionDate: string;
  bankId: string;
}

export interface Company {
  id: string;
  name: string;
  industry: string;
  strategicPriorities: string[];
  recentDevelopments: string[];
  knownRisks: string[];
  syntheticNote: string;
}

export interface Commitment {
  id: string;
  title: string;
  description: string;
  owner: 'Our Team' | 'Customer' | string;
  dueDate: string;
  status: CommitmentStatus;
  sourceMeetingId: string;
  sourceMeetingTitle: string;
  sourceDate: string;
  contactId: string;
  resolvedDate?: string;
}

export interface Meeting {
  id: string;
  title: string;
  contactId: string;
  companyId: string;
  date: string;
  time?: string;
  meetingType: 'Discovery' | 'Technical' | 'Executive' | 'Security Review' | 'Contract' | 'Follow-up';
  objective: string;
  priority: 'High' | 'Medium' | 'Low';
  status: 'Completed' | 'Upcoming';
  transcript?: string;
  notes?: string;
  generatedMemoryIds?: string[];
  briefingId?: string;
}

export interface MemoryCitation {
  statement: string;
  memoryId: string;
  sourceMeetingId?: string;
  sourceMeetingTitle?: string;
  sourceDate?: string;
  groundingType: GroundingType;
  quote?: string;
}

export interface MeetingBrief {
  id: string;
  meetingId: string;
  generatedAt: string;
  isMemoryPowered: boolean;
  hindsightSourceCount: number;
  memoryUsageIndicator: {
    factsCount: number;
    pastMeetingsCount: number;
    bankId: string;
  };
  memoryInsights: string[];
  memoryDebugTrace?: {
    retainStatus: string;
    recallStatus: string;
    memoriesUsed: Array<{
      source: string;
      fact: string;
      category: string;
    }>;
  };
  
  // Section A-N
  executiveSummary: string;
  meetingObjective: string;
  participantProfile: {
    name: string;
    role: string;
    company: string;
    whyRelevant: string;
  };
  relationshipHistory: Array<{
    date: string;
    meetingTitle: string;
    keyTakeaway: string;
    memoryId?: string;
  }>;
  whatChanged: Array<{
    trend: string;
    comparison: string;
    memoryCitation?: MemoryCitation;
  }>;
  keyConcerns: Array<{
    concern: string;
    frequency: string;
    evidence: string;
    status: 'Active' | 'Resolved' | 'Escalating';
    memoryCitation?: MemoryCitation;
  }>;
  outstandingCommitments: Commitment[];
  decisionsMade: Array<{
    decision: string;
    date: string;
    impact: string;
    memoryCitation?: MemoryCitation;
  }>;
  knownPriorities: Array<{
    priority: string;
    shiftContext: string;
  }>;
  talkingPoints: Array<{
    id: string;
    priority: 'Must Discuss' | 'Secondary' | 'Contingent';
    point: string;
    rationale: string;
    grounding: GroundingType;
    memoryCitation?: MemoryCitation;
  }>;
  possibleObjections: Array<{
    objection: string;
    evidenceBasis: string;
    counterStrategy: string;
    confidence: 'High (Documented)' | 'Medium (Inferred)';
  }>;
  recommendedApproach: {
    structure: string;
    toneRecommendation: string;
    pacingNotes: string;
  };
  openQuestions: string[];
  risksAndBlindspots: string[];
  nextSteps: string[];
  memoryCitations: MemoryCitation[];
}

export interface RoleplayMessage {
  id: string;
  sender: 'user' | 'agent';
  text: string;
  timestamp: string;
  groundedInFact?: string;
}

export interface RoleplayEvaluation {
  clarity: { score: number; feedback: string };
  relevance: { score: number; feedback: string };
  objectionHandling: { score: number; feedback: string };
  completeness: { score: number; feedback: string };
  alignmentWithObjective: { score: number; feedback: string };
  overallSummary: string;
  strengths: string[];
  areasForImprovement: string[];
}

export interface PostMeetingExtraction {
  newFacts: string[];
  newCommitments: Array<{
    title: string;
    owner: string;
    dueDate: string;
  }>;
  completedCommitments: string[];
  newConcerns: string[];
  decisions: string[];
  priorityShifts: string[];
  preferencesLearned: string[];
  actionItems: string[];
  retainedMemoryCount: number;
  hindsightDocumentId: string;
}

export interface LearningCurveStep {
  stepNumber: number;
  meetingTitle: string;
  date: string;
  knowledgeLearned: string;
  agentAdvancement: string;
  retainedCount: number;
  sampleBriefSnippet: string;
}

export interface BeforeAfterComparison {
  withoutMemory: {
    title: string;
    subtitle: string;
    executiveSummary: string;
    historicalContext: string;
    previousCommitments: string;
    customerConcerns: string;
    importantPreferences: string;
    personalizedPoints: string;
    approach: string;
    talkingPoints: string[];
    objections: string[];
    weaknessReason: string;
  };
  withMemory: {
    title: string;
    subtitle: string;
    executiveSummary: string;
    historicalContext: string;
    previousCommitments: string;
    customerConcerns: string;
    importantPreferences: string;
    personalizedPoints: string;
    approach: string;
    talkingPoints: string[];
    objections: string[];
    criticalMemoriesRecalled: Array<{
      date: string;
      meetingTitle: string;
      memory: string;
      impactOnBrief: string;
    }>;
  };
}
