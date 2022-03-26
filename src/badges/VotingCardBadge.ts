import { Trello } from '../types/TrelloPowerUp';
import Voting from '../utils/Voting';
import CardStorage from '../storage/CardStorage';

class VotingCardBadge {
  baseUrl: string;
  voting: Voting;
  storage: CardStorage;

  constructor(baseUrl: string, voting: Voting, storage: CardStorage) {
    this.baseUrl = baseUrl;
    this.voting = voting;
    this.storage = storage;
    this.render = this.render.bind(this);
  }

  getVoters = async (t: Trello.PowerUp.IFrame): Promise<{ text: string }[]> => {
    const votes: Votes = await this.voting.getVotes(t) || {};

    return Object.values(votes).reduce((knownVoters: { text: string, avatar: string }[], vote) => {
      if (vote.username) {
        knownVoters.push({ text: `${vote.fullName} (${vote.username})`, avatar: vote.avatar });
      }

      return knownVoters;
    }, []);
  };

  // Unable to use class properties here because I need to call
  // it from a subclass, and it's currently broken - see:
  // https://github.com/babel/babel/issues/5104
  //
  // Upgrading to Babel 7.x should solve it.
  async render(t: Trello.PowerUp.IFrame): Promise<Trello.PowerUp.CardBadge> {
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
