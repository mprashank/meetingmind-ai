# MeetingMind — Persistent-Memory Meeting Intelligence & Preparation Agent

> **"Prepare smarter. Remember everything."**  
> An autonomous AI Meeting Preparation Agent powered by **Vectorize Hindsight persistent memory** and **Google Gemini reasoning**.

MeetingMind solves a critical problem faced by sales executives, account managers, founders, and consultants: **wasting hours reconstructing relationship history across fragmented meetings, notes, and emails—and walking into meetings unprepared for unfulfilled commitments or shifting priorities.**

MeetingMind is **not a generic chatbot** and **not a static summarizer**. It is an autonomous agent built around a continuous, persistent learning loop:

```
Upcoming Meeting
       ↓
Identify Participant & Company Context
       ↓
Retrieve Persistent Hindsight Memories (Contextual Multi-Query Recall)
       ↓
Reflect on Relationship Momentum & Detect What Changed
       ↓
Surface Overdue Commitments & Unresolved Blockers
       ↓
Generate Executive Briefing Grounded in Memory Citations
       ↓
Practice Meeting via Grounded Roleplay Simulator
       ↓
Actual Meeting Happens
       ↓
Post-Meeting Transcript / Notes Ingestion
       ↓
Extract New Durable Knowledge & Resolved Commitments
       ↓
Retain into Hindsight Memory Bank
       ↓
Future Meetings Become Exponentially Smarter
```

---

## 1. Why Persistent Memory Matters (The Hackathon Core)

Stateless LLMs have no memory of what happened two weeks ago. When asked to "prepare for a meeting with Sarah Lin", standard AI generates generic platitudes:
> *"Review software features, discuss pricing packages, and propose next steps."*

This generic advice creates real business risk:
- It fails to warn the executive that our team **promised a SOC 2 whitepaper on March 30 and never sent it**.
- It is oblivious to the fact that **CFO Rachel Morgan already approved a $75k pilot budget**.
- It is unaware that Acme’s strategic North Star **shifted to self-serve onboarding in under 5 minutes**.
- It attempts to send a 45-page Master Services Agreement when Sarah explicitly **rejects MSAs in favor of 3-page order forms**.

**With Hindsight persistent memory, MeetingMind immediately surfaces:**
> *"Sarah Lin’s primary blocker is our OVERDUE SOC 2 Type II report promised in Meeting 2. Acknowledge the delay immediately, demonstrate our 2m42s staging quickstart to match her Q4 onboarding metric, and present the 3-page order form matching Rachel Morgan's $75k approved budget."*

---

## 2. Core Capabilities

### A. Contextual Memory Recall (Not Naive Keyword Search)
MeetingMind derives targeted queries directly from the upcoming meeting’s objective:
- *"What pricing, budget, or security concerns has Sarah Lin raised?"*
- *"What commitments or deliverables remain unresolved?"*
- *"What strategic priorities or roadmap pivots occurred over the last 3 meetings?"*
- *"What communication and documentation preferences were established?"*

### B. Memory Reflection & Relationship Momentum
The agent synthesizes recalled facts to classify relationship momentum based on concrete evidence:
- **Needs Attention:** When open commitments are overdue or critical compliance gates remain unverified.
- **Positive Momentum:** When deliverables are fulfilled and budget gates are cleared.
- **Stable:** Consistent cadence with established milestones.

### C. 14-Section Executive Briefing
Concise, high-signal preparation including:
1. Executive Summary (3-5 sentences)
2. Meeting Objective
3. Participant Profile & Decision Mandate
4. Relationship History (Chronological interaction milestones)
5. What Has Changed? (Strategic shifts, budget evolutions)
6. Recurring Concerns (SOC 2, developer onboarding friction)
7. Outstanding Commitments (Overdue flags, owners, due dates)
8. Decisions Made (Locked technical stacks, approved budgets)
9. Known Strategic Priorities (Q4 North Star metrics)
10. Prioritized Talking Points (Must Discuss, Secondary, Contingent)
11. Possible Objections & Counter-Tactics (Evidence-based only)
12. Recommended Approach (Step-by-step agenda, tone, pacing)
13. Targeted Questions to Ask
14. Risks, Blindspots, and Proposed Next Steps

