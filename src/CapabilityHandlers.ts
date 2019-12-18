import { Trello } from './types/TrelloPowerUp';
import CardStorage from './storage/CardStorage';
import { I18nConfig } from './utils/I18nConfig';

export const CapabilityHandlers = (powerup: any) => ({
  'board-buttons': async (t: Trello.PowerUp.IFrame): Promise<Trello.PowerUp.BoardButtonCallback[]> => {
    if (!await powerup.updateChecker.hasBeenUpdated(t)) {
      return [];
    }

    return [{
      icon: {
        dark: `${powerup.baseUrl}/assets/moka_white.svg`,
        light: `${powerup.baseUrl}/assets/moka.svg`
      },
      text: t.localizeKey('boardButtonLabel'),
      callback: powerup.updateChecker.showMenu
    }];
  },

  'card-back-section': async (t: Trello.PowerUp.IFrame): Promise<Trello.PowerUp.CardBackSection> => {
    const discussionStatus = await powerup.discussion.cardStorage.getDiscussionStatus(t);
    if (discussionStatus === undefined) { return null; }

    return {
      title: t.localizeKey('discussion'),
      icon: `${powerup.baseUrl}/assets/powerup/timer.svg`,
      content: {
        type: 'iframe',
        url: t.signUrl(`${powerup.baseUrl}/discussion-ui.html`),
        height: 64
      }
    };
  },

  'card-badges': async (t: Trello.PowerUp.IFrame): Promise<Trello.PowerUp.CardBadge[]> => {
    const badges = [
      await powerup.elapsedCardBadge.render(t),
      await powerup.votingCardBadge.render(t)
    ];

    return badges.filter((badge) => badge);
  },

  'card-buttons': async (t: Trello.PowerUp.IFrame): Promise<Trello.PowerUp.CardButton[]> => [{
    icon: `${powerup.baseUrl}/assets/powerup/timer.svg`,
    text: await powerup.getButtonLabel(t),
    callback: powerup.handleDiscussion
  }, {
    icon: `${powerup.baseUrl}/assets/powerup/heart.svg`,
    text: t.localizeKey('vote', {
      symbol: await powerup.voting.hasCurrentMemberVoted(t) ? '☑' : '☐'
    }),
    callback: powerup.handleVoting
  }],

  'card-detail-badges': async (t: Trello.PowerUp.IFrame): Promise<Trello.PowerUp.CardDetailBadge[]> => {
    const badges = [
      await powerup.elapsedCardDetailBadge.render(t),
      await powerup.votingCardDetailBadge.render(t)
    ];

    return badges.filter((badge) => badge);
  },

  'list-actions': (t: Trello.PowerUp.IFrame): Promise<Trello.PowerUp.ListAction[]> => Promise.resolve([{
    text: t.localizeKey('clearVotes'),
    callback: async (t): Promise<void> => {
      const result = await t.list('cards');
      result.cards.forEach(({ id }) => {
        powerup.cardStorage.deleteMultipleById(t, [CardStorage.VOTES], id);
      });
      return t.closePopup();
    }
  }]),

  'list-sorters': (t: Trello.PowerUp.IFrame): Promise<Trello.PowerUp.ListSorter[]> => Promise.resolve([{
    text: t.localizeKey('sortByVote'),
    callback: async (t, opts): Promise<{ sortedIds: string[] }> => {
      const votingData = await Promise.all(opts.cards.map(
        async (card): Promise<{ leanCoffeeVotes: number; id: string }> => {
          const leanCoffeeVotes = await powerup.voting.countVotesByCard(t, card.id);
          return { leanCoffeeVotes, id: card.id };
        }
      ));

      const sortedCards = votingData.sort((cardA, cardB) => {
        if (cardA.leanCoffeeVotes < cardB.leanCoffeeVotes) { return 1; }
        if (cardB.leanCoffeeVotes < cardA.leanCoffeeVotes) { return -1; }
        return 0;
      });

      return {
        sortedIds: sortedCards.map((card) => card.id)
      };
    }
  }]),

  'on-enable': (t: Trello.PowerUp.IFrame): PromiseLike<void> => powerup.boardStorage.setPowerUpVersion(
    t, process.env.VERSION
  ),

  'show-settings': (t: Trello.PowerUp.IFrame): PromiseLike<void> => t.popup({
    title: `Leaner Coffee v${process.env.VERSION}`,
    url: `${powerup.baseUrl}/settings.html`,
    height: 184,
    args: {
      localization: I18nConfig
    }
  })
});
