import Trello from '../@types/TrelloPowerUp';
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

  getDiscussionStatus(t): Trello.Promise<DiscussionStatus> {
    return super.read(t, CardStorage.DISCUSSION_STATUS);
  }

  getDiscussionElapsed(t): Trello.Promise<number> {
    return super.read(t, CardStorage.DISCUSSION_ELAPSED);
  }

  getDiscussionThumbs(t): Trello.Promise<Thumbs> {
    return super.read(t, CardStorage.DISCUSSION_THUMBS);
  }

  getDiscussionButtonLabel(t) {
    return super.read(t, CardStorage.DISCUSSION_BUTTON_LABEL);
  }

  saveDiscussionStatus(t, newStatus: DiscussionStatus): Trello.Promise<void> {
    return super.write(t, CardStorage.DISCUSSION_STATUS, newStatus);
  }

  saveDiscussionElapsed(t, newElapsed): Trello.Promise<void> {
    return super.write(t, CardStorage.DISCUSSION_ELAPSED, newElapsed);
  }

  saveDiscussionThumbs(t, newThumbs: Thumbs): Trello.Promise<void> {
    return super.write(t, CardStorage.DISCUSSION_THUMBS, newThumbs);
  }

  saveVotes(t, newVotes): Trello.Promise<void> {
    return super.write(t, CardStorage.VOTES, newVotes);
  }

  saveDiscussionButtonLabel(t, newLabel?): Trello.Promise<void> {
    return super.write(t, CardStorage.DISCUSSION_BUTTON_LABEL, newLabel);
  }

  deleteDiscussionThumbs(t): Trello.Promise<void> {
    return super.delete(t, CardStorage.DISCUSSION_THUMBS);
  }
}

export default CardStorage;
