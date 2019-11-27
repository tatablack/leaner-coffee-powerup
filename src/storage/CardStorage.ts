import { StorageScope, StorageVisibility } from '../utils/TrelloConstants';
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

  getDiscussionStatus(t) {
    return super.read(t, CardStorage.DISCUSSION_STATUS);
  }

  getDiscussionElapsed(t) {
    return super.read(t, CardStorage.DISCUSSION_ELAPSED);
  }

  getDiscussionThumbs(t) {
    return super.read(t, CardStorage.DISCUSSION_THUMBS);
  }

  getDiscussionButtonLabel(t) {
    return super.read(t, CardStorage.DISCUSSION_BUTTON_LABEL);
  }

  saveDiscussionStatus(t, newStatus) {
    return super.write(t, CardStorage.DISCUSSION_STATUS, newStatus);
  }

  saveDiscussionElapsed(t, newElapsed) {
    return super.write(t, CardStorage.DISCUSSION_ELAPSED, newElapsed);
  }

  saveDiscussionThumbs(t, newThumbs) {
    return super.write(t, CardStorage.DISCUSSION_THUMBS, newThumbs);
  }

  saveVotes(t, newVotes) {
    return super.write(t, CardStorage.VOTES, newVotes);
  }

  saveDiscussionButtonLabel(t, newLabel) {
    return super.write(t, CardStorage.DISCUSSION_BUTTON_LABEL, newLabel);
  }

  deleteDiscussionThumbs(t) {
    return super.delete(t, CardStorage.DISCUSSION_THUMBS);
  }
}

export default CardStorage;
