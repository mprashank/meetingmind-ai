/**
 * Deterministic Demonstration Scenario: Sarah Lin (Acme Corporation)
 * Includes 5 rich historical meetings, transcripts, extracted memories,
 * commitments, and the upcoming high-stakes meeting.
 */

import { Contact, Company, Meeting, Commitment, MemoryItem } from '../models/entities.js';

export const DEMO_COMPANY: Company = {
  id: 'acme-corp',
  name: 'Acme Corporation',
  industry: 'Enterprise B2B SaaS / FinTech Infrastructure',
  strategicPriorities: [
    'Self-serve customer onboarding in under 5 minutes',
    'Enterprise security & SOC 2 Type II compliance compliance',
    'API-first developer ecosystem expansion in Q4'
  ],
  recentDevelopments: [
    'Announced Series C expansion to scale platform integrations',
    'Undergoing annual third-party InfoSec vendor audit',
    'Consolidating external API vendors to reduce integration latency'
  ],
  knownRisks: [
    'Strict InfoSec veto power over uncertified external vendors',
    'Tight budget cycle with CFO approval required for commitments over $50k'
  ],
  syntheticNote: 'Synthesized enterprise account profile for hackathon demonstration.'
};

export const DEMO_CONTACTS: Contact[] = [
  {
    id: 'sarah-lin',
    name: 'Sarah Lin',
    role: 'VP of Product',
    companyId: 'acme-corp',
    companyName: 'Acme Corporation',
    email: 'sarah.lin@acme.example.com',
    relationshipStatus: 'Needs Attention',
    relationshipStatusReason: '1 critical commitment is OVERDUE (SOC 2 Whitepaper); security compliance unverified.',
    confirmedFacts: [
      'Joined Acme 2 years ago from Stripe; leads Core Platform & Developer Experience.',
      'Operates with strict InfoSec review mandate before any vendor pilot.',
      'Budget approved at $75k in Meeting 5 conditional on security verification.',
      'Requested official SOC 2 Type II whitepaper on March 18; promised by March 30 but missed.'
    ],
    inferredInsights: [
      'Appreciates direct, concise technical explanations over commercial sales decks.',
      'Feels internal pressure from InfoSec regarding vendor risk exposure.',
      'Prioritizes developer onboarding time-to-first-event above ancillary features.'
    ],
    knownPreferences: [
      'Concise technical bullet points with architecture diagrams',
      'No marketing buzzwords; transparent answers about limitations',
      'Prefers async documentation before live calls'
    ],
    repeatedConcerns: [
      'SOC 2 Type II compliance & audit report delivery',
      'Implementation complexity for internal engineering team',
      'Budget ceiling and transparent cost scaling'
    ],
    meetingCount: 5,
    lastInteractionDate: '2026-05-02',
    bankId: 'meetingmind-acme-sarah'
  },
  {
    id: 'michael-chen',
    name: 'Michael Chen',
    role: 'Chief Technology Officer (CTO)',
    companyId: 'acme-corp',
    companyName: 'Acme Corporation',
    email: 'michael.chen@acme.example.com',
    relationshipStatus: 'Stable',
    relationshipStatusReason: 'Attended Meeting 2; focused purely on architectural latency and API uptime SLA.',
    confirmedFacts: [
      'Demands sub-100ms API response latency for all webhook events.',
      'Required multi-region AWS fallback architecture.'
    ],
    inferredInsights: [
      'Will defer to Sarah on product workflows, but holds technical veto on infrastructure.'
    ],
    knownPreferences: [
      'OpenAPI specs and benchmark latency graphs'
    ],
    repeatedConcerns: [
      'High-throughput rate limits and 99.99% uptime guarantee'
    ],
    meetingCount: 1,
    lastInteractionDate: '2026-03-18',
    bankId: 'meetingmind-acme-michael'
  },
  {
    id: 'rachel-morgan',
    name: 'Rachel Morgan',
    role: 'Chief Financial Officer (CFO)',
    companyId: 'acme-corp',
    companyName: 'Acme Corporation',
    email: 'rachel.morgan@acme.example.com',
    relationshipStatus: 'Stable',
    relationshipStatusReason: 'Approved $75k pilot budget cap with strict quarterly milestone gates.',
    confirmedFacts: [
      'Enforces maximum initial pilot duration of 90 days before annual contract evaluation.',
      'Approved $75k pilot budget in late April review.'
    ],
    inferredInsights: [
      'Needs clear ROI metrics on developer hours saved to approve full rollout.'
    ],
    knownPreferences: [
      'Transparent tiered pricing without unexpected overage spikes'
    ],
    repeatedConcerns: [
      'Contractual opt-out clause if pilot metrics are not met'
    ],
    meetingCount: 1,
    lastInteractionDate: '2026-04-28',
    bankId: 'meetingmind-acme-rachel'
  }
];

