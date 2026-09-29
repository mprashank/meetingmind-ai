/**
 * Contextual Multi-Query Memory Recall Engine
 * Generates objective-driven memory queries instead of naive keyword searches.
 */

import { hindsightService, RecalledItem } from './hindsightClient.js';
import { Contact, Meeting } from '../models/entities.js';

export interface ContextualRecallResult {
  queriesExecuted: string[];
  totalRecalled: number;
  allRecalledMemories: RecalledItem[];
  concerns: RecalledItem[];
  commitments: RecalledItem[];
  decisions: RecalledItem[];
  priorityShifts: RecalledItem[];
  preferences: RecalledItem[];
  chronologicalHistory: RecalledItem[];
  objectiveSpecificMemories: RecalledItem[];
}

export async function executeContextualRecall(
  contact: Contact,
  upcomingMeeting: { title: string; objective: string; meetingType: string }
): Promise<ContextualRecallResult> {
  const bankId = contact.bankId || `meetingmind_acme_${contact.id}`;

  // Formulate objective-directed queries
  const queries: string[] = [
    // 1. Broad relationship & identity
    `What is the history of interactions and discussions with ${contact.name}?`,
    // 2. Objective-specific query
    `What has been discussed or decided regarding "${upcomingMeeting.objective}" and "${upcomingMeeting.title}"?`,
    // 3. Concerns & objections
    `What pricing, budget, security, SOC 2, or technical concerns has ${contact.name} raised?`,
    // 4. Commitments & promises
    `What commitments, promises, deliverables, whitepapers, or follow-ups were made to ${contact.name} or by our team?`,
    // 5. Shifting priorities & roadmap
    `What strategic priorities, Q4 planning, timelines, or roadmap shifts has ${contact.name} mentioned?`,
    // 6. Preferences
    `What communication, documentation, meeting, or process preferences does ${contact.name} have?`
  ];

  const resultsMap = new Map<string, RecalledItem>();

  for (const query of queries) {
    try {
      const recalled = await hindsightService.recall(bankId, query, {
        preferObservations: true,
        maxTokens: 1500
      });
      recalled.forEach((item) => {
        if (!resultsMap.has(item.id)) {
          resultsMap.set(item.id, item);
        } else {
          // If returned across multiple queries, increase its relevance score
          const existing = resultsMap.get(item.id)!;
          existing.relevanceScore = Math.min(1.0, existing.relevanceScore + 0.15);
        }
      });
    } catch (err) {
      console.warn(`[MeetingMind] Contextual query failed: "${query}":`, err);
    }
  }

  const allItems = Array.from(resultsMap.values());

  // Categorize
  const concerns = allItems.filter(
    (item) => item.category === 'concern' || item.content.toLowerCase().includes('concern') || item.content.toLowerCase().includes('soc 2') || item.content.toLowerCase().includes('budget')
  );

  const commitments = allItems.filter(
    (item) => item.category === 'commitment' || item.groundingType === 'COMMITMENT' || item.content.toLowerCase().includes('promise') || item.content.toLowerCase().includes('deliver')
  );

  const decisions = allItems.filter(
    (item) => item.category === 'decision' || item.content.toLowerCase().includes('decided') || item.content.toLowerCase().includes('agreed')
  );

  const priorityShifts = allItems.filter(
    (item) => item.category === 'priority_change' || item.content.toLowerCase().includes('priority') || item.content.toLowerCase().includes('q4') || item.content.toLowerCase().includes('shift')
  );

  const preferences = allItems.filter(
    (item) => item.category === 'preference' || item.content.toLowerCase().includes('prefer')
  );

  // Chronological sort
  const chronologicalHistory = [...allItems].sort(
    (a, b) => new Date(a.timestamp).getTime() - new Date(b.timestamp).getTime()
  );

  // Objective specific
  const objectiveTokens = upcomingMeeting.objective.toLowerCase().split(/\s+/).filter((w) => w.length > 3);
  const objectiveSpecificMemories = allItems
    .filter((item) => {
      const text = item.content.toLowerCase();
      return objectiveTokens.some((t) => text.includes(t));
    })
    .sort((a, b) => b.relevanceScore - a.relevanceScore);

  return {
    queriesExecuted: queries,
    totalRecalled: allItems.length,
    allRecalledMemories: allItems,
    concerns,
    commitments,
    decisions,
    priorityShifts,
    preferences,
    chronologicalHistory,
    objectiveSpecificMemories
  };
}
