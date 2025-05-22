import { ErrorReporterInjector } from "./Errors";
import { bindAll } from "./Scope";
import CardStorage from "../storage/CardStorage";
import { Trello } from "../types/TrelloPowerUp";

@ErrorReporterInjector
class Voting {
  cardStorage: CardStorage;

  constructor() {
    this.cardStorage = new CardStorage();
    bindAll(this);
  }

  async hasCurrentMemberVoted(t: Trello.PowerUp.IFrame): Promise<boolean> {
    const votes = await this.cardStorage.read<Votes>(t, CardStorage.VOTES);
    if (!votes) {
      return false;
    }

    const currentMember = t.getContext().member;
    return !!votes[currentMember];
  }

  async getVotes(t: Trello.PowerUp.IFrame): Promise<Votes> {
    return await this.cardStorage.read<Votes>(t, CardStorage.VOTES);
  }

  async countVotesByCard(t: Trello.PowerUp.IFrame, cardId: string): Promise<number> {
    const votes = await this.cardStorage.read<Votes>(t, CardStorage.VOTES, cardId);

    if (!votes) {
      return 0;
    }

    return Object.keys(votes).filter((key) => votes[key]).length;
  }

  async getMaxVotes(t: Trello.PowerUp.IFrame): Promise<number> {
    const currentList = await t.list("cards");

    // https://www.talcottridge.com/multi-voting-math-or-n3
    return Math.ceil(currentList.cards.length / 3);
  }

  async canCurrentMemberVote(t: Trello.PowerUp.IFrame): Promise<boolean> {
    if (await this.hasCurrentMemberVoted(t)) {
      return true;
    }

    const currentList = await t.list("cards");
    const cardIds = currentList.cards.map((card) => card.id);
    const currentMemberVotes = await this.countVotesByMember(t, cardIds);
    const maxVotes = await this.getMaxVotes(t);

    return currentMemberVotes < maxVotes;
  }

  async countVotesByMember(t: Trello.PowerUp.IFrame, cardIds: string[]): Promise<number> {
    const listVotes: number[] = await Promise.all(
      cardIds.map(async (cardId): Promise<number> => {
        const votes = await this.cardStorage.read<Votes>(t, CardStorage.VOTES, cardId);
        if (!votes) {
          return 0;
        }

        const currentMember = t.getContext().member;
        return votes[currentMember] ? 1 : 0;
      }),
    );

    return listVotes.reduce((total, vote): number => total + vote, 0);
  }
}

export default Voting;
