import Trello from '../@types/TrelloPowerUp';
import VotingCardBadge from './VotingCardBadge';

class VotingCardDetailBadge extends VotingCardBadge {
  showVoters = async (t): Trello.Promise<void> => {
    const items = await this.getVoters(t);

    if (!items.length) { return; }

    t.popup({
      title: 'Voters',
      items
    });
  };

    const commonData = await super.render(t) as CardDetailBadge;
  render = async (t): Trello.Promise<Trello.CardDetailBadge> => {

    if (commonData) {
      commonData.title = 'Voters';
      delete commonData.icon;
      commonData.callback = this.showVoters;
    }

    return commonData;
  };
}

export default VotingCardDetailBadge;
