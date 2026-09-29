/**
 * MeetingMind - Comprehensive Test Suite
 * Tests:
 * 1. Memory retention
 * 2. Memory recall (contextual queries)
 * 3. Commitment tracking & overdue detection
 * 4. Relationship reflection
 * 5. Meeting brief generation & grounding
 * 6. Post-meeting learning loop
 * 7. Before vs After memory comparison
 * 8. Empty memory handling
 * 9. Fallback & error handling
 */

import { hindsightService } from '../memory/hindsightClient.js';
import { executeContextualRecall } from '../memory/memoryRecall.js';
import { reflectOnRelationship } from '../memory/memoryReflect.js';
import { generateMeetingBrief, generateGenericBriefWithoutMemory } from '../agent/briefingGenerator.js';
import { postMeetingLearner } from '../agent/postMeetingLearner.js';
import { roleplayAgent } from '../agent/roleplayAgent.js';
import {
  DEMO_CONTACTS,
  DEMO_MEMORIES,
  DEMO_COMMITMENTS,
  DEMO_UPCOMING_MEETING,
  DEMO_SAMPLE_POST_MEETING_TRANSCRIPT
} from '../demo/sarahLinScenario.js';

let passed = 0;
let failed = 0;

function assert(condition: boolean, testName: string, detail?: string) {
  if (condition) {
    console.log(`  ✓ PASS: ${testName}`);
    passed++;
  } else {
    console.error(`  ✗ FAIL: ${testName} ${detail ? `- ${detail}` : ''}`);
    failed++;
  }
}

