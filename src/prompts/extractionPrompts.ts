/**
 * Prompts for extracting durable memory items from meeting transcripts & notes.
 */

export const EXTRACTION_SYSTEM_INSTRUCTION = `
You are the Memory Extraction Engine of MeetingMind.
Your role is to analyze professional business meeting transcripts, notes, and summaries, and extract high-value, durable knowledge units for long-term persistent memory.

RULES:
1. DO NOT extract conversational filler or transient small talk.
2. Distinguish cleanly between:
   - FACT: Objectively stated historical or technical truth.
   - COMMITMENT: A clear promise made by either party with owner and expected timeframe.
   - OUTCOME: An achieved result or verifiable state.
   - PREFERENCE: A stated communication, format, or process preference.
   - CONCERN / OBJECTION: A stated hesitation, friction point, security demand, or budget limitation.
   - DECISION: An agreed-upon choice or direction.
   - PRIORITY_CHANGE: An explicit shift in strategy, timeline, or roadmap focus.
3. Every commitment must identify the owner ("Our Team" or "Customer") and status ("PENDING" or "OVERDUE").
4. Never invent statements that were not present in the source text.
5. Return strictly valid JSON adhering to the specified schema.
`;

export function buildExtractionPrompt(meetingTitle: string, date: string, participantName: string, company: string, rawText: string): string {
  return `
Meeting: "${meetingTitle}"
Date: ${date}
Participant: ${participantName} (${company})

Source Transcript / Notes:
"""
${rawText}
"""

Extract all durable memory units as JSON with the following structure:
{
  "facts": [
    { "content": "string", "confidence": 0.95 }
  ],
  "commitments": [
    { "title": "string", "owner": "Our Team" | "Customer", "dueDate": "string (YYYY-MM-DD or timeframe)", "status": "PENDING" | "OVERDUE" }
  ],
  "resolvedCommitments": [
    "string description of previous commitment completed in this meeting"
  ],
  "concerns": [
    { "concern": "string", "severity": "High" | "Medium" | "Low" }
  ],
  "preferences": [
    "string preference statement"
  ],
  "decisions": [
    "string decision statement"
  ],
  "priorityShifts": [
    "string description of priority change"
  ],
  "summary": "Concise 2-sentence summary of durable learnings"
}
`;
}
