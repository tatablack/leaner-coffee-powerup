import CardStorage from '../storage/CardStorage';

class VotingCardBadge {
  constructor(hostname) {
    this.hostname = hostname;
    this.cardStorage = new CardStorage();
  }

    render = async (t) => {
      let votes = await this.cardStorage.getVotes(t) || {};
      votes = Object.keys(votes).filter(key => votes[key]);

      if (!votes.length) { return null; }

      const hasVoted = await this.cardStorage.getVoteFor(t);

      return {
        text: votes.length,
        color: hasVoted ? 'blue' : null,
        icon: `${this.hostname}/assets/${hasVoted ? 'heart_white.svg' : 'heart.svg'}`,
      };
    };
}

export default VotingCardBadge;
