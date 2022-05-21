import { Trello } from '../types/TrelloPowerUp';
import Voting from '../utils/Voting';

class OwnVotesCardDetailBadge {
  voting: Voting;

  constructor(voting: Voting) {
    this.voting = voting;
  }

  getOwnVotes = async (t: Trello.PowerUp.IFrame): Promise<number> => {
    // const votes: Votes = await this.voting.getVotes(t) || {};
    // const currentMember = t.getContext().member;

    // return votes[currentMember] ? votes[currentMember].count || 1 : 0;
    return 0
  };

  getColor = async (t: Trello.PowerUp.IFrame): Promise<Trello.PowerUp.Colors | null> => {
    const ownVotes = await this.getOwnVotes(t);
    switch (ownVotes) {
      case 1:
        return 'blue';
      case 2:
        return 'sky';
      default:
        return 'purple';
    }
  };

  getText = async (t: Trello.PowerUp.IFrame): Promise<string> => {
    const ownVotes = await this.getOwnVotes(t);
    if (!ownVotes) { return null; }
    return ownVotes.toString();
  };

  render = async (t: Trello.PowerUp.IFrame): Promise<Trello.PowerUp.CardDetailBadge> => {
    const text = await this.getText(t);
    if (!text) { return null; }

    return {
      text,
      color: await this.getColor(t),
      title: t.localizeKey('ownVotes')
    };
  };
}

export default OwnVotesCardDetailBadge;
