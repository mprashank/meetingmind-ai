/**
 * MeetingMind - Programmatic CLI Demonstration Runner
 * Executes the complete autonomous memory loop:
 * 1. RETAIN historical meetings
 * 2. RECALL contextual memories
 * 3. REFLECT on relationship momentum
 * 4. PREPARE meeting briefing
 * 5. PRACTICE simulated roleplay turn
 * 6. COMPLETE meeting with transcript
 * 7. LEARN & RETAIN new knowledge
 * 8. PREPARE future meeting with evolved intelligence
 */

import { hindsightService } from '../memory/hindsightClient.js';
import {
  DEMO_CONTACTS,
  DEMO_MEMORIES,
  DEMO_COMMITMENTS,
  DEMO_HISTORICAL_MEETINGS,
  DEMO_UPCOMING_MEETING,
  DEMO_SAMPLE_POST_MEETING_TRANSCRIPT
} from './sarahLinScenario.js';
import { meetingPrepAgent } from '../agent/meetingPrepAgent.js';
import { roleplayAgent } from '../agent/roleplayAgent.js';
import { postMeetingLearner } from '../agent/postMeetingLearner.js';

async function runCliDemo() {
  console.log('\n===============================================================');
  console.log('  MEETINGMIND — PERSISTENT MEMORY MEETING AGENT (CLI DEMO)     ');
  console.log('===============================================================\n');

  const contact = DEMO_CONTACTS[0]; // Sarah Lin
  const bankId = contact.bankId;

  console.log(`[STATUS] Memory Engine: ${hindsightService.getStatus(bankId).label}`);
  console.log(`[STATUS] Target Contact: ${contact.name} (${contact.role}, Acme Corp)`);
  console.log(`[STATUS] Bank Scope: ${bankId}\n`);

  // STEP 1: RETAIN HISTORICAL MEMORIES
  console.log('---------------------------------------------------------------');
  console.log('STEP 1: RETAIN HISTORICAL KNOWLEDGE INTO HINDSIGHT');
  console.log('---------------------------------------------------------------');
  console.log(`Ingesting 5 previous meetings into Hindsight memory bank "${bankId}"...`);

  for (const mem of DEMO_MEMORIES) {
    await hindsightService.retain(bankId, mem.content, {
      documentId: mem.id,
      timestamp: mem.timestamp,
      tags: mem.tags,
      metadata: {
        category: mem.category,
        groundingType: mem.groundingType,
        sourceMeetingId: mem.sourceMeetingId,
        sourceMeetingTitle: mem.sourceMeetingTitle,
        sourceDate: mem.sourceDate,
        participantId: contact.id,
        confidence: mem.confidence
      }
    });
  }
  console.log(`✓ Retained ${DEMO_MEMORIES.length} durable memories with structured metadata.\n`);

  // STEP 2: RECALL & REFLECT & PREPARE
  console.log('---------------------------------------------------------------');
  console.log('STEP 2: PREPARE UPCOMING MEETING WITH CONTEXTUAL RECALL');
  console.log('---------------------------------------------------------------');
  console.log(`Upcoming Meeting: "${DEMO_UPCOMING_MEETING.title}"`);
  console.log(`Objective: "${DEMO_UPCOMING_MEETING.objective}"\n`);

  const prepResult = await meetingPrepAgent.prepareMeeting(
    DEMO_UPCOMING_MEETING,
    contact,
    DEMO_COMMITMENTS
  );

  console.log(`[RECALL] Executed ${prepResult.recallResult.queriesExecuted.length} contextual queries.`);
  console.log(`[RECALL] Retrieved ${prepResult.recallResult.totalRecalled} relevant memories.`);
  console.log(`[REFLECT] Relationship Momentum: ${prepResult.reflection.momentum.toUpperCase()}`);
  console.log(`[REFLECT] Reason: ${prepResult.reflection.momentumReason}`);
  console.log(`[REFLECT] Overdue Commitments Detected: ${prepResult.reflection.unresolvedCommitments.filter(c => c.status === 'OVERDUE').length}\n`);

  console.log('--- EXECUTIVE BRIEFING SUMMARY ---');
  console.log(prepResult.brief.executiveSummary);
  console.log('\n--- TOP TALKING POINTS (GROUNDED IN MEMORY) ---');
  prepResult.brief.talkingPoints.forEach((tp, i) => {
    console.log(`${i + 1}. [${tp.priority}] ${tp.point}`);
    console.log(`   Rationale: ${tp.rationale}`);
    if (tp.memoryCitation) {
      console.log(`   Source: ${tp.memoryCitation.sourceMeetingTitle} (${tp.memoryCitation.sourceDate})`);
    }
  });

  // STEP 3: BEFORE VS AFTER COMPARISON
  console.log('\n---------------------------------------------------------------');
  console.log('STEP 3: BEFORE VS AFTER MEMORY COMPARISON');
  console.log('---------------------------------------------------------------');
  console.log('WITHOUT MEMORY (Generic AI Baseline):');
  console.log(`  "${prepResult.beforeAfterComparison.withoutMemory.executiveSummary}"`);
  console.log(`  Weakness: ${prepResult.beforeAfterComparison.withoutMemory.weaknessReason}\n`);

  console.log('WITH MEMORY (MeetingMind + Hindsight):');
  console.log(`  "${prepResult.beforeAfterComparison.withMemory.executiveSummary}"`);
  console.log('  Key Memories That Made The Difference:');
  prepResult.beforeAfterComparison.withMemory.criticalMemoriesRecalled.forEach((c) => {
    console.log(`   • [${c.date}] ${c.memory}`);
    console.log(`     -> ${c.impactOnBrief}`);
  });

  // STEP 4: PRACTICE SIMULATION
  console.log('\n---------------------------------------------------------------');
  console.log('STEP 4: GROUNDED ROLEPLAY SIMULATION');
  console.log('---------------------------------------------------------------');
  const userGreeting = 'Hi Sarah, great to connect. Before we begin, I want to address the SOC 2 documentation and show you our 3-minute quickstart demo.';
  console.log(`User: "${userGreeting}"`);

  const roleplayReply = await roleplayAgent.respond(
    contact,
    DEMO_UPCOMING_MEETING,
    DEMO_COMMITMENTS,
    [],
    userGreeting
  );
  console.log(`Sarah Lin (Agent): "${roleplayReply.text}"`);
  console.log(`[GROUNDING]: ${roleplayReply.groundedInFact}\n`);

  // STEP 5: POST-MEETING LEARNING LOOP
  console.log('---------------------------------------------------------------');
  console.log('STEP 5: POST-MEETING LEARNING & MEMORY UPDATE');
  console.log('---------------------------------------------------------------');
  console.log('Ingesting completed meeting transcript...');

  const learningResult = await postMeetingLearner.learnAndRetain(
    DEMO_UPCOMING_MEETING,
    contact,
    DEMO_COMMITMENTS,
    DEMO_SAMPLE_POST_MEETING_TRANSCRIPT
  );

  console.log(`✓ Extracted and retained ${learningResult.retainedMemoriesCount} new memories into Hindsight.`);
  console.log(`✓ Resolved Commitments: ${learningResult.resolvedCommitmentIds.join(', ')}`);
  console.log(`✓ Relationship Status Updated: ${learningResult.updatedContact.relationshipStatus.toUpperCase()}`);
  console.log(`✓ New Reason: ${learningResult.updatedContact.relationshipStatusReason}\n`);

  console.log('What MeetingMind Learned Today:');
  learningResult.extraction.newFacts.forEach((f) => console.log(`  • [NEW FACT] ${f}`));
  learningResult.extraction.completedCommitments.forEach((c) => console.log(`  • [RESOLVED] ${c}`));
  learningResult.extraction.decisions.forEach((d) => console.log(`  • [DECISION] ${d}`));

  console.log('\n===============================================================');
  console.log('  DEMO COMPLETE: THE PERSISTENT LEARNING LOOP IS FULLY ACTIVE   ');
  console.log('===============================================================\n');
}

// If executed directly via node or tsx
if (import.meta.url === `file://${process.argv[1]}`) {
  runCliDemo().catch((err) => {
    console.error('CLI Demo encountered an error:', err);
    process.exit(1);
  });
}

export { runCliDemo };
