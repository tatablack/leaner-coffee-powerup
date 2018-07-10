import VotingCardBadge from './VotingCardBadge';

class VotingCardDetailBadge extends VotingCardBadge {
  showVoters = async (t) => {
    const votes = await this.cardStorage.getVotes(t);
    const items = Object.values(votes).map(vote => ({ text: `${vote.username} (${vote.fullName})` }));

    t.popup({
      title: 'Voters',
      items
    });
  };

  render = async (t) => {
    const commonData = await super.render(t);

    if (commonData) {
      commonData.title = 'Voters';
      delete commonData.icon;
      commonData.callback = this.showVoters;
    }

    return commonData;
  };
}

export default VotingCardDetailBadge;