export const DEMO_HISTORICAL_MEETINGS: Meeting[] = [
  {
    id: 'meet-1',
    title: 'Initial Discovery & Architecture Fit',
    contactId: 'sarah-lin',
    companyId: 'acme-corp',
    date: '2026-03-04',
    time: '10:00 AM PST',
    meetingType: 'Discovery',
    objective: 'Explore API integration capabilities and understand Acme developer workflow.',
    priority: 'High',
    status: 'Completed',
    transcript: `[00:02] Rep: Hi Sarah, thanks for taking the time today. We'd love to learn more about how Acme handles external integrations.
[00:15] Sarah: Glad to meet. Right now, our biggest friction is integrating external event webhooks. Our developers spend 3 to 4 weeks building bespoke adapters.
[01:10] Rep: Our SDK handles automated ingestion and webhook schema transformation out of the box.
[02:05] Sarah: That sounds promising. But I have to be upfront about economics: our departmental budget for new tooling this fiscal year is strictly capped at $50k. If your licensing exceeds that, we can't proceed.
[03:20] Rep: Understood on the $50k ceiling. We can structure a tailored tier. What does your technical stack look like?
[04:10] Sarah: We run Node.js microservices on AWS EKS with PostgreSQL. We need clean TypeScript SDKs and OpenAPI documentation.`,
    notes: 'Discovery call with Sarah Lin. Key points: Acme struggles with 4-week webhook integration cycles. Budget ceiling strictly set at $50k. Technical requirement: TypeScript SDK and OpenAPI spec.'
  },
  {
    id: 'meet-2',
    title: 'Security Deep-Dive & Compliance Review',
    contactId: 'sarah-lin',
    companyId: 'acme-corp',
    date: '2026-03-18',
    time: '02:00 PM PST',
    meetingType: 'Security Review',
    objective: 'Review security standards, encryption at rest, and compliance certifications.',
    priority: 'High',
    status: 'Completed',
    transcript: `[00:05] Rep: Welcome back Sarah. We also have Michael Chen joining us today.
[00:20] Michael: Thanks. In fintech infrastructure, security isn't a checkbox for us; it's existential.
[01:15] Sarah: Exactly. Our Chief Information Security Officer requires all data-handling vendors to have a verified SOC 2 Type II report and proof of encryption at rest (AES-256).
[02:30] Rep: We have full AES-256 encryption and our SOC 2 Type II audit was just completed last month by Schellman.
[03:15] Sarah: That's great news. Can you send over the official SOC 2 Type II whitepaper and third-party audit summary? We need it before our April InfoSec committee review.
[03:45] Rep: Absolutely. I promise our team will send the official SOC 2 whitepaper and architecture security diagram to you by March 30.
[04:20] Sarah: Perfect. Once InfoSec clears the whitepaper, we can move to contract discussions.`,
    notes: 'Security deep dive with Sarah Lin and CTO Michael Chen. Sarah explicitly requested SOC 2 Type II whitepaper and audit summary. Rep promised delivery by March 30 without fail.'
  },
  {
    id: 'meet-3',
    title: 'Architecture Review & Implementation Blockers',
    contactId: 'sarah-lin',
    companyId: 'acme-corp',
    date: '2026-04-01',
    time: '11:00 AM PST',
    meetingType: 'Technical',
    objective: 'Review developer SDK architecture and address engineering onboarding questions.',
    priority: 'High',
    status: 'Completed',
    transcript: `[00:10] Rep: Hi Sarah, good to connect again. We wanted to walk you through our TypeScript SDK.
[00:25] Sarah: Before we jump into the SDK demo, I have to bring up a blocker. March 30 came and went, and we never received the SOC 2 whitepaper or architecture diagram you promised.
[01:10] Rep: Ah, our security team is still doing a final redaction of customer references. I apologize for the delay.
[01:45] Sarah: I need to emphasize that our internal InfoSec committee meets every two weeks. Because we missed the deadline, my review was pushed back. I cannot sponsor a pilot without that documentation.
[02:50] Rep: I understand completely, and I will escalate this with our leadership today.
[03:30] Sarah: Beyond security, our senior engineers reviewed your public docs and were concerned about the complexity of error handling in edge cases. We need clear retry semantics.`,
    notes: 'Tense meeting. The SOC 2 whitepaper was NOT delivered by March 30 (MISSED COMMITMENT). Sarah expressed serious concern that her internal InfoSec review was delayed. Also raised implementation concerns around SDK error handling.'
  },
  {
    id: 'meet-4',
    title: 'Executive Re-Alignment & Q4 Roadmap Shift',
    contactId: 'sarah-lin',
    companyId: 'acme-corp',
    date: '2026-04-15',
    time: '01:30 PM PST',
    meetingType: 'Executive',
    objective: 'Discuss strategic roadmap changes and Acme product team priorities.',
    priority: 'Medium',
    status: 'Completed',
    transcript: `[00:12] Rep: Hi Sarah, good to speak with you.
[00:30] Sarah: Thanks for checking in. We've had a strategic re-alignment over the last two weeks with our CEO and Head of Growth.
[01:05] Rep: What changed?
[01:25] Sarah: Our top objective for Q4 is no longer custom enterprise integrations. The entire company is pivoting toward self-serve onboarding. Our North Star metric is reducing time-to-first-event for developer accounts to under 5 minutes.
[02:40] Rep: That's a significant shift. How does this impact our pilot?
[03:10] Sarah: If your solution requires multi-week manual configuration, it doesn't fit our new mandate. But if your SDK enables a developer to drop in three lines of code and get immediate data in under 5 minutes, you become our highest-priority vendor.
[04:00] Rep: We actually have a zero-config quickstart that takes 3 minutes.
[04:30] Sarah: Send me the docs for that quickstart. And please check where that SOC 2 whitepaper is.`,
    notes: 'Major strategic shift! Acme company priority has pivoted toward self-serve developer onboarding with target of under 5 minutes time-to-first-event. Custom enterprise integrations de-prioritized. SOC 2 whitepaper remains outstanding.'
  },
  {
    id: 'meet-5',
    title: 'Pre-Contract Scoping & Commercials',
    contactId: 'sarah-lin',
    companyId: 'acme-corp',
    date: '2026-05-02',
    time: '10:30 AM PST',
    meetingType: 'Contract',
    objective: 'Align on pilot commercial terms and prepare for final sign-off.',
    priority: 'High',
    status: 'Completed',
    transcript: `[00:08] Rep: Sarah, great to talk to you.
[00:22] Sarah: Good news on our end: Rachel Morgan, our CFO, approved our business case for a 90-day pilot at $75k, which gives us breathing room over the original $50k cap.
[01:15] Rep: That's great news!
[01:40] Sarah: It is, but the sign-off is strictly conditional: 1) The SOC 2 whitepaper must be officially approved by our InfoSec team, and 2) The pilot must prove our 5-minute onboarding target in our staging sandbox.
[02:30] Rep: We are ready to prove both. How would you like the pilot agreement structured?
[03:10] Sarah: Keep it simple. Rachel and I hate 40-page Master Services Agreements for a pilot. A concise 3-page order form with clear milestone criteria is what we want. Also, please share technical bullet points for our engineers rather than marketing slide decks.`,
    notes: 'Budget increased and approved at $75k for 90-day pilot. Strict conditions: SOC 2 approval must be secured and 5-minute onboarding benchmark proven in staging. Sarah requested concise 3-page agreement and technical bullet points.'
  }
];

