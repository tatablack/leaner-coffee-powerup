import { VisibilityConditions } from './TrelloConstants';
import CardStorage from './storage/CardStorage';
import ElapsedCardBadge from './badges/ElapsedCardBadge';
import ElapsedCardDetailBadge from './badges/ElapsedCardDetailBadge';
import VotingCardBadge from './badges/VotingCardBadge';
import ThumbsCardDetailBadge from './badges/ThumbsCardDetailBadge';
import Discussion, { Thumbs } from './Discussion';


class LeanCoffeePowerUp {
  constructor({ TrelloPowerUp, baseUrl, maxDiscussionDuration }) {
    this.trello = TrelloPowerUp;
    this.baseUrl = baseUrl;

    this.cardStorage = new CardStorage();

    this.elapsedCardBadge = new ElapsedCardBadge();
    this.elapsedCardDetailBadge = new ElapsedCardDetailBadge();
    this.votingCardBadge = new VotingCardBadge(this.baseUrl);
    this.thumbsCardDetailBadge = new ThumbsCardDetailBadge();

    this.discussion = new Discussion(maxDiscussionDuration);
  }

  start() {
    this.trello.initialize({
      'card-buttons': async t => [{
        icon: `${this.baseUrl}/assets/powerup/timer.svg`,
        text: 'Discussion',
        condition: VisibilityConditions.IS_ADMIN,
        callback: this.handleDiscussion
      }, {
        icon: `${this.baseUrl}/assets/powerup/heart.svg`,
        text: `Vote    ${await this.cardStorage.getVoteFor(t) ? '☑' : '☐'}`,
        callback: this.handleVoting
      }],

      'card-badges': async (t) => {
        const badges = [
          await this.elapsedCardBadge.render(t),
          await this.votingCardBadge.render(t)
        ];

        return badges.filter(badge => badge);
      },

      'card-detail-badges': async (t) => {
        const badges = [
          await this.elapsedCardDetailBadge.render(t),
          await this.thumbsCardDetailBadge.render(t, Thumbs.UP),
          await this.thumbsCardDetailBadge.render(t, Thumbs.MIDDLE),
          await this.thumbsCardDetailBadge.render(t, Thumbs.DOWN)
        ];

        return badges.filter(badge => badge);
      },

      'list-sorters': () => [{
        text: 'Most Votes',
        callback: async (t, opts) => {
          const countedCards = await Promise.all(opts.cards.map(async (card) => {
            const leanCoffeeVotes = await this.cardStorage.countVotesById(t, card.id);
            return Object.assign({ leanCoffeeVotes }, card);
          }));

          const sortedCards = countedCards.sort((cardA, cardB) => {
            if (cardA.leanCoffeeVotes < cardB.leanCoffeeVotes) {
              return 1;
            } else if (cardB.leanCoffeeVotes < cardA.leanCoffeeVotes) {
              return -1;
            }

            return 0;
          });

          return {
            sortedIds: sortedCards.map(card => card.id)
          };
        }
      }],

      'show-settings': (t) => {
        return t.popup({
          title: 'Lean Coffee Settings',
          url: `${this.baseUrl}/settings.html`,
          height: 184 // we can always resize later
        });
      }
    });
  }

    handleVoting = async (t) => {
      const votes = await this.cardStorage.getVotes(t) || {};
      const currentMember = t.getContext().member;
      votes[currentMember] = !votes[currentMember];

      this.cardStorage.saveVotes(t, votes);
    };

    handleDiscussion = async (t) => {
      if (await this.discussion.isOngoingOrPausedForAnotherCard(t)) {
      const boardStatus = await this.boardStorage.getDiscussionStatus(t);
      const cardId = await this.boardStorage.getDiscussionCardId(t);
      const cardName = (await t.cards('id', 'name')).find(card => card.id === cardId).name;

        t.popup({
          title: 'Lean Coffee',
          url: `${this.baseUrl}/ongoing_or_paused.html`,
        args: {
          currentCardBeingDiscussed: cardName,
          currentDiscussionStatus: boardStatus
        },
          height: 120
        });

        return;
      }

      let items = [];

      switch (true) {
        case await this.discussion.isOngoingFor(t):
          items = [{
            text: 'Pause timer',
            callback: (t2) => {
              this.discussion.pause(t2);
              t2.closePopup();
            }
          }, {
            text: 'End discussion',
            callback: (t2) => {
              this.discussion.end(t2);
              t2.closePopup();
            }
          }];
          break;
        case await this.discussion.isPausedFor(t):
          items = [{
            text: 'Restart timer',
            callback: (t2) => {
              this.discussion.start(t2);
              t2.closePopup();
            }
          }, {
            text: 'End discussion',
            callback: (t2) => {
              this.discussion.end(t2);
              t2.closePopup();
            }
          }];
          break;
        default:
          items = [{
            text: 'Start timer',
            callback: (t2) => {
              this.discussion.start(t2);
              t2.closePopup();
            }
          }];
      }

      t.popup({
        title: 'Lean Coffee',
        items
      });
    };
}

export default LeanCoffeePowerUp;
