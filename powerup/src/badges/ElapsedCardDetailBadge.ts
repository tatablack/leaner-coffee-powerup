import ElapsedCardBadge from "./ElapsedCardBadge";
import CardStorage from "../storage/CardStorage";
import { Trello } from "../types/TrelloPowerUp";

class ElapsedCardDetailBadge extends ElapsedCardBadge {
  render = async (
    t: Trello.PowerUp.IFrame,
  ): Promise<Trello.PowerUp.CardDetailBadge> => {
    const discussionStatus =
      await this.discussion.cardStorage.read<DiscussionStatus>(
        t,
        CardStorage.DISCUSSION_STATUS,
      );
    if (discussionStatus !== "ENDED") {
      return null;
    }

    const badge = (await super.render(t)) as Trello.PowerUp.CardDetailBadge;
    badge.title = t.localizeKey("discussionDurationTitle");
    return badge;
  };
}

export default ElapsedCardDetailBadge;
