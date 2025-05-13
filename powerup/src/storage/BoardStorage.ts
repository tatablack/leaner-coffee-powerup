import Storage from "./Storage";
import { Trello } from "../types/TrelloPowerUp";

class BoardStorage extends Storage {
  static DISCUSSION_STATUS = "leancoffeeDiscussionStatus";
  static DISCUSSION_CARD_ID = "leancoffeeDiscussionCardId";
  static DISCUSSION_STARTED_AT = "leancoffeeDiscussionStartedAt";
  static DISCUSSION_PREVIOUS_ELAPSED = "leancoffeeDiscussionPreviousElapsed";
  static DISCUSSION_INTERVAL_ID = "leancoffeeDiscussionIntervalId";
  static POWER_UP_INSTALLATION_DATE = "powerUpInstallationDate";
  static ORGANISATION_HASH = "organisationHash";
  static BOARD_HASH = "boardHash";

  constructor() {
    super("board", "shared");
  }

  async getDiscussionStatus(
    t: Trello.PowerUp.AnonymousHostHandlers,
  ): Promise<DiscussionStatus> {
    return super.read(t, BoardStorage.DISCUSSION_STATUS);
  }

  async getDiscussionCardId(
    t: Trello.PowerUp.AnonymousHostHandlers,
  ): Promise<string> {
    return super.read(t, BoardStorage.DISCUSSION_CARD_ID);
  }

  async getDiscussionStartedAt(
    t: Trello.PowerUp.AnonymousHostHandlers,
  ): Promise<DiscussionStartedAt> {
    return super.read(t, BoardStorage.DISCUSSION_STARTED_AT);
  }

  async getDiscussionPreviousElapsed(
    t: Trello.PowerUp.AnonymousHostHandlers,
  ): Promise<DiscussionPreviousElapsed> {
    return super.read(t, BoardStorage.DISCUSSION_PREVIOUS_ELAPSED);
  }

  async getDiscussionIntervalId(
    t: Trello.PowerUp.AnonymousHostHandlers,
  ): Promise<DiscussionIntervalId> {
    return super.read(t, BoardStorage.DISCUSSION_INTERVAL_ID);
  }

  async getPowerUpInstallationDate(
    t: Trello.PowerUp.AnonymousHostHandlers,
  ): Promise<string> {
    return super.read(t, BoardStorage.POWER_UP_INSTALLATION_DATE);
  }

  async getOrganisationIdHash(
    t: Trello.PowerUp.AnonymousHostHandlers,
  ): Promise<string> {
    return super.read(t, BoardStorage.ORGANISATION_HASH);
  }

  async setOrganisationIdHash(
    t: Trello.PowerUp.AnonymousHostHandlers,
    value: string,
  ): Promise<void> {
    return super.write(t, BoardStorage.ORGANISATION_HASH, value);
  }

  async getBoardIdHash(
    t: Trello.PowerUp.AnonymousHostHandlers,
  ): Promise<string> {
    return super.read(t, BoardStorage.BOARD_HASH);
  }

  async setBoardIdHash(
    t: Trello.PowerUp.AnonymousHostHandlers,
    value: string,
  ): Promise<void> {
    return super.write(t, BoardStorage.BOARD_HASH, value);
  }

  async getInitialised(
    t: Trello.PowerUp.AnonymousHostHandlers,
  ): Promise<boolean> {
    const installationDate = await super.read(
      t,
      BoardStorage.POWER_UP_INSTALLATION_DATE,
    );
    return !!installationDate;
  }

  setPowerUpInstallationDate(
    t: Trello.PowerUp.AnonymousHostHandlers,
    installationDate: string,
  ): PromiseLike<void> {
    return super.write(
      t,
      BoardStorage.POWER_UP_INSTALLATION_DATE,
      installationDate,
    );
  }
}

export default BoardStorage;
