import CardStorage from '../storage/CardStorage';
import Trello from '../@types/TrelloPowerUp';

class Voting {
  cardStorage: CardStorage;
  promise: Trello.Promise<any>;

  constructor(trello) {
    this.cardStorage = new CardStorage();
    this.promise = trello.Promise;
  }

  hasCurrentMemberVoted = async (t): Trello.Promise<boolean> => {
    const votes = await this.cardStorage.read(t, CardStorage.VOTES);
    if (!votes) { return false; }

    const currentMember = t.getContext().member;
    return !!votes[currentMember];
  };

  getVotes = async (t): Trello.Promise<Votes> => this.cardStorage.read(t, CardStorage.VOTES);

  countVotesByCard = async (t, cardId): Trello.Promise<number> => {
    const votes = await this.cardStorage.readById(t, CardStorage.VOTES, cardId);

    if (!votes) { return 0; }

    return Object.keys(votes).filter((key) => votes[key]).length;
  };

  getMaxVotes = async (t): Trello.Promise<number> => {
    const currentList = await t.list('cards');

    // http://www.leanmath.com/blog-entry/multi-voting-math-or-n3
    return Math.ceil(currentList.cards.length / 3);
  };

  canCurrentMemberVote = async (t): Trello.Promise<boolean> => {
    if (await this.hasCurrentMemberVoted(t)) { return true; }

    const currentList = await t.list('cards');
    const cardIds = currentList.cards.map((card) => card.id);
    const currentMemberVotes = await this.countVotesByMember(t, cardIds);
    const maxVotes = await this.getMaxVotes(t);

    return currentMemberVotes < maxVotes;
  };

  countVotesByMember = async (t, cardIds): Trello.Promise<number> => {
    const listVotes: number[] = await this.promise.all(cardIds.map(async (cardId): Trello.Promise<number> => {
      const votes = await this.cardStorage.readById(t, CardStorage.VOTES, cardId);
      if (!votes) { return 0; }

      const currentMember = t.getContext().member;
      return votes[currentMember] ? 1 : 0;
    }));

    return listVotes.reduce((total, vote): number => total + vote, 0);
  };
}

export default Voting;
