/**
 * Prompts for generating executive meeting briefings grounded in Hindsight persistent memories.
 */

export const BRIEFING_SYSTEM_INSTRUCTION = `
You are the Executive Meeting Intelligence Agent of MeetingMind.
Your mission is to prepare a professional executive (sales, customer success, executive, or founder) for an upcoming high-stakes meeting.

CRITICAL INSTRUCTIONS:
1. GROUNDING IN MEMORY: You must explicitly trace insights to recalled memories. Never make things up or invent personality traits.
2. DISTINGUISH CONFIRMED FROM INFERRED: When presenting an inference, label it clearly as an inference. Never present inferences as confirmed facts.
3. PRIORITIZE RELEVANCE: Prioritize memories directly relevant to the UPCOMING MEETING OBJECTIVE, while maintaining visibility on open commitments and unresolved risks.
4. ACTIONABLE EXECUTIVE TONE: Brevity, clarity, high signal-to-noise ratio.
5. Return strictly valid JSON matching the requested structure.
`;

export function buildPrepPrompt(
  meeting: {
    title: string;
    objective: string;
    meetingType: string;
    date: string;
    priority: string;
  },
  contact: {
    name: string;
    role: string;
    company: string;
  },
  recalledMemories: Array<{
    id: string;
    category: string;
    groundingType: string;
    content: string;
    sourceMeetingTitle?: string;
    sourceDate?: string;
  }>,
  openCommitments: Array<{
    id: string;
    title: string;
    owner: string;
    dueDate: string;
    status: string;
    sourceMeetingTitle: string;
  }>
): string {
  return `
UPCOMING MEETING CONTEXT:
- Title: ${meeting.title}
- Objective: ${meeting.objective}
- Meeting Type: ${meeting.meetingType}
- Date: ${meeting.date}
- Priority: ${meeting.priority}
- Participant: ${contact.name} (${contact.role} at ${contact.company})

RECALLED PERSISTENT MEMORIES FROM HINDSIGHT:
${JSON.stringify(recalledMemories, null, 2)}

ACTIVE COMMITMENT LEDGER:
${JSON.stringify(openCommitments, null, 2)}

GENERATE THE EXECUTIVE BRIEFING AS A COMPREHENSIVE JSON OBJECT:
{
  "executiveSummary": "Concise 3-4 sentence summary of what the user needs to know, highlighting major milestones and immediate traps/priorities.",
  "participantProfile": {
    "name": "${contact.name}",
    "role": "${contact.role}",
    "company": "${contact.company}",
    "whyRelevant": "Why they are the decision maker and what their primary mandate is based on memory."
  },
  "relationshipHistory": [
    { "date": "YYYY-MM-DD", "meetingTitle": "string", "keyTakeaway": "string", "memoryId": "string" }
  ],
  "whatChanged": [
    { "trend": "string (e.g. Budget -> Security -> Q4 Self-serve)", "comparison": "string comparison between early meetings and recent meetings", "memoryId": "string" }
  ],
  "keyConcerns": [
    { "concern": "string", "frequency": "Recurring across X meetings", "evidence": "string evidence quote", "status": "Active" | "Resolved" | "Escalating", "memoryId": "string" }
  ],
  "decisionsMade": [
    { "decision": "string", "date": "string", "impact": "string", "memoryId": "string" }
  ],
  "knownPriorities": [
    { "priority": "string", "shiftContext": "string" }
  ],
  "talkingPoints": [
    { "id": "tp-1", "priority": "Must Discuss" | "Secondary" | "Contingent", "point": "string", "rationale": "string based on memory", "grounding": "FACT" | "COMMITMENT" | "INFERENCE", "memoryId": "string" }
  ],
  "possibleObjections": [
    { "objection": "string", "evidenceBasis": "string cite historical concern", "counterStrategy": "string actionable tactic", "confidence": "High (Documented)" | "Medium (Inferred)" }
  ],
  "recommendedApproach": {
    "structure": "Step-by-step meeting flow (e.g. 1. Acknowledge overdue SOC 2 deliverable immediately, 2. Present self-serve onboarding metrics, 3. Lock pilot scope)",
    "toneRecommendation": "e.g. Transparent, technically concise, avoid marketing hype",
    "pacingNotes": "e.g. Allocate first 10 minutes to resolve security block"
  },
  "openQuestions": [
    "string targeted question user should ask"
  ],
  "risksAndBlindspots": [
    "string critical risk (e.g. Missed SOC 2 deadline may have invited competitor audit)"
  ],
  "nextSteps": [
    "string action to propose at end of meeting"
  ]
}
`;
}

export function buildGenericPrepPrompt(
  meeting: {
    title: string;
    objective: string;
    meetingType: string;
    date: string;
  },
  contact: {
    name: string;
    role: string;
    company: string;
  }
): string {
  return `
You are preparing a meeting brief WITHOUT ANY HISTORICAL MEMORY or CRM records.
Meeting Title: ${meeting.title}
Objective: ${meeting.objective}
Type: ${meeting.meetingType}
Participant: ${contact.name}, ${contact.role} at ${contact.company}

Generate a generic, standard B2B meeting preparation as JSON:
{
  "title": "Standard Meeting Briefing (No Persistent Memory)",
  "executiveSummary": "Standard discovery/follow-up briefing generated purely from meeting title and job role without prior context.",
  "approach": "Standard agenda: Introductions, review project status, discuss requirements, next steps.",
  "talkingPoints": [
    "Introduce team and agenda",
    "Ask about current challenges and roadmap",
    "Discuss timeline and standard pricing packages",
    "Propose follow-up call"
  ],
  "objections": [
    "General budget or timing hesitation",
    "Questions about standard implementation time"
  ],
  "weaknessReason": "Lacks knowledge of previous discussions, missed SOC 2 deliverable, specific budget ceilings ($50k-$75k), or shifting Q4 priorities."
}
`;
}
