/**
 * Meeting Preparation Agent
 * Coordinates contextual memory retrieval, reflection, commitment resolution,
 * and executive brief synthesis.
 */

import { Contact, Meeting, Commitment, MeetingBrief, BeforeAfterComparison } from '../models/entities.js';
import { executeContextualRecall, ContextualRecallResult } from '../memory/memoryRecall.js';
import { reflectOnRelationship, RelationshipReflection } from '../memory/memoryReflect.js';
import { generateMeetingBrief, generateGenericBriefWithoutMemory } from './briefingGenerator.js';

export interface MeetingPrepResult {
  brief: MeetingBrief;
  recallResult: ContextualRecallResult;
  reflection: RelationshipReflection;
  beforeAfterComparison: BeforeAfterComparison;
}

export class MeetingPrepAgent {
  /**
   * Autonomously prepare for an upcoming meeting using persistent memory.
   */
  public async prepareMeeting(
    meeting: Meeting,
    contact: Contact,
    allKnownCommitments: Commitment[]
  ): Promise<MeetingPrepResult> {
    console.info(`[MeetingPrepAgent] Preparing briefing for meeting "${meeting.title}" with ${contact.name}...`);

    // 1. Contextual Recall from Hindsight
    const recallResult = await executeContextualRecall(contact, {
      title: meeting.title,
      objective: meeting.objective,
      meetingType: meeting.meetingType
    });
    console.info(`[MeetingPrepAgent] Recalled ${recallResult.totalRecalled} persistent memories across ${recallResult.queriesExecuted.length} contextual queries.`);

    // 2. Reflection & Relationship Intelligence
    const relevantCommitments = allKnownCommitments.filter((c) => c.contactId === contact.id);
    const reflection = reflectOnRelationship(recallResult.allRecalledMemories, relevantCommitments);

    // 3. Generate Grounded Executive Briefing
    const brief = await generateMeetingBrief(
      meeting,
      contact,
      recallResult.allRecalledMemories,
      reflection,
      relevantCommitments
    );

    // 4. Generate Before vs After Memory Comparison
    const beforeAfterComparison = generateGenericBriefWithoutMemory(
      meeting,
      contact,
      brief,
      recallResult.allRecalledMemories
    );

    return {
      brief,
      recallResult,
      reflection,
      beforeAfterComparison
    };
  }
}

export const meetingPrepAgent = new MeetingPrepAgent();
