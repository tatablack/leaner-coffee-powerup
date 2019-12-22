import { Trello } from '../types/TrelloPowerUp';
import VotingCardBadge from './VotingCardBadge';

class VotingCardDetailBadge extends VotingCardBadge {
  showVoters = async (t: Trello.PowerUp.IFrame): Promise<void> => {
    const items = await this.getVoters(t);

    if (!items.length) { return; }

    t.popup({
      title: t.localizeKey('voters'),
      items
    });
  };

  render = async (t: Trello.PowerUp.IFrame): Promise<Trello.PowerUp.CardDetailBadge> => {
    const commonData = await super.render(t) as Trello.PowerUp.CardDetailBadge;

    if (commonData) {
      commonData.title = t.localizeKey('voters');
      delete commonData.icon;
      commonData.callback = this.showVoters;
    }

    return commonData;
  };
}

export default VotingCardDetailBadge;