export const DEMO_UPCOMING_MEETING: Meeting = {
  id: 'meet-6-upcoming',
  title: 'Executive Pilot Sign-Off & Security Resolution',
  contactId: 'sarah-lin',
  companyId: 'acme-corp',
  date: '2026-05-14',
  time: '11:00 AM PST',
  meetingType: 'Contract',
  objective: 'Finalize 90-day pilot scope ($75k), definitively resolve the overdue SOC 2 deliverable, and present the 3-minute quickstart benchmark.',
  priority: 'High',
  status: 'Upcoming'
};

export const DEMO_COMMITMENTS: Commitment[] = [
  {
    id: 'com-1',
    title: 'Send official SOC 2 Type II whitepaper and architecture security diagram',
    description: 'Promised by our team during Meeting 2 for delivery by March 30; missed prior to Meeting 3; still blocking InfoSec review.',
    owner: 'Our Team',
    dueDate: '2026-03-30',
    status: 'OVERDUE',
    sourceMeetingId: 'meet-2',
    sourceMeetingTitle: 'Security Deep-Dive & Compliance Review',
    sourceDate: '2026-03-18',
    contactId: 'sarah-lin'
  },
  {
    id: 'com-2',
    title: 'Deliver zero-config 3-minute quickstart developer documentation',
    description: 'Promised in Meeting 4 to demonstrate under 5-minute time-to-first-event onboarding for Acme developers.',
    owner: 'Our Team',
    dueDate: '2026-05-10',
    status: 'PENDING',
    sourceMeetingId: 'meet-4',
    sourceMeetingTitle: 'Executive Re-Alignment & Q4 Roadmap Shift',
    sourceDate: '2026-04-15',
    contactId: 'sarah-lin'
  },
  {
    id: 'com-3',
    title: 'Provide 3-page simplified pilot agreement order form ($75k / 90 days)',
    description: 'Promised in Meeting 5 to avoid heavy 40-page MSA and establish objective pilot milestones.',
    owner: 'Our Team',
    dueDate: '2026-05-12',
    status: 'PENDING',
    sourceMeetingId: 'meet-5',
    sourceMeetingTitle: 'Pre-Contract Scoping & Commercials',
    sourceDate: '2026-05-02',
    contactId: 'sarah-lin'
  },
  {
    id: 'com-4',
    title: 'Submit Acme InfoSec committee sign-off upon receipt of SOC 2 whitepaper',
    description: 'Sarah Lin committed to submit documentation to InfoSec committee once delivered.',
    owner: 'Customer',
    dueDate: '2026-05-18',
    status: 'PENDING',
    sourceMeetingId: 'meet-5',
    sourceMeetingTitle: 'Pre-Contract Scoping & Commercials',
    sourceDate: '2026-05-02',
    contactId: 'sarah-lin'
  }
];