export async function runAllTests() {
  console.log('\n--- STARTING MEETINGMIND AGENT TEST SUITE ---');
  const testBankId = 'test-bank-sarah';
  hindsightService.clearBank(testBankId);

  // Test 1: Empty Memory Handling
  console.log('\n[TEST GROUP 1: Empty Memory Handling]');
  const emptyRecalled = await hindsightService.recall(testBankId, 'Any query');
  assert(Array.isArray(emptyRecalled) && emptyRecalled.length === 0, 'Recall returns empty array on fresh bank');

  const emptyReflection = reflectOnRelationship([], []);
  assert(emptyReflection.momentum === 'Stable', 'Empty reflection defaults safely to Stable without crashing');

  // Test 2: Memory Retention
  console.log('\n[TEST GROUP 2: Memory Retention in Hindsight]');
  for (const mem of DEMO_MEMORIES) {
    const res = await hindsightService.retain(testBankId, mem.content, {
      documentId: mem.id,
      timestamp: mem.timestamp,
      tags: mem.tags,
      metadata: {
        category: mem.category,
        groundingType: mem.groundingType,
        sourceMeetingId: mem.sourceMeetingId,
        sourceMeetingTitle: mem.sourceMeetingTitle,
        sourceDate: mem.sourceDate,
        confidence: mem.confidence
      }
    });
    assert(res.success === true, `Retained memory "${mem.id}"`);
  }
  const allStored = hindsightService.listMemories(testBankId);
  assert(allStored.length === DEMO_MEMORIES.length, `Total stored memories equals ${DEMO_MEMORIES.length}`);

  // Test 3: Contextual Memory Recall
  console.log('\n[TEST GROUP 3: Contextual Memory Recall]');
  const testContact = { ...DEMO_CONTACTS[0], bankId: testBankId };
  const recallResult = await executeContextualRecall(testContact, {
    title: DEMO_UPCOMING_MEETING.title,
    objective: DEMO_UPCOMING_MEETING.objective,
    meetingType: DEMO_UPCOMING_MEETING.meetingType
  });

  assert(recallResult.totalRecalled > 0, `Contextual recall retrieved ${recallResult.totalRecalled} items`);
  assert(recallResult.queriesExecuted.length >= 5, 'Executed at least 5 contextual objective-driven queries');
  assert(
    recallResult.concerns.some((c) => c.content.toLowerCase().includes('soc 2') || c.content.toLowerCase().includes('budget')),
    'Successfully recalled SOC 2 / budget concerns'
  );

  // Test 4: Reflection & Overdue Commitment Detection
  console.log('\n[TEST GROUP 4: Reflection & Change Detection]');
  const reflection = reflectOnRelationship(recallResult.allRecalledMemories, DEMO_COMMITMENTS);
  assert(reflection.momentum === 'Needs Attention', 'Correctly flagged momentum as "Needs Attention" due to overdue deliverable');
  assert(reflection.unresolvedCommitments.length >= 1, 'Detected unresolved commitments');
  assert(reflection.patternsDetected.length >= 1, 'Detected recurring patterns across interactions');

  // Test 5: Briefing Generation & Grounded Citations
  console.log('\n[TEST GROUP 5: Meeting Briefing Generation]');
  const brief = await generateMeetingBrief(
    DEMO_UPCOMING_MEETING,
    testContact,
    recallResult.allRecalledMemories,
    reflection,
    DEMO_COMMITMENTS
  );
  assert(Boolean(brief.executiveSummary && brief.executiveSummary.length > 50), 'Generated rich executive summary');
  assert(brief.talkingPoints.length >= 3, 'Generated prioritized talking points');
  assert(brief.memoryCitations.length > 0, 'Every brief contains traceable memory citations');
  assert(
    brief.talkingPoints.some((tp) => tp.point.toLowerCase().includes('soc 2') || tp.rationale.toLowerCase().includes('soc 2')),
    'Talking points specifically address overdue SOC 2 deliverable'
  );

  // Test 6: Before vs After Memory Comparison
  console.log('\n[TEST GROUP 6: Before vs After Memory Difference]');
  const comparison = generateGenericBriefWithoutMemory(DEMO_UPCOMING_MEETING, testContact);
  assert(Boolean(comparison.withoutMemory.weaknessReason), 'Generic brief highlights blindspots of not having memory');
  assert(comparison.withMemory.criticalMemoriesRecalled.length >= 3, 'With memory highlights critical recalled facts');

  // Test 7: Grounded Roleplay
  console.log('\n[TEST GROUP 7: Grounded Roleplay Simulation]');
  const roleplayReply = await roleplayAgent.respond(
    testContact,
    DEMO_UPCOMING_MEETING,
    DEMO_COMMITMENTS,
    [],
    'Hello Sarah, do you have time to see our feature slides today?'
  );
  assert(roleplayReply.sender === 'agent', 'Roleplay responded as agent persona');
  assert(Boolean(roleplayReply.text && roleplayReply.text.length > 20), 'Roleplay produced realistic response');
  assert(Boolean(roleplayReply.groundedInFact), 'Roleplay provided fact citation basis');

  // Test 8: Post-Meeting Learning Loop
  console.log('\n[TEST GROUP 8: Post-Meeting Learning & Memory Update]');
  const initialMemCount = hindsightService.listMemories(testBankId).length;
  const learningResult = await postMeetingLearner.learnAndRetain(
    DEMO_UPCOMING_MEETING,
    testContact,
    DEMO_COMMITMENTS,
    DEMO_SAMPLE_POST_MEETING_TRANSCRIPT
  );

  const updatedMemCount = hindsightService.listMemories(testBankId).length;
  assert(updatedMemCount > initialMemCount, `Memory bank grew from ${initialMemCount} to ${updatedMemCount}`);
  assert(learningResult.resolvedCommitmentIds.includes('com-1'), 'Successfully resolved overdue SOC 2 deliverable');
  assert(learningResult.updatedContact.relationshipStatus === 'Positive Momentum', 'Relationship status evolved to Positive Momentum');

  console.log('\n=============================================');
  console.log(`TEST RESULTS: ${passed} PASSED, ${failed} FAILED`);
  console.log('=============================================\n');

  if (failed > 0) {
    process.exit(1);
  }
}

runAllTests().catch((err) => {
  console.error('Test run failed:', err);
  process.exit(1);
});

