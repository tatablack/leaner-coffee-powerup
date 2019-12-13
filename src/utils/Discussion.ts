import { Trello } from '../types/TrelloPowerUp';
import BoardStorage from '../storage/BoardStorage';
import CardStorage from '../storage/CardStorage';
import Notifications from './Notifications';

class Discussion {
  w: Window;
  baseUrl: string;
  maxDiscussionDuration: number;
  notifications: Notifications;
  boardStorage: BoardStorage;
  cardStorage: CardStorage;

  constructor(window: Window, baseUrl: string, maxDiscussionDuration: number) {
    this.w = window;
    this.baseUrl = baseUrl;
    this.notifications = new Notifications(this.w, this.baseUrl);
    this.maxDiscussionDuration = maxDiscussionDuration;
    this.boardStorage = new BoardStorage();
    this.cardStorage = new CardStorage();
  }

  isOngoingOrPausedForAnotherCard = async (t: Trello.PowerUp.IFrame): Promise<boolean> => {
    const boardStatus = await this.boardStorage.getDiscussionStatus(t);
    const cardId = await this.boardStorage.getDiscussionCardId(t);

    return ['ONGOING', 'PAUSED'].includes(boardStatus) && cardId !== t.getContext().card;
  };

  hasNotBeenArchived = async (t: Trello.PowerUp.IFrame, cardId: string): Promise<boolean> => {
    const allCards = await t.cards('id', 'name');
    return !!allCards.find((card) => card.id === cardId);
  };

  isOngoingFor = async (t: Trello.PowerUp.IFrame): Promise<boolean> => {
    const cardStatus = await this.cardStorage.getDiscussionStatus(t);
    return cardStatus === 'ONGOING';
  };

  isPausedFor = async (t: Trello.PowerUp.IFrame): Promise<boolean> => {
    const cardStatus = await this.cardStorage.getDiscussionStatus(t);
    return cardStatus === 'PAUSED';
  };

  getElapsed = (t: Trello.PowerUp.IFrame): PromiseLike<number> => this.cardStorage.getDiscussionElapsed(t);

  updateElapsed = async (t: Trello.PowerUp.IFrame): Promise<void> => {
    const startedAt = await this.boardStorage.getDiscussionStartedAt(t);
    const elapsed = Date.now() - startedAt;

    if (elapsed > this.maxDiscussionDuration) {
      clearInterval(await this.boardStorage.getDiscussionIntervalId(t));
      this.pause(t, true);
    } else {
      this.saveElapsed(t);
    }
  };

  saveElapsed = async (t: Trello.PowerUp.IFrame): Promise<void> => {
    const startedAt = await this.boardStorage.getDiscussionStartedAt(t);
    const previousElapsed = await this.boardStorage.getDiscussionPreviousElapsed(t) || 0;
    const elapsed = startedAt ? Date.now() - startedAt : 0;

    this.cardStorage.saveDiscussionElapsed(t, (elapsed + previousElapsed));
  };

  start = async (t: Trello.PowerUp.IFrame): Promise<void> => {
    this.boardStorage.writeMultiple(t, {
      [BoardStorage.DISCUSSION_STATUS]: 'ONGOING',
      [BoardStorage.DISCUSSION_CARD_ID]: t.getContext().card,
      [BoardStorage.DISCUSSION_STARTED_AT]: Date.now(),
      [BoardStorage.DISCUSSION_PREVIOUS_ELAPSED]: await this.getElapsed(t),
      [BoardStorage.DISCUSSION_INTERVAL_ID]: setInterval(this.updateElapsed, 5000, t)
    });

    await this.cardStorage.saveDiscussionStatus(t, 'ONGOING');
    await this.cardStorage.deleteDiscussionThumbs(t);
  };

  pause = async (t: Trello.PowerUp.IFrame, notify = false): Promise<void> => {
    const intervalId = await this.boardStorage.getDiscussionIntervalId(t);
    const cardId = await this.boardStorage.getDiscussionCardId(t);
    const cardName = (await t.cards('id', 'name')).find((card) => card.id === cardId).name;

    clearInterval(intervalId);

    this.cardStorage.saveDiscussionStatus(t, 'PAUSED');
    this.saveElapsed(t);
    this.boardStorage.writeMultiple(t, {
      [BoardStorage.DISCUSSION_STATUS]: 'PAUSED',
      [BoardStorage.DISCUSSION_STARTED_AT]: null,
      [BoardStorage.DISCUSSION_PREVIOUS_ELAPSED]: await this.getElapsed(t),
      [BoardStorage.DISCUSSION_INTERVAL_ID]: null
    });

    if (notify) {
      this.notifications.play(this.notifications.Elapsed);
      this.notifications.show(this.notifications.Elapsed, cardName);
    }
  };

  end = async (t: Trello.PowerUp.IFrame): Promise<void> => {
    const intervalId = await this.boardStorage.getDiscussionIntervalId(t);
    clearInterval(intervalId);

    try {
      await this.cardStorage.saveDiscussionStatus(t, 'ENDED');
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
