import { Trello } from '../types/TrelloPowerUp';
import ElapsedCardBadge from './ElapsedCardBadge';

class ElapsedCardDetailBadge extends ElapsedCardBadge {
  render = async (t: Trello.PowerUp.IFrame): Promise<Trello.PowerUp.CardDetailBadge> => {
    const discussionStatus: DiscussionStatus = await this.discussion.cardStorage.getDiscussionStatus(t);
    if (discussionStatus !== 'ENDED') { return null; }

    const badge = await super.render(t) as Trello.PowerUp.CardDetailBadge;
    badge.title = t.localizeKey('discussionDurationTitle');
    return badge;
  };
}

export default ElapsedCardDetailBadge;
