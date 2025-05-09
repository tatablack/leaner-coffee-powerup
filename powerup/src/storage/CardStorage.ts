import Storage from "./Storage";
import { Trello } from "../types/TrelloPowerUp";

class CardStorage extends Storage {
  static DISCUSSION_STATUS = "leancoffeeDiscussionStatus";
  static DISCUSSION_ELAPSED = "leancoffeeDiscussionElapsed";
  static DISCUSSION_THUMBS = "leancoffeeDiscussionThumbs";
  static VOTES = "leancoffeeVotes";
  static DISCUSSION_BUTTON_LABEL = "discussionButtonLabel";

  constructor() {
    super("card", "shared");
  }

  getDiscussionStatus(
    t: Trello.PowerUp.AnonymousHostHandlers,
  ): PromiseLike<DiscussionStatus> {
    return super.read(t, CardStorage.DISCUSSION_STATUS);
  }

  getDiscussionElapsed(
    t: Trello.PowerUp.AnonymousHostHandlers,
  ): PromiseLike<number> {
    return super.read(t, CardStorage.DISCUSSION_ELAPSED);
  }

  getDiscussionThumbs(
    t: Trello.PowerUp.AnonymousHostHandlers,
  ): PromiseLike<Thumbs> {
    return super.read(t, CardStorage.DISCUSSION_THUMBS);
  }

  getDiscussionButtonLabel(
    t: Trello.PowerUp.AnonymousHostHandlers,
  ): PromiseLike<string> {
    return super.read(t, CardStorage.DISCUSSION_BUTTON_LABEL);
  }

  saveDiscussionStatus(
    t: Trello.PowerUp.AnonymousHostHandlers,
    newStatus: DiscussionStatus,
    cardId?: string,
  ): PromiseLike<void> {
    return super.write(t, CardStorage.DISCUSSION_STATUS, newStatus, cardId);
  }

  saveDiscussionElapsed(
    t: Trello.PowerUp.AnonymousHostHandlers,
    newElapsed: number,
    cardId?: string,
  ): PromiseLike<void> {
    return super.write(t, CardStorage.DISCUSSION_ELAPSED, newElapsed, cardId);
  }

  saveDiscussionThumbs(
    t: Trello.PowerUp.AnonymousHostHandlers,
    newThumbs: Thumbs,
  ): PromiseLike<void> {
    return super.write(t, CardStorage.DISCUSSION_THUMBS, newThumbs);
  }

  saveVotes(
    t: Trello.PowerUp.AnonymousHostHandlers,
    newVotes: Votes,
  ): PromiseLike<void> {
    return super.write(t, CardStorage.VOTES, newVotes);
  }

  deleteVotes(t: Trello.PowerUp.AnonymousHostHandlers): PromiseLike<void> {
    return super.delete(t, CardStorage.VOTES);
  }

  saveDiscussionButtonLabel(
    t: Trello.PowerUp.AnonymousHostHandlers,
    newLabel?: string,
  ): PromiseLike<void> {
    return super.write(t, CardStorage.DISCUSSION_BUTTON_LABEL, newLabel);
  }

  deleteDiscussionThumbs(
    t: Trello.PowerUp.AnonymousHostHandlers,
  ): PromiseLike<void> {
    return super.delete(t, CardStorage.DISCUSSION_THUMBS);
  }
}

export default CardStorage;
