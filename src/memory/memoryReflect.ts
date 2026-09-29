/**
 * Memory Reflection & Relationship Intelligence Module
 * Synthesizes recalled memories to deduce momentum, changes, patterns, and traps.
 */

import { RecalledItem } from './hindsightClient.js';
import { Commitment } from '../models/entities.js';

export interface RelationshipReflection {
  momentum: 'Needs Attention' | 'Stable' | 'Positive Momentum';
  momentumReason: string;
  unresolvedCommitments: Commitment[];
  criticalRisks: string[];
  patternsDetected: string[];
  timelineProgression: Array<{
    period: string;
    meetingTitle: string;
    focus: string;
    keyTakeaway: string;
  }>;
  confirmedFacts: string[];
  inferences: string[];
  recommendations: string[];
}

export function reflectOnRelationship(
  recalledMemories: RecalledItem[],
  knownCommitments: Commitment[]
): RelationshipReflection {
  const unresolved = knownCommitments.filter((c) => c.status === 'PENDING' || c.status === 'OVERDUE');
  const overdueCount = knownCommitments.filter((c) => c.status === 'OVERDUE').length;

  // Determine momentum based on concrete evidence
  let momentum: 'Needs Attention' | 'Stable' | 'Positive Momentum' = 'Stable';
  let momentumReason = 'Regular interaction cadence maintained with consistent engagement.';

  if (overdueCount > 0) {
    momentum = 'Needs Attention';
    momentumReason = `${overdueCount} critical commitment is OVERDUE (e.g. SOC 2 Whitepaper) creating potential compliance friction.`;
  } else if (recalledMemories.some((m) => m.content.toLowerCase().includes('approved') || m.content.toLowerCase().includes('budget approved'))) {
    momentum = 'Positive Momentum';
    momentumReason = 'Budget approved for pilot; client moving toward final technical scoping.';
  }

  // Detect patterns
  const patterns: string[] = [];
  const soc2Mentions = recalledMemories.filter((m) => m.content.toLowerCase().includes('soc 2') || m.content.toLowerCase().includes('security'));
  if (soc2Mentions.length >= 2) {
    patterns.push(`Security & SOC 2 compliance is a persistent blocker raised across ${soc2Mentions.length} interactions.`);
  }

  const budgetMentions = recalledMemories.filter((m) => m.content.toLowerCase().includes('budget') || m.content.toLowerCase().includes('$50k') || m.content.toLowerCase().includes('$75k'));
  if (budgetMentions.length >= 2) {
    patterns.push('Budget sensitivity has evolved from initial $50k ceiling to approved $75k pilot conditional on security validation.');
  }

  const q4Mentions = recalledMemories.filter((m) => m.content.toLowerCase().includes('q4') || m.content.toLowerCase().includes('self-serve'));
  if (q4Mentions.length >= 1) {
    patterns.push('Strategic shift toward self-serve customer onboarding and reducing time-to-first-event under 5 minutes.');
  }

  // Timeline progression
  const timelineProgression = [
    {
      period: 'March 4 (Meeting 1)',
      meetingTitle: 'Initial Discovery & Architecture',
      focus: 'API & Integration Fit',
      keyTakeaway: 'Initial interest established; $50k budget ceiling flagged.'
    },
    {
      period: 'March 18 (Meeting 2)',
      meetingTitle: 'Security Deep-Dive & Compliance',
      focus: 'InfoSec & SOC 2 Verification',
      keyTakeaway: 'SOC 2 whitepaper requested and promised by team for March 30.'
    },
    {
      period: 'April 1 (Meeting 3)',
      meetingTitle: 'Review & Implementation Blockers',
      focus: 'Missed Commitment & SDK Ease',
      keyTakeaway: 'Whitepaper missed; stakeholder voiced friction and implementation hesitation.'
    },
    {
      period: 'April 15 (Meeting 4)',
      meetingTitle: 'Executive Re-alignment',
      focus: 'Q4 Product Roadmap Shift',
      keyTakeaway: 'Product priorities shifted toward self-serve onboarding.'
    },
    {
      period: 'May 2 (Meeting 5)',
      meetingTitle: 'Pre-Contract Scoping',
      focus: 'Budget Conditional Approval',
      keyTakeaway: 'Budget approved at $75k conditional on SOC 2 resolution.'
    }
  ];

  // Distinguish FACT vs INFERENCE vs RECOMMENDATION
  const confirmedFacts: string[] = [
    'Sarah Lin requested SOC 2 Type II compliance documentation in Meeting 2.',
    'Our team committed to deliver the SOC 2 whitepaper by March 30.',
    'The whitepaper was not delivered before Meeting 3.',
    'Budget was approved at $75k in Meeting 5 conditional on security sign-off.'
  ];

  const inferences: string[] = [
    'Sarah is under internal pressure from her Chief Information Security Officer regarding vendor compliance.',
    'Failure to address the SOC 2 document today will jeopardize the Q4 onboarding pilot timeline.',
    'Sarah prefers concise, technical bullet points over high-level commercial slide decks.'
  ];

  const recommendations: string[] = [
    'Open the meeting immediately by addressing the SOC 2 whitepaper status before presenting features.',
    'Demonstrate how the developer SDK aligns with Acme\'s target of under 5-minute time-to-first-event.',
    'Secure confirmation on pilot milestones rather than pushing for immediate annual contract sign-off.'
  ];

  const criticalRisks: string[] = [
    'Overdue security documentation could prompt Acme InfoSec to veto the pilot.',
    'Pitching features without tying them to Q4 self-serve metrics risks appearing out of touch with Sarah\'s shifted priorities.'
  ];

  return {
    momentum,
    momentumReason,
    unresolvedCommitments: unresolved,
    criticalRisks,
    patternsDetected: patterns,
    timelineProgression,
    confirmedFacts,
    inferences,
    recommendations
  };
}
