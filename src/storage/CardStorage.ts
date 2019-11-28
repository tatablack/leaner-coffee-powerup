import Bluebird from 'bluebird';
import Storage from './Storage';

class CardStorage extends Storage {
  static DISCUSSION_STATUS = 'leancoffeeDiscussionStatus';
  static DISCUSSION_ELAPSED = 'leancoffeeDiscussionElapsed';
  static DISCUSSION_THUMBS = 'leancoffeeDiscussionThumbs';
  static VOTES = 'leancoffeeVotes';
  static DISCUSSION_BUTTON_LABEL = 'discussionButtonLabel';

  constructor() {
    super('card', 'shared');
  }

  getDiscussionStatus(t): Bluebird<DiscussionStatus> {
    return super.read(t, CardStorage.DISCUSSION_STATUS);
  }

  getDiscussionElapsed(t): Bluebird<number> {
    return super.read(t, CardStorage.DISCUSSION_ELAPSED);
  }

  getDiscussionThumbs(t): Bluebird<Thumbs> {
    return super.read(t, CardStorage.DISCUSSION_THUMBS);
  }

  getDiscussionButtonLabel(t) {
    return super.read(t, CardStorage.DISCUSSION_BUTTON_LABEL);
  }

  saveDiscussionStatus(t, newStatus: DiscussionStatus): Bluebird<void> {
    return super.write(t, CardStorage.DISCUSSION_STATUS, newStatus);
  }

  saveDiscussionElapsed(t, newElapsed): Bluebird<void> {
    return super.write(t, CardStorage.DISCUSSION_ELAPSED, newElapsed);
  }

  saveDiscussionThumbs(t, newThumbs: Thumbs): Bluebird<void> {
    return super.write(t, CardStorage.DISCUSSION_THUMBS, newThumbs);
  }

  saveVotes(t, newVotes): Bluebird<void> {
    return super.write(t, CardStorage.VOTES, newVotes);
  }

  saveDiscussionButtonLabel(t, newLabel?): Bluebird<void> {
    return super.write(t, CardStorage.DISCUSSION_BUTTON_LABEL, newLabel);
  }

  deleteDiscussionThumbs(t): Bluebird<void> {
    return super.delete(t, CardStorage.DISCUSSION_THUMBS);
  }
}

export default CardStorage;
