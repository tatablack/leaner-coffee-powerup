import Bluebird from 'bluebird';
import Storage from './Storage';

class BoardStorage extends Storage {
    static DISCUSSION_STATUS = 'leancoffeeDiscussionStatus';
    static DISCUSSION_CARD_ID = 'leancoffeeDiscussionCardId';
    static DISCUSSION_STARTED_AT = 'leancoffeeDiscussionStartedAt';
    static DISCUSSION_PREVIOUS_ELAPSED = 'leancoffeeDiscussionPreviousElapsed';
    static DISCUSSION_INTERVAL_ID = 'leancoffeeDiscussionIntervalId';
    static POWER_UP_VERSION = 'powerUpVersion';

    constructor() {
      super('board', 'shared');
    }

    getDiscussionStatus(t): Bluebird<DiscussionStatus> {
      return super.read(t, BoardStorage.DISCUSSION_STATUS);
    }

    getDiscussionCardId(t): Bluebird<string> {
      return super.read(t, BoardStorage.DISCUSSION_CARD_ID);
    }

    getDiscussionStartedAt(t): Bluebird<DiscussionStartedAt> {
      return super.read(t, BoardStorage.DISCUSSION_STARTED_AT);
    }

    getDiscussionPreviousElapsed(t): Bluebird<DiscussionPreviousElapsed> {
      return super.read(t, BoardStorage.DISCUSSION_PREVIOUS_ELAPSED);
    }

    getDiscussionIntervalId(t): Bluebird<DiscussionIntervalId> {
      return super.read(t, BoardStorage.DISCUSSION_INTERVAL_ID);
    }

    getPowerUpVersion(t): Bluebird<string> {
      return super.read(t, BoardStorage.POWER_UP_VERSION);
    }

    setPowerUpVersion(t, version: string): Bluebird<void> {
      return super.write(t, BoardStorage.POWER_UP_VERSION, version);
    }
}

export default BoardStorage;
