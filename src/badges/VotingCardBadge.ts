import Bluebird from 'bluebird';
import Voting from '../utils/Voting';
import { CardBadge } from '../utils/TrelloConstants';

class VotingCardBadge {
  baseUrl: string;
  voting: Voting;

  constructor(baseUrl, voting) {
    this.baseUrl = baseUrl;
    this.voting = voting;
    this.render = this.render.bind(this);
  }

  getVoters = async (t) => {
    const votes = await this.voting.getVotes(t) || {};

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
  async render(t): Bluebird<CardBadge> {
    const voters = await this.getVoters(t);
    if (!voters.length) { return null; }

    const hasVoted = await this.voting.hasCurrentMemberVoted(t);

    return {
      text: voters.length.toString(),
      color: hasVoted ? 'blue' : null,
      icon: `${this.baseUrl}/assets/powerup/${hasVoted ? 'heart_white.svg' : 'heart.svg'}`,
    };
  }
}

export default VotingCardBadge;