export const DEMO_MEMORIES: MemoryItem[] = [
  {
    id: 'mem-101',
    bankId: 'meetingmind-acme-sarah',
    category: 'concern',
    groundingType: 'FACT',
    content: 'Sarah Lin stated that Acme departmental budget for new tooling in FY26 is strictly capped at $50k.',
    timestamp: '2026-03-04T10:30:00Z',
    sourceMeetingId: 'meet-1',
    sourceMeetingTitle: 'Initial Discovery & Architecture Fit',
    sourceDate: '2026-03-04',
    confidence: 0.98,
    tags: ['budget', 'pricing', 'commercials'],
    metadata: { participantId: 'sarah-lin', companyId: 'acme-corp' }
  },
  {
    id: 'mem-102',
    bankId: 'meetingmind-acme-sarah',
    category: 'preference',
    groundingType: 'PREFERENCE',
    content: 'Acme engineering team requires clean TypeScript SDKs, PostgreSQL support, and OpenAPI documentation.',
    timestamp: '2026-03-04T10:45:00Z',
    sourceMeetingId: 'meet-1',
    sourceMeetingTitle: 'Initial Discovery & Architecture Fit',
    sourceDate: '2026-03-04',
    confidence: 0.95,
    tags: ['technical', 'sdk', 'stack'],
    metadata: { participantId: 'sarah-lin', companyId: 'acme-corp' }
  },
  {
    id: 'mem-103',
    bankId: 'meetingmind-acme-sarah',
    category: 'concern',
    groundingType: 'FACT',
    content: 'Sarah Lin stated Chief Information Security Officer requires verified SOC 2 Type II report and proof of AES-256 encryption before any pilot.',
    timestamp: '2026-03-18T14:20:00Z',
    sourceMeetingId: 'meet-2',
    sourceMeetingTitle: 'Security Deep-Dive & Compliance Review',
    sourceDate: '2026-03-18',
    confidence: 0.99,
    tags: ['security', 'soc2', 'compliance', 'infosec'],
    metadata: { participantId: 'sarah-lin', companyId: 'acme-corp' }
  },
  {
    id: 'mem-104',
    bankId: 'meetingmind-acme-sarah',
    category: 'commitment',
    groundingType: 'COMMITMENT',
    content: 'Our team committed to deliver official SOC 2 Type II whitepaper and architecture security diagram to Sarah Lin by March 30.',
    timestamp: '2026-03-18T14:45:00Z',
    sourceMeetingId: 'meet-2',
    sourceMeetingTitle: 'Security Deep-Dive & Compliance Review',
    sourceDate: '2026-03-18',
    confidence: 1.0,
    tags: ['commitment', 'soc2', 'deliverable'],
    metadata: { participantId: 'sarah-lin', companyId: 'acme-corp', owner: 'Our Team', dueDate: '2026-03-30', status: 'OVERDUE' }
  },
  {
    id: 'mem-105',
    bankId: 'meetingmind-acme-sarah',
    category: 'outcome',
    groundingType: 'OUTCOME',
    content: 'Our team failed to deliver the promised SOC 2 whitepaper by March 30; Sarah reported Acme internal InfoSec review was delayed by two weeks.',
    timestamp: '2026-04-01T11:15:00Z',
    sourceMeetingId: 'meet-3',
    sourceMeetingTitle: 'Architecture Review & Implementation Blockers',
    sourceDate: '2026-04-01',
    confidence: 1.0,
    tags: ['missed_commitment', 'soc2', 'friction'],
    metadata: { participantId: 'sarah-lin', companyId: 'acme-corp' }
  },
  {
    id: 'mem-106',
    bankId: 'meetingmind-acme-sarah',
    category: 'priority_change',
    groundingType: 'FACT',
    content: 'Sarah announced Acme strategic pivot: top Q4 objective shifted from enterprise integrations to self-serve onboarding, targeting under 5-minute time-to-first-event.',
    timestamp: '2026-04-15T13:40:00Z',
    sourceMeetingId: 'meet-4',
    sourceMeetingTitle: 'Executive Re-Alignment & Q4 Roadmap Shift',
    sourceDate: '2026-04-15',
    confidence: 0.98,
    tags: ['priority_shift', 'q4', 'onboarding', 'metrics'],
    metadata: { participantId: 'sarah-lin', companyId: 'acme-corp' }
  },
  {
    id: 'mem-107',
    bankId: 'meetingmind-acme-sarah',
    category: 'decision',
    groundingType: 'FACT',
    content: 'CFO Rachel Morgan approved a $75k 90-day pilot budget, strictly conditional on SOC 2 verification and 5-minute onboarding proof.',
    timestamp: '2026-05-02T10:40:00Z',
    sourceMeetingId: 'meet-5',
    sourceMeetingTitle: 'Pre-Contract Scoping & Commercials',
    sourceDate: '2026-05-02',
    confidence: 0.99,
    tags: ['budget_approved', 'pilot', 'cfo', 'conditions'],
    metadata: { participantId: 'sarah-lin', companyId: 'acme-corp' }
  },
  {
    id: 'mem-108',
    bankId: 'meetingmind-acme-sarah',
    category: 'preference',
    groundingType: 'PREFERENCE',
    content: 'Sarah Lin explicitly requests concise 3-page order forms and bulleted technical documentation rather than 40-page MSAs or marketing slide decks.',
    timestamp: '2026-05-02T10:55:00Z',
    sourceMeetingId: 'meet-5',
    sourceMeetingTitle: 'Pre-Contract Scoping & Commercials',
    sourceDate: '2026-05-02',
    confidence: 0.95,
    tags: ['preference', 'format', 'order_form'],
    metadata: { participantId: 'sarah-lin', companyId: 'acme-corp' }
  }
];

