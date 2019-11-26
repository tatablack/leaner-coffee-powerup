import { Statuses } from '../utils/Discussion';
import ElapsedCardBadge from './ElapsedCardBadge';


class ElapsedCardDetailBadge extends ElapsedCardBadge {
  getTitle = () => 'Discussion time';

  render = async (t) => {
    const discussionStatus = await this.discussion.cardStorage.getDiscussionStatus(t);
    if (discussionStatus !== Statuses.ENDED) { return null; }

    return super.render(t);
  };
}

export default ElapsedCardDetailBadge;
