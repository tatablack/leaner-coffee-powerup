import Bluebird from 'bluebird';
import VotingCardBadge from './VotingCardBadge';
import { CardDetailBadge } from '../utils/TrelloConstants';

class VotingCardDetailBadge extends VotingCardBadge {
  showVoters = async (t) => {
    const items = await this.getVoters(t);

    if (!items.length) { return; }

    t.popup({
      title: 'Voters',
      items
    });
  };

  render = async (t): Bluebird<CardDetailBadge> => {
    const commonData = await super.render(t) as CardDetailBadge;

    if (commonData) {
      commonData.title = 'Voters';
      delete commonData.icon;
      commonData.callback = this.showVoters;
    }

    return commonData;
  };
}

export default VotingCardDetailBadge;