export const DEMO_LEARNING_CURVE_STEPS = [
  {
    stepNumber: 1,
    meetingTitle: 'Meeting 1: Initial Discovery',
    date: 'March 4, 2026',
    knowledgeLearned: 'Learned basic technical stack (Node.js, PostgreSQL) and strict $50k budget ceiling.',
    agentAdvancement: 'Basic contact profile created; financial boundary established.',
    retainedCount: 2,
    sampleBriefSnippet: '"Discuss general integration capabilities and verify if $50k pricing tier is viable."'
  },
  {
    stepNumber: 2,
    meetingTitle: 'Meeting 2: Security Deep-Dive',
    date: 'March 18, 2026',
    knowledgeLearned: 'Learned strict CISO mandate: SOC 2 Type II and AES-256 encryption required. Team committed to March 30 delivery.',
    agentAdvancement: 'Identified critical compliance gatekeeper; registered first high-priority commitment.',
    retainedCount: 4,
    sampleBriefSnippet: '"Ensure SOC 2 Type II report is delivered on schedule to avoid delaying April InfoSec committee."'
  },
  {
    stepNumber: 3,
    meetingTitle: 'Meeting 3: Implementation Blockers',
    date: 'April 1, 2026',
    knowledgeLearned: 'Detected missed commitment (March 30 deadline passed without SOC 2 delivery). Relationship status shifted to "Needs Attention".',
    agentAdvancement: 'Flagged overdue deliverable as active friction; warned rep to acknowledge error before demoing.',
    retainedCount: 5,
    sampleBriefSnippet: '"WARNING: 1 overdue commitment (SOC 2 whitepaper). Do not pitch features until delay is addressed."'
  },
  {
    stepNumber: 4,
    meetingTitle: 'Meeting 4: Executive Re-alignment',
    date: 'April 15, 2026',
    knowledgeLearned: 'Detected company-wide pivot: Q4 priority shifted from bespoke integrations to self-serve onboarding under 5 minutes.',
    agentAdvancement: 'Re-aligned talking points from custom adapters to zero-config onboarding speed.',
    retainedCount: 6,
    sampleBriefSnippet: '"Pivot discussion: Anchor pitch to Acme\'s North Star metric of <5-minute developer onboarding."'
  },
  {
    stepNumber: 5,
    meetingTitle: 'Meeting 5: Pre-Contract Scoping',
    date: 'May 2, 2026',
    knowledgeLearned: 'Budget expanded to $75k by CFO Rachel Morgan; format preference learned (3-page order form, no marketing decks).',
    agentAdvancement: 'Full relationship intelligence synthesized: commercial green light subject only to security closure.',
    retainedCount: 8,
    sampleBriefSnippet: '"Final pilot closing brief: Lock $75k 90-day pilot by delivering finalized SOC 2 report and staging quickstart proof."'
  }
];

export const DEMO_SAMPLE_POST_MEETING_TRANSCRIPT = `
[00:05] Rep: Good morning Sarah. First, I have the bound, official Schellman SOC 2 Type II audit report and architecture security diagram right here in your inbox.
[00:25] Sarah: Thank you! That is a huge relief. I will forward this to our InfoSec committee this afternoon for their Friday sign-off.
[01:10] Rep: Next, let me show you our live staging environment where a developer installs our package, runs our quickstart script, and generates their first verified webhook in exactly 2 minutes and 42 seconds.
[02:05] Sarah: Wow, 2 minutes and 42 seconds is significantly under our 5-minute mandate. My engineering leads will love this.
[02:50] Rep: Regarding commercials, we prepared the simplified 3-page pilot order form covering the 90-day pilot at the agreed $75k cap with clear milestone criteria.
[03:30] Sarah: Excellent. I reviewed the 3-page order form and everything aligns with what Rachel and I needed. I am officially signing the order form today.
[04:10] Rep: Fantastic! We will schedule our technical kickoff call for next Wednesday.
[04:35] Sarah: Perfect. One request: please ensure your technical lead Brian joins Wednesday's kickoff, as our team has deep PostgreSQL replication questions.
`;
