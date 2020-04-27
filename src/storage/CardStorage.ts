import { Trello } from '../types/TrelloPowerUp';
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

  getDiscussionStatus(t: Trello.PowerUp.IFrame): PromiseLike<DiscussionStatus> {
    return super.read(t, CardStorage.DISCUSSION_STATUS);
  }

  getDiscussionElapsed(t: Trello.PowerUp.IFrame): PromiseLike<number> {
    return super.read(t, CardStorage.DISCUSSION_ELAPSED);
  }

  getDiscussionThumbs(t: Trello.PowerUp.IFrame): PromiseLike<Thumbs> {
    return super.read(t, CardStorage.DISCUSSION_THUMBS);
  }

  getDiscussionButtonLabel(t: Trello.PowerUp.IFrame): PromiseLike<string> {
    return super.read(t, CardStorage.DISCUSSION_BUTTON_LABEL);
  }

  saveDiscussionStatus(t: Trello.PowerUp.IFrame, newStatus: DiscussionStatus, cardId?: string): PromiseLike<void> {
    return super.write(t, CardStorage.DISCUSSION_STATUS, newStatus, cardId);
  }

  saveDiscussionElapsed(t: Trello.PowerUp.IFrame, newElapsed: number, cardId?: string): PromiseLike<void> {
    return super.write(t, CardStorage.DISCUSSION_ELAPSED, newElapsed, cardId);
  }

  saveDiscussionThumbs(t: Trello.PowerUp.IFrame, newThumbs: Thumbs): PromiseLike<void> {
    return super.write(t, CardStorage.DISCUSSION_THUMBS, newThumbs);
  }

  saveVotes(t: Trello.PowerUp.IFrame, newVotes: Votes): PromiseLike<void> {
    return super.write(t, CardStorage.VOTES, newVotes);
  }

  saveDiscussionButtonLabel(t: Trello.PowerUp.IFrame, newLabel?: string): PromiseLike<void> {
    return super.write(t, CardStorage.DISCUSSION_BUTTON_LABEL, newLabel);
  }

  deleteDiscussionThumbs(t: Trello.PowerUp.IFrame): PromiseLike<void> {
    return super.delete(t, CardStorage.DISCUSSION_THUMBS);
  }
}

export {
  CardStorage
};
