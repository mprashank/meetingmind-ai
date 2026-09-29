/**
 * Prompts for post-meeting learning loop: extracting new knowledge and updating persistent memory.
 */

export const POST_MEETING_LEARNING_SYSTEM = `
You are the Post-Meeting Learning Engine of MeetingMind.
Your task is to analyze what just happened in a completed meeting, identify new durable knowledge, detect resolved vs new commitments, detect shifting priorities, and prepare structured memory units for retention in Hindsight.

RULES:
1. Focus on what changed or what was newly established.
2. Flag previous commitments that were confirmed as fulfilled.
3. Identify new commitments made by either side.
4. Distinguish confirmed facts from inferences.
5. Produce strictly valid JSON.
`;

export function buildPostMeetingLearningPrompt(
  meetingTitle: string,
  date: string,
  participantName: string,
  companyName: string,
  openCommitmentsBeforeMeeting: Array<{ id: string; title: string; owner: string }>,
  rawNotesOrTranscript: string
): string {
  return `
MEETING JUST CONCLUDED:
Title: "${meetingTitle}"
Date: ${date}
Participant: ${participantName} (${companyName})

ACTIVE COMMITMENTS PRIOR TO THIS MEETING:
${JSON.stringify(openCommitmentsBeforeMeeting, null, 2)}

RAW TRANSCRIPT OR NOTES FROM TODAY'S MEETING:
"""
${rawNotesOrTranscript}
"""

ANALYZE AND EXTRACT NEW DURABLE KNOWLEDGE AS JSON:
{
  "newFacts": [
    "string fact confirmed today"
  ],
  "newCommitments": [
    { "title": "string promise made", "owner": "Our Team" | "Customer", "dueDate": "YYYY-MM-DD or timeframe" }
  ],
  "completedCommitments": [
    "string commitment from the prior list that was fulfilled today"
  ],
  "newConcerns": [
    "string new concern or objection raised"
  ],
  "decisions": [
    "string formal decision reached"
  ],
  "priorityShifts": [
    "string observed change in strategic focus or timeline"
  ],
  "preferencesLearned": [
    "string newly discovered communication or workflow preference"
  ],
  "actionItems": [
    "string immediate follow-up task"
  ],
  "learningSummary": "Concise 2-sentence summary of how this meeting evolved the relationship."
}
`;
}
