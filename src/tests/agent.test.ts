/**
 * MeetingMind - Comprehensive Test Suite
 *
 * Verifies:
 * 1. Task 12 End-to-End Flow (Retain -> Recall -> Verify -> Generate -> Post-Meeting Retain -> Recall Again)
 * 2. Empty memory handling
 * 3. Contextual multi-query recall
 * 4. Relationship reflection & overdue detection
 * 5. Briefing generation & memory grounding
 * 6. Before vs After comparison
 * 7. Grounded roleplay simulation
 * 8. Post-meeting learning loop
 */

import 'dotenv/config';
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
  console.log('\n===============================================================');
  console.log('       MEETINGMIND AGENT VALIDATION TEST SUITE                 ');
  console.log('===============================================================');

  // Verify connection to distinguish real cloud vs development fallback
  await hindsightService.verifyConnection();
  const serviceStatus = hindsightService.getStatus('meetingmind-acme-sarah');

  console.log(`[ENGINE MODE]        ${serviceStatus.label}`);
  console.log(`[CLOUD VERIFIED]     ${serviceStatus.cloudVerified ? 'YES — Connected to Vectorize Hindsight Cloud' : 'NO — Operating with Development Memory Adapter'}`);
  console.log(`[CREDENTIALS SET]    ${serviceStatus.credentialsConfigured ? 'YES (HINDSIGHT_API_KEY detected)' : 'NO (Unset or Placeholder)'}`);
  console.log(`[API BASE URL]       ${serviceStatus.baseUrl}`);
  console.log(`[ENDPOINT]           ${serviceStatus.endpoint}`);
  console.log('---------------------------------------------------------------\n');

  // =========================================================================
  // TASK 12 MANDATED SPECIFICATION: 6-STEP PERSISTENCE TEST
  // =========================================================================
  console.log('[TEST GROUP 1: Real Task 12 Persistence & Retrieval Cycle]');
  const t12BankId = 'meetingmind-acme-sarah';
  const testContact = { ...DEMO_CONTACTS[0], bankId: t12BankId };

  // Step 1: RETAIN
  console.log('  Step 1: Storing Sarah Lin meeting memory...');
  const t12MemoryContent = 'Sarah Lin raised a budget concern and requested SOC 2 documentation. The team promised to send the security whitepaper.';
  const retainResult1 = await hindsightService.retain(t12BankId, t12MemoryContent, {
    documentId: 't12-sarah-soc2-promise',
    timestamp: '2026-05-02T10:00:00Z',
    tags: ['budget', 'security', 'soc2', 'sarah-lin'],
    metadata: {
      category: 'concern',
      groundingType: 'FACT',
      sourceMeetingId: 'meet-001',
      sourceMeetingTitle: 'Initial Architecture & Security Review',
      sourceDate: '2026-05-02',
      confidence: 0.98
    }
  });
  assert(retainResult1.success === true, 'Step 1: RETAIN succeeded', `mode=${retainResult1.mode}`);

  // Step 2: RECALL
  console.log('  Step 2: Querying "What concerns, commitments, and promises are associated with Sarah Lin?"...');
  const t12Query1 = 'What concerns, commitments, and promises are associated with Sarah Lin?';
  const recalledResults1 = await hindsightService.recall(t12BankId, t12Query1, {
    preferObservations: true,
    maxTokens: 1500
  });

  // Step 3: VERIFY
  assert(recalledResults1.length > 0, `Step 3: RECALL returned ${recalledResults1.length} memory item(s)`);
  const foundSoc2 = recalledResults1.some(
    (item) => item.content.toLowerCase().includes('soc 2') || item.content.toLowerCase().includes('security')
  );
  assert(foundSoc2, 'Step 3: VERIFY memory contains historical SOC 2 / budget information');

  // Step 4: GENERATE Meeting Brief
  console.log('  Step 4: Generating Meeting Brief grounded in recalled memory...');
  const t12Brief = await generateMeetingBrief(
    DEMO_UPCOMING_MEETING,
    testContact,
    recalledResults1,
    reflectOnRelationship(recalledResults1, DEMO_COMMITMENTS),
    DEMO_COMMITMENTS
  );
  assert(Boolean(t12Brief && t12Brief.executiveSummary), 'Step 4: GENERATE briefing produced executive summary');
  assert(t12Brief.talkingPoints.length >= 2, 'Step 4: GENERATE briefing produced grounded talking points');

  // Step 5: POST-MEETING RETAIN
  console.log('  Step 5: Post-meeting retaining newly learned fact...');
  const newFact = 'Sarah agreed to review the security proposal by Friday.';
  const retainResult2 = await hindsightService.retain(t12BankId, newFact, {
    documentId: 't12-sarah-friday-agreement',
    timestamp: '2026-05-18T16:00:00Z',
    tags: ['decision', 'security', 'proposal', 'sarah-lin'],
    metadata: {
      category: 'decision',
      groundingType: 'FACT',
      sourceMeetingId: 'meet-006',
      sourceMeetingTitle: 'Q3 Security & Pricing Alignment',
      sourceDate: '2026-05-18',
      confidence: 0.99
    }
  });
  assert(retainResult2.success === true, 'Step 5: POST-MEETING RETAIN stored new fact');

  // Step 6: RECALL AGAIN
  console.log('  Step 6: Recalling again to verify newly learned information is retrieved...');
  const recalledResults2 = await hindsightService.recall(t12BankId, 'What did Sarah agree to regarding the security proposal?', {
    preferObservations: true
  });
  const foundFriday = recalledResults2.some(
    (item) => item.content.toLowerCase().includes('friday') || item.content.toLowerCase().includes('security proposal')
  );
  assert(foundFriday, 'Step 6: RECALL AGAIN successfully retrieved newly learned post-meeting knowledge');

  // =========================================================================
  // ADDITIONAL ARCHITECTURAL VERIFICATION GROUPS
  // =========================================================================

  // Test Group 2: Empty Memory Handling
  console.log('\n[TEST GROUP 2: Fresh Bank & Empty Memory Handling]');
  const isolatedBank = 'meetingmind-test-isolated-bank';
  hindsightService.clearBank(isolatedBank);
  const emptyRecalled = await hindsightService.recall(isolatedBank, 'Non-existent topic');
  assert(Array.isArray(emptyRecalled) && emptyRecalled.length === 0, 'Recall on unpopulated bank returns empty array without throwing');

  const emptyReflection = reflectOnRelationship([], []);
  assert(emptyReflection.momentum === 'Stable', 'Empty reflection defaults safely to Stable without crashing');

  // Test Group 3: Historical Meetings Ingestion
  console.log('\n[TEST GROUP 3: Ingestion of Multi-Meeting History]');
  for (const mem of DEMO_MEMORIES) {
    const res = await hindsightService.retain(t12BankId, mem.content, {
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
    assert(res.success === true, `Retained historical meeting memory "${mem.id}"`);
  }

  // Test Group 4: Contextual Multi-Query Recall
  console.log('\n[TEST GROUP 4: Contextual Objective-Directed Recall]');
  const contextualRecallResult = await executeContextualRecall(testContact, {
    title: DEMO_UPCOMING_MEETING.title,
    objective: DEMO_UPCOMING_MEETING.objective,
    meetingType: DEMO_UPCOMING_MEETING.meetingType
  });
  assert(contextualRecallResult.totalRecalled > 0, `Contextual recall retrieved ${contextualRecallResult.totalRecalled} items`);
  assert(contextualRecallResult.queriesExecuted.length >= 5, 'Executed at least 5 contextual objective-driven queries');
  assert(
    contextualRecallResult.concerns.some((c) => c.content.toLowerCase().includes('soc 2') || c.content.toLowerCase().includes('budget')),
    'Successfully surfaced persistent SOC 2 / budget concerns'
  );

  // Test Group 5: Reflection & Overdue Commitment Detection
  console.log('\n[TEST GROUP 5: Relationship Reflection & Overdue Commitments]');
  const reflection = reflectOnRelationship(contextualRecallResult.allRecalledMemories, DEMO_COMMITMENTS);
  assert(reflection.momentum === 'Needs Attention', 'Correctly flagged momentum as "Needs Attention" due to overdue SOC 2 deliverable');
  assert(reflection.unresolvedCommitments.length >= 1, 'Detected unresolved commitments');
  assert(reflection.patternsDetected.length >= 1, 'Detected recurring cross-meeting patterns');

  // Test Group 6: Before vs After Comparison
  console.log('\n[TEST GROUP 6: Before vs After Memory Contrast]');
  const comparison = generateGenericBriefWithoutMemory(DEMO_UPCOMING_MEETING, testContact);
  assert(Boolean(comparison.withoutMemory.weaknessReason), 'Generic brief identifies lack of memory context');
  assert(comparison.withMemory.criticalMemoriesRecalled.length >= 3, 'Grounded brief shows critical remembered points');

  // Test Group 7: Roleplay Simulation
  console.log('\n[TEST GROUP 7: Grounded Roleplay Simulation]');
  const roleplayReply = await roleplayAgent.respond(
    testContact,
    DEMO_UPCOMING_MEETING,
    DEMO_COMMITMENTS,
    [],
    'Hello Sarah, ready to start the architecture review?'
  );
  assert(roleplayReply.sender === 'agent', 'Roleplay responded as simulated agent');
  assert(Boolean(roleplayReply.text && roleplayReply.text.length > 20), 'Roleplay produced realistic response');
  assert(Boolean(roleplayReply.groundedInFact), 'Roleplay provided factual memory ground');

  // Test Group 8: Post-Meeting Learner Pipeline
  console.log('\n[TEST GROUP 8: Autonomous Post-Meeting Learner Loop]');
  const learningResult = await postMeetingLearner.learnAndRetain(
    DEMO_UPCOMING_MEETING,
    testContact,
    DEMO_COMMITMENTS,
    DEMO_SAMPLE_POST_MEETING_TRANSCRIPT
  );
  assert(learningResult.retainedMemoriesCount > 0, `Learner retained ${learningResult.retainedMemoriesCount} new memories`);
  assert(learningResult.resolvedCommitmentIds.includes('com-1'), 'Successfully resolved overdue SOC 2 deliverable');
  assert(learningResult.updatedContact.relationshipStatus === 'Positive Momentum', 'Relationship status evolved to Positive Momentum');

  console.log('\n===============================================================');
  console.log(`TEST SUMMARY: ${passed} PASSED, ${failed} FAILED`);
  console.log(`Execution Mode: ${serviceStatus.label}`);
  console.log('===============================================================\n');

  if (failed > 0) {
    process.exit(1);
  }
}

runAllTests().catch((err) => {
  console.error('Test run failed:', err);
  process.exit(1);
});
