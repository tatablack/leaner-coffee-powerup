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
    w, config
  }: LeanCoffeeBaseParams) {
    super({ w, config });
    this.t = w.TrelloPowerUp;

    const { hostname, port, defaultDuration } = this.config[process.env.NODE_ENV as Environment];
    this.baseUrl = `${hostname}${port ? `:${port}` : ''}`;

    this.discussion = new Discussion(this.w, this.baseUrl, defaultDuration);
    this.voting = new Voting();
    this.updateChecker = new UpdateChecker(this.boardStorage);

    this.elapsedCardBadge = new ElapsedCardBadge(this.discussion);
    this.elapsedCardDetailBadge = new ElapsedCardDetailBadge(this.discussion);
    this.votingCardBadge = new VotingCardBadge(this.baseUrl, this.voting, this.cardStorage);
    this.votingCardDetailBadge = new VotingCardDetailBadge(this.baseUrl, this.voting, this.cardStorage);
  }

  handleVoting = async (t: Trello.PowerUp.IFrame): Promise<void> => {
    if (!await this.voting.canCurrentMemberVote(t)) {
      return t.popup({
        title: 'Leaner Coffee',
        url: `${this.baseUrl}/too_many_votes.html`,
        args: {
          maxVotes: await this.voting.getMaxVotes(t),
          localization: I18nConfig
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

  stopAndStart = async (t: Trello.PowerUp.IFrame): Promise<void> => {
    await this.discussion.end(t);
    await this.discussion.start(t);
  };

  handleDiscussion = async (t: Trello.PowerUp.IFrame): Promise<void> => {
    if (await this.discussion.isOngoingOrPausedForAnotherCard(t)) {
      const boardStatus = await this.boardStorage.getDiscussionStatus(t);
      const cardId = await this.boardStorage.getDiscussionCardId(t);

      // https://github.com/tatablack/leaner-coffee-powerup/issues/12
      if (await this.discussion.hasNotBeenArchived(t, cardId)) {
        const allCards = await t.cards('id', 'name');
        const cardBeingDiscussed = allCards.find((card) => card.id === cardId);

        return t.popup({
          callback: this.stopAndStart,
          title: 'Leaner Coffee',
          url: `${this.baseUrl}/ongoing_or_paused.html`,
          args: {
            currentCardBeingDiscussed: cardBeingDiscussed.name,
            currentDiscussionStatus: boardStatus,
            localization: I18nConfig,
          },
          height: 120
        });
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

        if (await this.discussion.hasEverBeenDiscussed(t)) {
          items.push({
            text: t.localizeKey('resetDiscussion', { symbol: '↺' }), // ANTICLOCKWISE OPEN CIRCLE ARROW
            callback: async (t2: Trello.PowerUp.IFrame): Promise<void> => {
              await this.discussion.reset(t2);
              await t2.closePopup();
              await this.discussion.cardStorage.saveDiscussionButtonLabel(
                t2,
                t2.localizeKey('resettingDiscussion', { symbol: '↺' }) // ANTICLOCKWISE OPEN CIRCLE ARROW
              );
            }
          });
        }
    }

    return t.popup({
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
    const trelloPlugin = this.t.initialize(CapabilityHandlers(this), {
      localization: I18nConfig,
      helpfulStacks: !this.isRunningInProduction()
    }) as Trello.PowerUp.Plugin;

    this.discussion.init(trelloPlugin);
  }
}

export default LeanCoffeePowerUp;
