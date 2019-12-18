import { Trello } from './types/TrelloPowerUp';
import BoardStorage from './storage/BoardStorage';
import ElapsedCardBadge from './badges/ElapsedCardBadge';
import ElapsedCardDetailBadge from './badges/ElapsedCardDetailBadge';
import VotingCardBadge from './badges/VotingCardBadge';
import VotingCardDetailBadge from './badges/VotingCardDetailBadge';
import Discussion from './utils/Discussion';
import Voting from './utils/Voting';
import UpdateChecker from './utils/UpdateChecker';
import { LeanCoffeeBase, LeanCoffeeBaseParams } from './LeanCoffeeBase';
import { CapabilityHandlers } from './CapabilityHandlers';
import { I18nConfig } from './utils/I18nConfig';

interface LeanCoffeePowerUpParams extends LeanCoffeeBaseParams {
  maxDiscussionDuration: number;
}

class LeanCoffeePowerUp extends LeanCoffeeBase {
  t: Trello.PowerUp;
  baseUrl: string;
  discussion: Discussion;
  voting: Voting;
  elapsedCardBadge: ElapsedCardBadge;
  elapsedCardDetailBadge: ElapsedCardDetailBadge;
  votingCardBadge: VotingCardBadge;
  votingCardDetailBadge: VotingCardDetailBadge;
  updateChecker: UpdateChecker;

  constructor({
    w, config, maxDiscussionDuration
  }: LeanCoffeePowerUpParams) {
    super({ w, config });
    this.t = w.TrelloPowerUp;

    const { hostname, port } = this.config[process.env.NODE_ENV as Environment];
    this.baseUrl = `${hostname}${port ? `:${port}` : ''}`;

    this.discussion = new Discussion(this.w, this.baseUrl, maxDiscussionDuration);
    this.voting = new Voting();
    this.updateChecker = new UpdateChecker(this.boardStorage);

    this.elapsedCardBadge = new ElapsedCardBadge(this.discussion);
    this.elapsedCardDetailBadge = new ElapsedCardDetailBadge(this.discussion);
    this.votingCardBadge = new VotingCardBadge(this.baseUrl, this.voting);
    this.votingCardDetailBadge = new VotingCardDetailBadge(this.baseUrl, this.voting);
  }

  handleVoting = async (t: Trello.PowerUp.IFrame): Promise<void> => {
    if (!await this.voting.canCurrentMemberVote(t)) {
      return t.popup({
        title: 'Leaner Coffee',
        url: `${this.baseUrl}/too_many_votes.html`,
        args: {
          maxVotes: await this.voting.getMaxVotes(t)
        },
        height: 98
      });
    }

    const votes = await this.voting.getVotes(t) || {};
    const currentMember = await t.member('id', 'username', 'fullName', 'avatar');

    if (votes[currentMember.id]) {
      delete votes[currentMember.id];
    } else {
      votes[currentMember.id] = {
        username: currentMember.username,
        fullName: currentMember.fullName,
        avatar: currentMember.avatar // currently unused
      };
    }

    return this.cardStorage.saveVotes(t, votes);
  };

