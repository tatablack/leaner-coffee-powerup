import Storage from "./Storage";

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
}

export default BoardStorage;
