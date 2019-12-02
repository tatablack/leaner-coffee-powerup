import Trello from '../@types/TrelloPowerUp';
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

    getDiscussionStatus(t): Trello.Promise<DiscussionStatus> {
      return super.read(t, BoardStorage.DISCUSSION_STATUS);
    }

    getDiscussionCardId(t): Trello.Promise<string> {
      return super.read(t, BoardStorage.DISCUSSION_CARD_ID);
    }

    getDiscussionStartedAt(t): Trello.Promise<DiscussionStartedAt> {
      return super.read(t, BoardStorage.DISCUSSION_STARTED_AT);
    }

    getDiscussionPreviousElapsed(t): Trello.Promise<DiscussionPreviousElapsed> {
      return super.read(t, BoardStorage.DISCUSSION_PREVIOUS_ELAPSED);
    }

    getDiscussionIntervalId(t): Trello.Promise<DiscussionIntervalId> {
      return super.read(t, BoardStorage.DISCUSSION_INTERVAL_ID);
    }

    getPowerUpVersion(t): Trello.Promise<string> {
      return super.read(t, BoardStorage.POWER_UP_VERSION);
    }

    setPowerUpVersion(t, version: string): Trello.Promise<void> {
      return super.write(t, BoardStorage.POWER_UP_VERSION, version);
    }
}

export default BoardStorage;
