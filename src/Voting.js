import CardStorage from './storage/CardStorage';

class Voting {
  constructor(trello) {
    this.cardStorage = new CardStorage();
    this.promise = trello.Promise;
  }

  hasCurrentMemberVoted = async (t) => {
    const votes = await this.cardStorage.read(t, CardStorage.VOTES);

    if (!votes) { return false; }

    const currentMember = t.getContext().member;
    return !!votes[currentMember];
  };

  getVotes = async t => this.cardStorage.read(t, CardStorage.VOTES);

  countVotesByCard = async (t, cardId) => {
    const votes = await this.cardStorage.readById(t, CardStorage.VOTES, cardId);

    if (!votes) { return 0; }

    return Object.keys(votes).filter(key => votes[key]).length;
  };
}

export default Voting;