### D. Full Evidence Transparency & Traceability
Every AI statement includes an expandable **Memory Citation** linking claims directly back to the original interaction, date, and knowledge type (`FACT`, `COMMITMENT`, `PREFERENCE`, `INFERENCE`).

### E. Grounded Roleplay Simulator ("Practice Meeting")
Interactive practice mode where the AI roleplays as Sarah Lin (or CTO Michael Chen, CFO Rachel Morgan). The agent challenges the user with real historical objections, probes on overdue deliverables, and generates an objective 5-dimension scorecard:
- Clarity
- Relevance
- Objection Handling
- Completeness
- Alignment with Objective

### F. Post-Meeting Learning Loop ("Complete Meeting")
Ingest meeting transcripts or notes to autonomously extract:
- New confirmed facts
- Resolved commitments
- Newly established promises
- Shifting priorities
- Documented preferences
The agent retains these into Hindsight and updates the contact's relationship status in real time.

### G. Before vs After Memory Differential
A dedicated side-by-side comparison screen contrasting the generic AI baseline against MeetingMind's persistent memory intelligence.

### H. 60-Second Learning Curve
Interactive visualizer demonstrating how MeetingMind grows from basic contact knowledge in Interaction 1 to deep commercial intelligence by Interaction 5.

---

## 3. Technology Architecture

```
MeetingMind
├── Frontend (React 19 + TypeScript + Tailwind CSS)
│   ├── components/
│   │   ├── Header.tsx              (Hindsight status badge, contact switcher, demo tour)
│   │   ├── NavigationTabs.tsx      (Prep, Before/After, Timeline, Commitments, Profile)
│   │   ├── MeetingPrepView.tsx     (14-section brief, action triggers, evidence drawers)
│   │   ├── BeforeAfterView.tsx     (Side-by-side memory differential analysis)
│   │   ├── MemoryTimelineView.tsx  (5-meeting chronological memory graph)
│   │   ├── CommitmentTrackerView.tsx (Active commitment ledger & status toggles)
│   │   ├── RoleplayModal.tsx       (Grounded stakeholder practice & evaluation)
│   │   ├── PostMeetingModal.tsx    (Learning loop & Hindsight retention)
│   │   ├── LearningCurveModal.tsx  (60-second interactive learning curve)
│   │   └── DemoTourModal.tsx       (Guided hackathon narrative tour)
│   └── App.tsx                     (State coordination & API integration)
│
├── Backend (Node.js + Express + TypeScript)
│   ├── server.ts                   (Express entry point with Vite middleware)
│   └── server/routes/agentRoutes.ts (REST API endpoints for agent & memory operations)
│
├── Agent Core (src/agent/)
│   ├── meetingPrepAgent.ts         (Autonomous preparation orchestration)
│   ├── briefingGenerator.ts        (Gemini reasoning + structured synthesis)
│   ├── roleplayAgent.ts            (Grounded conversational simulator & scoring)
│   └── postMeetingLearner.ts       (Transcript knowledge extraction & evolution)
│
├── Memory System (src/memory/)
│   ├── hindsightClient.ts          (Official @vectorize-io/hindsight-client wrapper)
│   ├── memoryRecall.ts             (Contextual multi-query retrieval engine)
│   └── memoryReflect.ts            (Relationship intelligence reflection)
│
└── Models & Prompts (src/models/, src/prompts/)
    ├── entities.ts                 (Strongly typed domain models)
    └── *Prompts.ts                 (Modular prompt contracts)
```

---

## 4. Hindsight Memory Architecture

MeetingMind uses the official Vectorize Hindsight TypeScript client:
```bash
npm install @vectorize-io/hindsight-client
```

