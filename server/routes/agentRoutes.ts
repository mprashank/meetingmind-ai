/**
 * Agent API Routes for MeetingMind backend
 */

import { Router } from 'express';
import { hindsightService } from '../../src/memory/hindsightClient.js';
import { meetingPrepAgent } from '../../src/agent/meetingPrepAgent.js';
import { roleplayAgent } from '../../src/agent/roleplayAgent.js';
import { postMeetingLearner } from '../../src/agent/postMeetingLearner.js';
import {
  DEMO_CONTACTS,
  DEMO_COMPANY,
  DEMO_HISTORICAL_MEETINGS,
  DEMO_UPCOMING_MEETING,
  DEMO_COMMITMENTS,
  DEMO_MEMORIES,
  DEMO_LEARNING_CURVE_STEPS,
  DEMO_SAMPLE_POST_MEETING_TRANSCRIPT
} from '../../src/demo/sarahLinScenario.js';
import { Contact, Meeting, Commitment } from '../../src/models/entities.js';

export const agentRouter = Router();

// In-memory active state (initialized from deterministic demo dataset)
let contactsState: Contact[] = JSON.parse(JSON.stringify(DEMO_CONTACTS));
let meetingsState: Meeting[] = [
  ...JSON.parse(JSON.stringify(DEMO_HISTORICAL_MEETINGS)),
  JSON.parse(JSON.stringify(DEMO_UPCOMING_MEETING))
];
let commitmentsState: Commitment[] = JSON.parse(JSON.stringify(DEMO_COMMITMENTS));

// Seed default bank on boot
async function seedDefaultBank() {
  const bankId = 'meetingmind-acme-sarah';
  const existing = hindsightService.listMemories(bankId);
  if (existing.length === 0) {
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
          confidence: mem.confidence
        }
      });
    }
  }
}
seedDefaultBank().catch(console.error);

// 1. Service Status
agentRouter.get('/status', (req, res) => {
  const bankId = (req.query.bankId as string) || 'meetingmind-acme-sarah';
  const status = hindsightService.getStatus(bankId);
  res.json({
    hindsight: status,
    gemini: {
      configured: Boolean(process.env.GEMINI_API_KEY && !process.env.GEMINI_API_KEY.includes('MY_GEMINI_API_KEY')),
      model: 'gemini-3.8-flash'
    },
    demoCompany: DEMO_COMPANY
  });
});

// 2. Contacts
agentRouter.get('/contacts', (req, res) => {
  res.json({ contacts: contactsState });
});

agentRouter.get('/contacts/:id', (req, res) => {
  const contact = contactsState.find((c) => c.id === req.params.id);
  if (!contact) return res.status(404).json({ error: 'Contact not found' });
  res.json({ contact });
});

// 3. Meetings
agentRouter.get('/meetings', (req, res) => {
  const contactId = req.query.contactId as string;
  let list = meetingsState;
  if (contactId) {
    list = list.filter((m) => m.contactId === contactId);
  }
  res.json({ meetings: list });
});

agentRouter.get('/meetings/:id', (req, res) => {
  const meeting = meetingsState.find((m) => m.id === req.params.id);
  if (!meeting) return res.status(404).json({ error: 'Meeting not found' });
  res.json({ meeting });
});

// 4. Commitments
agentRouter.get('/commitments', (req, res) => {
  const contactId = req.query.contactId as string;
  let list = commitmentsState;
  if (contactId) {
    list = list.filter((c) => c.contactId === contactId);
  }
  res.json({ commitments: list });
});

agentRouter.patch('/commitments/:id', (req, res) => {
  const { status, resolvedDate } = req.body;
  const commitment = commitmentsState.find((c) => c.id === req.params.id);
  if (!commitment) return res.status(404).json({ error: 'Commitment not found' });

  if (status) commitment.status = status;
  if (resolvedDate) commitment.resolvedDate = resolvedDate;
  res.json({ commitment });
});

// 5. Autonomous Meeting Preparation
agentRouter.post('/meetings/:id/prep', async (req, res) => {
  try {
    const meeting = meetingsState.find((m) => m.id === req.params.id) || DEMO_UPCOMING_MEETING;
    const contact = contactsState.find((c) => c.id === meeting.contactId) || contactsState[0];

    const result = await meetingPrepAgent.prepareMeeting(
      meeting,
      contact,
      commitmentsState
    );

    res.json(result);
  } catch (err: any) {
    console.error('[agentRouter] Error preparing meeting:', err);
    res.status(500).json({ error: err.message || 'Failed to prepare meeting brief' });
  }
});

