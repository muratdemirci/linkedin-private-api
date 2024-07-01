import Chance from 'chance';
import { orderBy, times } from 'lodash';

import { LinkedEventCreateResponse } from '../../src/entities/linkedin-event-create-response';
import { LinkedInMessageEvent } from '../../src/entities/linkedin-message-event.entity';
import { LinkedInMessage } from '../../src/entities/linkedin-message.entity';
import { createMiniProfile } from '../profile/profile-factories';

const chance = new Chance();
const createMessage = (count: number): LinkedInMessage[] =>
  times(count, () => ({
    $type: 'com.linkedin.voyager.messaging.event.MessageEvent',
    attributedBody: {
      $type: 'com.linkedin.pemberly.text.AttributedText',
      text: chance.sentence(),
    },
    body: chance.word(),
    messageBodyRenderFormat: chance.word(),
  }));

const createMessageEvent = (count: number): Partial<LinkedInMessageEvent>[] =>
  times(count, () => ({
    $type: 'com.linkedin.voyager.messaging.Event',
    '*from': chance.guid(),
    backendUrn: chance.guid(),
    createdAt: chance.integer(),
    dashEntityUrn: chance.guid(),
    entityUrn: chance.guid(),
    originToken: chance.guid(),
    subtype: chance.guid(),
    previousEventInConversation: chance.guid(),
    eventContent: createMessage(1)[0],
  }));

const createEventCreate = (count: number): LinkedEventCreateResponse[] =>
  times(count, () => ({
    $type: 'com.linkedin.voyager.messaging.create.EventCreateResponse',
    backendConversationUrn: chance.guid(),
    backendEventUrn: chance.guid(),
    conversationUrn: chance.guid(),
    createdAt: chance.integer(),
    eventUrn: chance.guid(),
  }));

export const createSendMessageResponse = () => {
  const resultCreationEvent = createEventCreate(1)[0];
  const response = {
    data: {
      $type: 'com.linkedin.restli.common.ActionResponse',
      value: resultCreationEvent,
    },
    included: [],
  };

  return { response, resultCreationEvent };
};

export const createGetMessagesResponse = (count: number) => {
  const resultMessages = createMessageEvent(count);
  const resultProfiles = createMiniProfile(count * 2); // two participants for each conversation
  const response = {
    data: {},
    included: [...resultMessages, ...resultProfiles],
  };

  return { response, resultMessages: orderBy(resultMessages, 'createdAt', 'desc'), resultProfiles };
};
