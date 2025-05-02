import Notifications, { NotificationType } from "./Notifications";
import BoardStorage from "../storage/BoardStorage";
import CardStorage from "../storage/CardStorage";
import { Trello } from "../types/TrelloPowerUp";

class Discussion {
  w: Window;
  p: Trello.PowerUp.Plugin;
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

  init = (p: Trello.PowerUp.Plugin): void => {
    this.p = p;
  };

  getElapsedNotification = (): NotificationType => ({
    audio: "assets/looking_down.mp3",
    text: this.p.localizeKey("elapsedNotification"),
  });

  isOngoingOrPausedForAnotherCard = async (
    t: Trello.PowerUp.IFrame,
  ): Promise<boolean> => {
    const boardStatus = await this.boardStorage.getDiscussionStatus(t);
    const cardId = await this.boardStorage.getDiscussionCardId(t);

    return (
      ["ONGOING", "PAUSED"].includes(boardStatus) &&
      cardId !== t.getContext().card
    );
  };

  hasEverBeenDiscussed = async (t: Trello.PowerUp.IFrame): Promise<boolean> => {
    const cardStatus = await this.cardStorage.getDiscussionStatus(t);
    return cardStatus !== undefined;
  };

  hasNotBeenArchived = async (
    t: Trello.PowerUp.IFrame,
    cardId: string,
  ): Promise<boolean> => {
    const allCards = await t.cards("id", "name");
    return !!allCards.find((card) => card.id === cardId);
  };

  isOngoingFor = async (t: Trello.PowerUp.IFrame): Promise<boolean> => {
    const cardStatus = await this.cardStorage.getDiscussionStatus(t);
    return cardStatus === "ONGOING";
  };

  isPausedFor = async (t: Trello.PowerUp.IFrame): Promise<boolean> => {
    const cardStatus = await this.cardStorage.getDiscussionStatus(t);
    return cardStatus === "PAUSED";
  };

  getElapsed = (t: Trello.PowerUp.IFrame): PromiseLike<number> =>
    this.cardStorage.getDiscussionElapsed(t);

  updateElapsed = async (t: Trello.PowerUp.IFrame): Promise<void> => {
    const startedAt = await this.boardStorage.getDiscussionStartedAt(t);
    const elapsed = Date.now() - startedAt;

    if (elapsed > this.maxDiscussionDuration) {
      await this.pause(t, true);
    } else {
      await this.saveElapsed(t);
    }
  };

  saveElapsed = async (t: Trello.PowerUp.IFrame): Promise<void> => {
    const cardId = await this.boardStorage.getDiscussionCardId(t);
    const startedAt = await this.boardStorage.getDiscussionStartedAt(t);
    const previousElapsed =
      (await this.boardStorage.getDiscussionPreviousElapsed(t)) || 0;
    const elapsed = startedAt ? Date.now() - startedAt : 0;

    await this.cardStorage.saveDiscussionElapsed(
      t,
      elapsed + previousElapsed,
      cardId,
    );
  };

  start = async (t: Trello.PowerUp.IFrame): Promise<void> => {
    await this.boardStorage.writeMultiple(t, {
      [BoardStorage.DISCUSSION_STATUS]: "ONGOING",
      [BoardStorage.DISCUSSION_CARD_ID]: t.getContext().card,
      [BoardStorage.DISCUSSION_STARTED_AT]: Date.now(),
      [BoardStorage.DISCUSSION_PREVIOUS_ELAPSED]: await this.getElapsed(t),
      [BoardStorage.DISCUSSION_INTERVAL_ID]: setInterval(
        this.updateElapsed,
        5000,
        t,
      ),
    });

    await this.cardStorage.saveDiscussionStatus(t, "ONGOING");
    await this.cardStorage.deleteDiscussionThumbs(t);
  };

  pause = async (t: Trello.PowerUp.IFrame, notify = false): Promise<void> => {
    const intervalId = await this.boardStorage.getDiscussionIntervalId(t);
    const cardId = await this.boardStorage.getDiscussionCardId(t);
    const cardName = (await t.cards("id", "name")).find(
      (card) => card.id === cardId,
    ).name;

    clearInterval(intervalId);

    await this.cardStorage.saveDiscussionStatus(t, "PAUSED");
    await this.saveElapsed(t);
    await this.boardStorage.writeMultiple(t, {
      [BoardStorage.DISCUSSION_STATUS]: "PAUSED",
      [BoardStorage.DISCUSSION_STARTED_AT]: null,
      [BoardStorage.DISCUSSION_PREVIOUS_ELAPSED]: await this.getElapsed(t),
      [BoardStorage.DISCUSSION_INTERVAL_ID]: null,
    });

    if (notify) {
      const elapsedNotification = this.getElapsedNotification();
      await this.notifications.play(elapsedNotification);
      this.notifications.show(elapsedNotification, cardName);
    }
  };

  end = async (t: Trello.PowerUp.IFrame): Promise<void> => {
    const intervalId = await this.boardStorage.getDiscussionIntervalId(t);
    const cardId = await this.boardStorage.getDiscussionCardId(t);
    clearInterval(intervalId);

    try {
      await this.cardStorage.saveDiscussionStatus(t, "ENDED", cardId);
      await this.saveElapsed(t);
      await this.cardStorage.deleteMultiple(
        t,
        [CardStorage.DISCUSSION_THUMBS],
        cardId,
      );
      await this.boardStorage.deleteMultiple(t, [
        BoardStorage.DISCUSSION_STATUS,
        BoardStorage.DISCUSSION_CARD_ID,
        BoardStorage.DISCUSSION_STARTED_AT,
        BoardStorage.DISCUSSION_PREVIOUS_ELAPSED,
        BoardStorage.DISCUSSION_INTERVAL_ID,
      ]);
    } catch (err) {
      throw new Error(
        err instanceof Error && err.message
          ? err.message
          : "Error while ending a discussion",
      );
    }
  };

  reset = async (t: Trello.PowerUp.IFrame): Promise<void> => {
    if (await this.hasEverBeenDiscussed(t)) {
      await this.cardStorage.deleteMultiple(
        t,
        [
          CardStorage.DISCUSSION_STATUS,
          CardStorage.DISCUSSION_ELAPSED,
          CardStorage.DISCUSSION_THUMBS,
        ],
        t.getContext().card,
      );
    }
  };
}

export default Discussion;
