import ElapsedCardBadge from "./ElapsedCardBadge";
import CardStorage from "../storage/CardStorage";
import Storage from "../storage/Storage";

class ElapsedCardDetailBadge extends ElapsedCardBadge {
  render = async (t: Trello.PowerUp.CallbackHandler): Promise<Trello.PowerUp.CardDetailBadge> => {
    const discussionStatus = await this.discussion.cardStorage.read<DiscussionStatus>(t, CardStorage.DISCUSSION_STATUS);
    if (discussionStatus !== "ENDED") {
      return null;
    }

    const badge = (await super.render(t)) as Trello.PowerUp.CardDetailBadge;

    if (badge === null) {
      window.Sentry.captureMessage("Inconsistent data", {
        contexts: {
          CardDetailBadge: {
            discussionStatus,
            discussionElapsed: await this.discussion.cardStorage.read<number>(t, CardStorage.DISCUSSION_ELAPSED),
            discussionButtonLabel: await this.discussion.cardStorage.read<string>(
              t,
              CardStorage.DISCUSSION_BUTTON_LABEL,
            ),
            memberType: await Storage.getMemberType(t),
          },
        },
      });

      return null;
    }

    badge.title = t.localizeKey("discussionDurationTitle");
    return badge;
  };
}

export default ElapsedCardDetailBadge;
