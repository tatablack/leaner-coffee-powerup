import Trello from '../@types/TrelloPowerUp';
import ElapsedCardBadge from './ElapsedCardBadge';

class ElapsedCardDetailBadge extends ElapsedCardBadge {
  render = async (t): Trello.Promise<Trello.CardDetailBadge> => {
    const discussionStatus: DiscussionStatus = await this.discussion.cardStorage.getDiscussionStatus(t);
    if (discussionStatus !== 'ENDED') { return null; }

    const badge = await super.render(t) as CardDetailBadge;
    badge.title = 'Discussion time';
    return badge;
  };
}

export default ElapsedCardDetailBadge;
