import BoardStorage from './storage/BoardStorage';
import CardStorage from './storage/CardStorage';
import Notifications from './Notifications';

export const Statuses = {
  ONGOING: 'ONGOING',
  PAUSED: 'PAUSED',
  ENDED: 'ENDED'
};

export const Thumbs = {
  UP: 'UP',
  DOWN: 'DOWN',
  MIDDLE: 'MIDDLE'
};

class Discussion {
  constructor(window, baseUrl, maxDiscussionDuration) {
    this.w = window;
    this.baseUrl = baseUrl;
    this.notifications = new Notifications(this.w, this.baseUrl);
    this.maxDiscussionDuration = maxDiscussionDuration;
    this.boardStorage = new BoardStorage();
    this.cardStorage = new CardStorage();
  }

  isOngoingOrPausedForAnotherCard = async (t) => {
    const boardStatus = await this.boardStorage.getDiscussionStatus(t);
    const cardId = await this.boardStorage.getDiscussionCardId(t);

    return [Statuses.ONGOING, Statuses.PAUSED].includes(boardStatus) &&
      cardId !== t.getContext().card;
  };

  isOngoingFor = async (t) => {
    const cardStatus = await this.cardStorage.getDiscussionStatus(t);
    return Statuses.ONGOING === cardStatus;
  };

  isPausedFor = async (t) => {
    const cardStatus = await this.cardStorage.getDiscussionStatus(t);
    return Statuses.PAUSED === cardStatus;
  };

  getElapsed = t => this.cardStorage.getDiscussionElapsed(t);

  updateElapsed = async (t) => {
    const startedAt = await this.boardStorage.getDiscussionStartedAt(t);
    const elapsed = Date.now() - startedAt;

    if (elapsed > this.maxDiscussionDuration) {
      this.pause(t);
    } else {
      this.saveElapsed(t);
    }
  };

  saveElapsed = async (t) => {
    const startedAt = await this.boardStorage.getDiscussionStartedAt(t);
    const previousElapsed = await this.boardStorage.getDiscussionPreviousElapsed(t) || 0;
    const elapsed = startedAt ? Date.now() - startedAt : 0;

    this.cardStorage.saveDiscussionElapsed(t, (elapsed + previousElapsed));
  };

  start = async (t) => {
    this.boardStorage.writeMultiple(t, {
      [BoardStorage.DISCUSSION_STATUS]: Statuses.ONGOING,
      [BoardStorage.DISCUSSION_CARD_ID]: t.getContext().card,
      [BoardStorage.DISCUSSION_STARTED_AT]: Date.now(),
      [BoardStorage.DISCUSSION_PREVIOUS_ELAPSED]: await this.getElapsed(t),
      [BoardStorage.DISCUSSION_INTERVAL_ID]: setInterval(this.updateElapsed, 5000, t)
    });

    this.cardStorage.saveDiscussionStatus(t, Statuses.ONGOING);
  };

  pause = async (t) => {
    const intervalId = await this.boardStorage.getDiscussionIntervalId(t);
    const cardId = await this.boardStorage.getDiscussionCardId(t);
    const cardName = (await t.cards('id', 'name')).find(card => card.id === cardId).name;

    clearInterval(intervalId);

    this.cardStorage.saveDiscussionStatus(t, Statuses.PAUSED);
    this.saveElapsed(t);
    this.boardStorage.writeMultiple(t, {
      [BoardStorage.DISCUSSION_STATUS]: Statuses.PAUSED,
      [BoardStorage.DISCUSSION_STARTED_AT]: null,
      [BoardStorage.DISCUSSION_PREVIOUS_ELAPSED]: await this.getElapsed(t),
      [BoardStorage.DISCUSSION_INTERVAL_ID]: null
    });

    this.notifications.play(this.notifications.Types.ELAPSED);
    this.notifications.show(this.notifications.Types.ELAPSED, cardName);
  };

  end = async (t) => {
    const intervalId = await this.boardStorage.getDiscussionIntervalId(t);
    clearInterval(intervalId);

    try {
      await this.cardStorage.saveDiscussionStatus(t, Statuses.ENDED);
      await this.saveElapsed(t);
      await this.cardStorage.deleteMultiple(t, [CardStorage.DISCUSSION_THUMBS]);
      await this.boardStorage.deleteMultiple(t, [
        BoardStorage.DISCUSSION_STATUS,
        BoardStorage.DISCUSSION_CARD_ID,
        BoardStorage.DISCUSSION_STARTED_AT,
        BoardStorage.DISCUSSION_PREVIOUS_ELAPSED,
        BoardStorage.DISCUSSION_INTERVAL_ID
      ]);
    } catch (err) {
      throw new Error(err);
    }
  };
}

export default Discussion;