### Bank Isolation Strategy
Memories are isolated by account and contact to prevent cross-customer leakage:
- Sarah Lin: `meetingmind-acme-sarah`
- Michael Chen: `meetingmind-acme-michael`
- Rachel Morgan: `meetingmind-acme-rachel`

### The Three Primitives:
1. **RETAIN (`hindsightService.retain`)**:
   Stores durable knowledge units with structured metadata:
   - `category`: `meeting`, `commitment`, `concern`, `preference`, `decision`, `outcome`, `priority_change`
   - `groundingType`: `FACT`, `COMMITMENT`, `OUTCOME`, `PREFERENCE`, `INFERENCE`
   - `sourceMeetingId`, `sourceMeetingTitle`, `sourceDate`, `confidence`, `tags`
2. **RECALL (`hindsightService.recall`)**:
   Contextual search executing multiple objective-aligned queries, boosting items returned across multiple dimensions.
3. **REFLECT (`hindsightService.reflect`)**:
   Synthesizes higher-level momentum, trends, and risk factors from raw facts.

### Dual-Mode Support
- **Hindsight Cloud (Vectorize)**: Connects automatically when `HINDSIGHT_API_KEY` is provided.
- **Development Engine Fallback**: When running locally without cloud credentials, MeetingMind operates a high-fidelity local memory adapter with identical Retain/Recall/Reflect semantics, clearly labeled in the UI.

---

## 5. Quick Start & Setup

### Prerequisites
- Node.js 18+
- npm or bun

### Environment Variables
Configure `.env` (copied from `.env.example`):
```env
# Gemini API Key (Required for live AI reasoning)
GEMINI_API_KEY="your-gemini-api-key"

# Hindsight Cloud API Key (Optional - connects to live Vectorize cloud)
HINDSIGHT_API_KEY="your-hindsight-api-key"
HINDSIGHT_BASE_URL="https://api.hindsight.vectorize.io"

# Application URL
APP_URL="http://localhost:3000"
```

### Installation
```bash
npm install
```

### Running the Full-Stack Web Application
```bash
npm run dev
```
Open [http://localhost:3000](http://localhost:3000) in your browser.

---

## 6. Programmatic CLI & Automated Testing

MeetingMind can be executed completely headless via the CLI:

### Run the CLI Demonstration
Executes the end-to-end Sarah Lin scenario in your terminal (Retain → Recall → Reflect → Prepare → Roleplay → Learn → Retain again):
```bash
npm run demo
```

### Run the Automated Test Suite
Executes 29 automated tests verifying memory retention, contextual recall, commitment detection, briefing generation, roleplay, and post-meeting learning:
```bash
npm test
```

---

## 7. The 2-Minute Demo Script (For Judges)

1. **Open Meeting Prep Workspace**: Notice the header shows an upcoming contract meeting with **Sarah Lin (VP Product at Acme)** with an amber status: **"Needs Attention: 1 Overdue Commitment"**.
2. **Click "Generate Meeting Brief"**: The agent executes 6 contextual Hindsight queries. Inspect Section G: it immediately flags that our team **promised a SOC 2 whitepaper by March 30 and missed it**.
3. **Click "Before vs After Memory" Tab**: See the side-by-side contrast between generic AI and MeetingMind’s persistent memory intelligence.
4. **Click "Memory Timeline" Tab**: Inspect the 5 historical meetings from March 4 to May 2 to see where each memory originated.
5. **Click "Practice Meeting" Button**: Engage in a roleplay turn. Notice Sarah immediately demands the overdue SOC 2 report. Answer honestly to see her react and evaluate your performance.
6. **Click "Post-Meeting Learning" Tab**: Click "Analyze & Retain New Memory" using today’s transcript. Watch MeetingMind extract new facts, mark the SOC 2 commitment as **COMPLETED**, and evolve Sarah’s status to **"Positive Momentum"**!

---

## 8. License

Apache-2.0. Built for the Vectorize Hindsight Hackathon.