  handleDiscussion = async (t: Trello.PowerUp.IFrame): Promise<void> => {
    if (await this.discussion.isOngoingOrPausedForAnotherCard(t)) {
      const boardStatus = await this.boardStorage.getDiscussionStatus(t);
      const cardId = await this.boardStorage.getDiscussionCardId(t);

      if (await this.discussion.hasNotBeenArchived(t, cardId)) {
        const allCards = await t.cards('id', 'name');
        const cardBeingDiscussed = allCards.find((card) => card.id === cardId);

        t.popup({
          title: 'Leaner Coffee',
          url: `${this.baseUrl}/ongoing_or_paused.html`,
          args: {
            currentCardBeingDiscussed: cardBeingDiscussed.name,
            currentDiscussionStatus: boardStatus
          },
          height: 120
        });

        return;
      }

      // eslint-disable-next-line no-console
      console.warn(`Card with id ${cardId} not found in current board, most likely archived. Cleaning up.`);

      await this.boardStorage.deleteMultiple(t, [
        BoardStorage.DISCUSSION_STATUS,
        BoardStorage.DISCUSSION_CARD_ID,
        BoardStorage.DISCUSSION_STARTED_AT,
        BoardStorage.DISCUSSION_PREVIOUS_ELAPSED,
        BoardStorage.DISCUSSION_INTERVAL_ID
      ]);
    }

    let items;

    switch (true) {
      case await this.discussion.isOngoingFor(t):
        items = [{
          // eslint-disable-next-line no-irregular-whitespace
          text: t.localizeKey('pauseTimer', { symbol: '❙ ❙' }), // MEDIUM VERTICAL BAR + NARROW NO-BREAK SPACE
          callback: async (t2: Trello.PowerUp.IFrame): Promise<void> => {
            await this.discussion.pause(t2);
            await t2.closePopup();
            await this.discussion.cardStorage.saveDiscussionButtonLabel(
              t2,
              t2.localizeKey('pausingTimer', { symbol: '❙ ❙' }) // MEDIUM VERTICAL BAR + NARROW NO-BREAK SPACE
            );
          }
        }, {
          text: t.localizeKey('endDiscussion', { symbol: '■' }), // BLACK SQUARE
          callback: async (t2: Trello.PowerUp.IFrame): Promise<void> => {
            await this.discussion.end(t2);
            await t2.closePopup();
            await this.discussion.cardStorage.saveDiscussionButtonLabel(
              t2,
              t2.localizeKey('endingDiscussion', { symbol: '■' }) // BLACK SQUARE
            );
          }
        }];
        break;
      case await this.discussion.isPausedFor(t):
        items = [{
          text: t.localizeKey('resumeDiscussion', { symbol: '▶' }), // BLACK RIGHT-POINTING TRIANGLE
          callback: async (t2: Trello.PowerUp.IFrame): Promise<void> => {
            await this.discussion.start(t2);
            await t2.closePopup();
            await this.discussion.cardStorage.saveDiscussionButtonLabel(
              t2,
              t2.localizeKey('resumingDiscussion', { symbol: '▶' }) // BLACK RIGHT-POINTING TRIANGLE
            );
          }
        }, {
          text: t.localizeKey('endDiscussion', { symbol: '■' }), // BLACK SQUARE
          callback: async (t2: Trello.PowerUp.IFrame): Promise<void> => {
            await this.discussion.end(t2);
            await t2.closePopup();
            await this.discussion.cardStorage.saveDiscussionButtonLabel(
              t2,
              t2.localizeKey('endingDiscussion', { symbol: '■' }) // BLACK SQUARE
            );
          }
        }];
        break;
      default:
        items = [{
          text: t.localizeKey('startTimer', { symbol: '▶' }), // BLACK RIGHT-POINTING TRIANGLE
          callback: async (t2: Trello.PowerUp.IFrame): Promise<void> => {
            await this.discussion.start(t2);
            await t2.closePopup();
            await this.discussion.cardStorage.saveDiscussionButtonLabel(
              t2,
              t2.localizeKey('startingTimer', { symbol: '▶' }) // BLACK RIGHT-POINTING TRIANGLE
            );
          }
        }];
    }

    await t.popup({
      title: 'Leaner Coffee',
      items
    });
  };

  getButtonLabel = async (t: Trello.PowerUp.IFrame): Promise<string> => {
    let label = await this.discussion.cardStorage.getDiscussionButtonLabel(t);

    if (label) {
      setTimeout(() => {
        this.discussion.cardStorage.saveDiscussionButtonLabel(t);
      }, 2000);
    }

    label = label || t.localizeKey('discussion');

    return label;
  };

  start(): void {
    const trelloPlugin = this.t.initialize(
      CapabilityHandlers(this), {
        localization: I18nConfig
      }
    ) as Trello.PowerUp.Plugin;

    this.discussion.init(trelloPlugin);
  }
}

export default LeanCoffeePowerUp;
