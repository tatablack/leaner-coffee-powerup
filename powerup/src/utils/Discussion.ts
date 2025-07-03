import Analytics from "./Analytics";
import { ErrorReporterInjector } from "./Errors";
import Notifications, { NotificationType } from "./Notifications";
import { bindAll } from "./Scope";
import BoardStorage from "../storage/BoardStorage";
import CardStorage from "../storage/CardStorage";

@ErrorReporterInjector
class Discussion {
  w: Window;
  p: Trello.PowerUp.AnonymousHostHandlers;
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
    bindAll(this);
  }

  init = (p: Trello.PowerUp.AnonymousHostHandlers): void => {
    this.p = p;
  };

  getElapsedNotification = (): NotificationType => ({
    audio: "assets/looking_down.mp3",
    text: this.p.localizeKey("elapsedNotification"),
  });

  isOngoingOrPausedForAnotherCard = async (t: Trello.PowerUp.CallbackHandler): Promise<boolean> => {
    const boardStatus = await this.boardStorage.read<DiscussionStatus>(t, BoardStorage.DISCUSSION_STATUS);
    const cardId = await this.boardStorage.read<string>(t, BoardStorage.DISCUSSION_CARD_ID);

    return ["ONGOING", "PAUSED"].includes(boardStatus) && cardId !== t.getContext().card;
  };

  hasEverBeenDiscussed = async (t: Trello.PowerUp.CallbackHandler): Promise<boolean> => {
    const cardStatus = await this.cardStorage.read<DiscussionStatus>(t, CardStorage.DISCUSSION_STATUS);
    return cardStatus !== undefined;
  };

  hasNotBeenArchived = async (t: Trello.PowerUp.CallbackHandler, cardId: string): Promise<boolean> => {
    const allCards = await t.cards("id", "name");
    return !!allCards.find((card) => card.id === cardId);
  };

  isOngoingFor = async (t: Trello.PowerUp.CallbackHandler): Promise<boolean> => {
    const cardStatus = await this.cardStorage.read<DiscussionStatus>(t, CardStorage.DISCUSSION_STATUS);
    return cardStatus === "ONGOING";
  };

  isPausedFor = async (t: Trello.PowerUp.CallbackHandler): Promise<boolean> => {
    const cardStatus = await this.cardStorage.read<DiscussionStatus>(t, CardStorage.DISCUSSION_STATUS);
    return cardStatus === "PAUSED";
  };

  getElapsed = (t: Trello.PowerUp.CallbackHandler): PromiseLike<number> =>
    this.cardStorage.read<number>(t, CardStorage.DISCUSSION_ELAPSED);

  updateElapsed = async (t: Trello.PowerUp.CallbackHandler): Promise<void> => {
    const startedAt = await this.boardStorage.read<number>(t, BoardStorage.DISCUSSION_STARTED_AT);
    const elapsed = Date.now() - startedAt;

    await this.saveElapsed(t);

    if (elapsed > this.maxDiscussionDuration) {
      await this.pause(t, true);
      await Analytics.event(this.w, "discussionStatusChanged", {
        newStatus: "ended",
      });
    }
  };

  saveElapsed = async (t: Trello.PowerUp.CallbackHandler): Promise<void> => {
    const cardId = await this.boardStorage.read<string>(t, BoardStorage.DISCUSSION_CARD_ID);
    const startedAt = await this.boardStorage.read<number>(t, BoardStorage.DISCUSSION_STARTED_AT);
    const previousElapsed = (await this.boardStorage.read<number>(t, BoardStorage.DISCUSSION_PREVIOUS_ELAPSED)) || 0;
    const elapsed = startedAt ? Date.now() - startedAt : 0;

    await this.cardStorage.write(t, CardStorage.DISCUSSION_ELAPSED, elapsed + previousElapsed, cardId);
  };

  start = async (t: Trello.PowerUp.CallbackHandler): Promise<void> => {
    await this.boardStorage.writeMultiple(t, {
      [BoardStorage.DISCUSSION_STATUS]: "ONGOING",
      [BoardStorage.DISCUSSION_CARD_ID]: t.getContext().card,
      [BoardStorage.DISCUSSION_STARTED_AT]: Date.now(),
      [BoardStorage.DISCUSSION_PREVIOUS_ELAPSED]: await this.getElapsed(t),
      [BoardStorage.DISCUSSION_INTERVAL_ID]: setInterval(this.updateElapsed, 5000, t),
    });

    await this.cardStorage.write(t, CardStorage.DISCUSSION_STATUS, "ONGOING");
    await this.cardStorage.delete(t, CardStorage.DISCUSSION_THUMBS);
  };

  pause = async (t: Trello.PowerUp.CallbackHandler, notify = false): Promise<void> => {
    const intervalId = await this.boardStorage.read<DiscussionIntervalId>(t, BoardStorage.DISCUSSION_INTERVAL_ID);
    const cardId = await this.boardStorage.read<string>(t, BoardStorage.DISCUSSION_CARD_ID);
    const cardName = (await t.cards("id", "name")).find((card) => card.id === cardId).name;

    clearInterval(intervalId);

    await this.cardStorage.write(t, CardStorage.DISCUSSION_STATUS, "PAUSED");
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

  end = async (t: Trello.PowerUp.CallbackHandler): Promise<void> => {
    const intervalId = await this.boardStorage.read<DiscussionIntervalId>(t, BoardStorage.DISCUSSION_INTERVAL_ID);
    const cardId = await this.boardStorage.read<string>(t, BoardStorage.DISCUSSION_CARD_ID);
    clearInterval(intervalId);

    await this.cardStorage.write(t, CardStorage.DISCUSSION_STATUS, "ENDED", cardId);
    await this.saveElapsed(t);
    await this.cardStorage.delete(t, CardStorage.DISCUSSION_THUMBS, cardId);
    await this.boardStorage.deleteMultiple(t, [
      BoardStorage.DISCUSSION_STATUS,
      BoardStorage.DISCUSSION_CARD_ID,
      BoardStorage.DISCUSSION_STARTED_AT,
      BoardStorage.DISCUSSION_PREVIOUS_ELAPSED,
      BoardStorage.DISCUSSION_INTERVAL_ID,
    ]);
  };

  reset = async (t: Trello.PowerUp.CallbackHandler): Promise<void> => {
    if (await this.hasEverBeenDiscussed(t)) {
      await this.cardStorage.deleteMultiple(
        t,
        [CardStorage.DISCUSSION_STATUS, CardStorage.DISCUSSION_ELAPSED, CardStorage.DISCUSSION_THUMBS],
        t.getContext().card,
      );
    }
  };
}

export default Discussion;
