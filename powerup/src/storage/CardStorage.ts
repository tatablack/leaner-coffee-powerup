import Storage from "./Storage";

class CardStorage extends Storage {
  static DISCUSSION_STATUS = "leancoffeeDiscussionStatus";
  static DISCUSSION_ELAPSED = "leancoffeeDiscussionElapsed";
  static DISCUSSION_THUMBS = "leancoffeeDiscussionThumbs";
  static VOTES = "leancoffeeVotes";
  static DISCUSSION_BUTTON_LABEL = "discussionButtonLabel";

  constructor() {
    super("card", "shared");
  }
}

export default CardStorage;
