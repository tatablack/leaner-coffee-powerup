import Storage from "./Storage";
import { Trello } from "../types/TrelloPowerUp";

class BoardStorage extends Storage {
  static DISCUSSION_STATUS = "leancoffeeDiscussionStatus";
  static DISCUSSION_CARD_ID = "leancoffeeDiscussionCardId";
  static DISCUSSION_STARTED_AT = "leancoffeeDiscussionStartedAt";
  static DISCUSSION_PREVIOUS_ELAPSED = "leancoffeeDiscussionPreviousElapsed";
  static DISCUSSION_INTERVAL_ID = "leancoffeeDiscussionIntervalId";
  static POWER_UP_VERSION = "powerUpVersion";

  constructor() {
    super("board", "shared");
  }

  async getDiscussionStatus(
    t: Trello.PowerUp.IFrame,
  ): Promise<DiscussionStatus> {
    return super.read(t, BoardStorage.DISCUSSION_STATUS);
  }

  async getDiscussionCardId(t: Trello.PowerUp.IFrame): Promise<string> {
    return super.read(t, BoardStorage.DISCUSSION_CARD_ID);
  }

  async getDiscussionStartedAt(
    t: Trello.PowerUp.IFrame,
  ): Promise<DiscussionStartedAt> {
    return super.read(t, BoardStorage.DISCUSSION_STARTED_AT);
  }

  async getDiscussionPreviousElapsed(
    t: Trello.PowerUp.IFrame,
  ): Promise<DiscussionPreviousElapsed> {
    return super.read(t, BoardStorage.DISCUSSION_PREVIOUS_ELAPSED);
  }

  async getDiscussionIntervalId(
    t: Trello.PowerUp.IFrame,
  ): Promise<DiscussionIntervalId> {
    return super.read(t, BoardStorage.DISCUSSION_INTERVAL_ID);
  }

  async getPowerUpVersion(t: Trello.PowerUp.IFrame): Promise<string> {
    return super.read(t, BoardStorage.POWER_UP_VERSION);
  }

  setPowerUpVersion(
    t: Trello.PowerUp.IFrame,
    version: string,
  ): PromiseLike<void> {
    return super.write(t, BoardStorage.POWER_UP_VERSION, version);
  }
}

export default BoardStorage;
