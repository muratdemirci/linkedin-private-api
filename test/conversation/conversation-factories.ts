import Chance from 'chance';
import { orderBy, times } from 'lodash';
import { LinkedinConversation } from 'src';

import { FeaturedType, LinkedInParticipantReceipts } from '../../src/entities/linkedin-conversation.entity';
import { createMiniProfile } from '../profile/profile-factories';

const chance = new Chance();
const createReceipt = (count: number): LinkedInParticipantReceipts[] =>
  times(count, () => ({
    $type: 'com.linkedin.voyager.messaging.ParticipantReceipts',
    fromEntity: chance.guid(),
    fromParticipant: chance.guid(),
    seenReceipt: {
      $type: 'com.linkedin.voyager.messaging.SeenReceipt',
      eventUrn: chance.guid(),
      seenAt: chance.integer(),
    },
  }));

const createConversation = (count: number): Partial<LinkedinConversation>[] =>
  times(count, () => ({
    $type: 'com.linkedin.voyager.messaging.Conversation',
    '*events': [chance.guid()],
    '*participants': [chance.guid(), chance.guid()],
    '*type': [chance.guid()],
    archived: chance.bool(),
    backendUrn: chance.guid(),
    blocked: chance.bool(),
    entityUrn: `urn:li:fs_conversation:${chance.guid()}`,
    featureTypes: Object.values(FeaturedType.CREATE_NEW_GROUP_CHAT),
    firstMessageUrn: chance.guid(),
    lastActivityAt: chance.integer(),
    muted: chance.bool(),
    notificationStatus: chance.word(),
    read: chance.bool(),
    receipts: createReceipt(2),
    totalEventCount: chance.integer(),
    unreadCount: chance.integer(),
    viewerCurrentParticipant: chance.bool(),
    withNonConnection: chance.bool(),
  }));

export const createGetConversationsResponse = (count: number) => {
  const resultConversations = createConversation(count);
  const resultProfiles = createMiniProfile(count * 2); // two participants for each conversation
  const response = {
    data: {},
    included: [...resultConversations, ...resultProfiles],
  };

  return { response, resultConversations: orderBy(resultConversations, 'lastActivityAt', 'desc'), resultProfiles };
};

export const createGetConversationResponse = () => {
  const resultConversation = createConversation(1)[0];
  const resultProfiles = createMiniProfile(2); // two participants for each conversation
  const response = {
    data: resultConversation,
    included: resultProfiles,
  };

  return { response, resultConversation, resultProfiles };
};
