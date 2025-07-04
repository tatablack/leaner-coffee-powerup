import BoardStorage from "../storage/BoardStorage";
import CardStorage from "../storage/CardStorage";
import { ErrorReporterInjector } from "../utils/Errors";
import { bindAll } from "../utils/Scope";
import Voting from "../utils/Voting";

@ErrorReporterInjector
class VotingCardBadge {
  w: Window;
  baseUrl: string;
  voting: Voting;
  boardStorage: BoardStorage;
  cardStorage: CardStorage;

  constructor(w: Window, baseUrl: string, voting: Voting, boardStorage: BoardStorage, cardStorage: CardStorage) {
    this.w = w;
    this.baseUrl = baseUrl;
    this.voting = voting;
    this.boardStorage = boardStorage;
    this.cardStorage = cardStorage;
    this.render = this.render.bind(this);
    bindAll(this);
  }

  getVoters = async (t: Trello.PowerUp.CallbackHandler): Promise<{ text: string }[]> => {
    const votes: Votes = (await this.voting.getVotes(t)) || {};

    return Object.values(votes).reduce((knownVoters: { text: string; avatar: string }[], vote) => {
      if (vote.username) {
        knownVoters.push({
          text: `${vote.fullName} (${vote.username})`,
          avatar: vote.avatar,
        });
      }

      return knownVoters;
    }, []);
  };

  // Unable to use class properties here because in subclasses
  // I need to user `super`, and it wouldn't be possible. See:
  // https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Operators/super#accessing_super_in_class_field_declaration
  async render(t: Trello.PowerUp.CallbackHandler): Promise<Trello.PowerUp.CardBadge> {
    const voters = await this.getVoters(t);

    if (!voters.length) {
      return null;
    }

    const hasVoted = await this.voting.hasCurrentMemberVoted(t);

    return {
      text: voters.length.toString(),
      color: hasVoted ? "blue" : null,
      icon: `${this.baseUrl}/assets/powerup/${hasVoted ? "heart_white.svg" : "heart.svg"}`,
    };
  }
}

export default VotingCardBadge;
