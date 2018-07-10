import CardStorage from '../storage/CardStorage';

class VotingCardBadge {
  constructor(baseUrl) {
    this.baseUrl = baseUrl;
    this.cardStorage = new CardStorage();
    this.render = this.render.bind(this);
  }

  getVoters = async (t) => {
    const votes = await this.cardStorage.getVotes(t) || {};

    return Object.values(votes).reduce((knownVoters, vote) => {
      if (vote.username) {
        knownVoters.push({ text: `${vote.username} (${vote.fullName})` });
      }

      return knownVoters;
    }, []);
  };

  // Unable to use class properties here because I need to call
  // it from a subclass, and it's currently broken - see:
  // https://github.com/babel/babel/issues/5104
  //
  // Upgrading to Babel 7.x should solve it.
  async render(t) {
    const voters = await this.getVoters(t);
    if (!voters.length) { return null; }

    const hasVoted = await this.cardStorage.hasCurrentMemberVoted(t);

    return {
      text: voters.length,
      color: hasVoted ? 'blue' : null,
      icon: `${this.baseUrl}/assets/powerup/${hasVoted ? 'heart_white.svg' : 'heart.svg'}`,
    };
  }
}

export default VotingCardBadge;