// 6. Roleplay Chat
agentRouter.post('/roleplay/chat', async (req, res) => {
  try {
    const { contactId, meetingId, message, history } = req.body;
    const contact = contactsState.find((c) => c.id === contactId) || contactsState[0];
    const meeting = meetingsState.find((m) => m.id === meetingId) || DEMO_UPCOMING_MEETING;

    const response = await roleplayAgent.respond(
      contact,
      meeting,
      commitmentsState,
      history || [],
      message || ''
    );

    res.json(response);
  } catch (err: any) {
    console.error('[agentRouter] Error in roleplay chat:', err);
    res.status(500).json({ error: err.message || 'Roleplay turn failed' });
  }
});

// 7. Roleplay Evaluation
agentRouter.post('/roleplay/evaluate', async (req, res) => {
  try {
    const { meetingObjective, history } = req.body;
    const evaluation = await roleplayAgent.evaluateSession(
      meetingObjective || DEMO_UPCOMING_MEETING.objective,
      history || []
    );
    res.json(evaluation);
  } catch (err: any) {
    console.error('[agentRouter] Error evaluating roleplay:', err);
    res.status(500).json({ error: err.message || 'Evaluation failed' });
  }
});

// 8. Post-Meeting Completion & Learning Loop
agentRouter.post('/meetings/:id/complete', async (req, res) => {
  try {
    const meeting = meetingsState.find((m) => m.id === req.params.id) || DEMO_UPCOMING_MEETING;
    const contact = contactsState.find((c) => c.id === meeting.contactId) || contactsState[0];
    const transcript = req.body.transcript || DEMO_SAMPLE_POST_MEETING_TRANSCRIPT;

    const result = await postMeetingLearner.learnAndRetain(
      meeting,
      contact,
      commitmentsState,
      transcript
    );

    // Update server state
    meeting.status = 'Completed';
    meeting.transcript = transcript;

    // Update resolved commitments
    for (const cid of result.resolvedCommitmentIds) {
      const comm = commitmentsState.find((c) => c.id === cid);
      if (comm) {
        comm.status = 'COMPLETED';
        comm.resolvedDate = meeting.date;
      }
    }

    // Add new commitments to tracker
    for (const newComm of result.extraction.newCommitments) {
      commitmentsState.push({
        id: `com-${Date.now()}-${Math.random().toString(36).substring(2, 5)}`,
        title: newComm.title,
        description: `Extracted from post-meeting learning loop on ${meeting.date}`,
        owner: newComm.owner,
        dueDate: newComm.dueDate,
        status: 'PENDING',
        sourceMeetingId: meeting.id,
        sourceMeetingTitle: meeting.title,
        sourceDate: meeting.date,
        contactId: contact.id
      });
    }

    // Update contact
    const contactIndex = contactsState.findIndex((c) => c.id === contact.id);
    if (contactIndex >= 0) {
      contactsState[contactIndex] = result.updatedContact;
    }

    res.json(result);
  } catch (err: any) {
    console.error('[agentRouter] Error in complete meeting:', err);
    res.status(500).json({ error: err.message || 'Post-meeting learning failed' });
  }
});

// 9. Timeline Data
agentRouter.get('/timeline/:contactId', (req, res) => {
  const contact = contactsState.find((c) => c.id === req.params.contactId) || contactsState[0];
  const bankId = contact.bankId;
  const memories = hindsightService.listMemories(bankId);

  const timelineEvents = meetingsState
    .filter((m) => m.contactId === contact.id)
    .sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime())
    .map((m) => {
      const relatedMemories = memories.filter((mem) => mem.sourceMeetingId === m.id);
      return {
        meeting: m,
        memories: relatedMemories,
        keyTakeaway: relatedMemories[0]?.content || m.objective
      };
    });

  res.json({ timelineEvents });
});

// 10. Learning Curve Steps
agentRouter.get('/learning-curve', (req, res) => {
  res.json({ steps: DEMO_LEARNING_CURVE_STEPS });
});

// 11. Reset Demo State
agentRouter.post('/demo/reset', async (req, res) => {
  contactsState = JSON.parse(JSON.stringify(DEMO_CONTACTS));
  meetingsState = [
    ...JSON.parse(JSON.stringify(DEMO_HISTORICAL_MEETINGS)),
    JSON.parse(JSON.stringify(DEMO_UPCOMING_MEETING))
  ];
  commitmentsState = JSON.parse(JSON.stringify(DEMO_COMMITMENTS));

  const bankId = 'meetingmind-acme-sarah';
  hindsightService.clearBank(bankId);
  await seedDefaultBank();

  res.json({ success: true, message: 'Demo state reset successfully' });
});
