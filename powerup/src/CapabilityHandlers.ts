import LeanCoffeePowerUp from "./LeanCoffeePowerUp";
import CardStorage from "./storage/CardStorage";
import { Trello } from "./types/TrelloPowerUp";
import Analytics from "./utils/Analytics";
import { I18nConfig } from "./utils/I18nConfig";

export const CapabilityHandlers = (
  powerUp: LeanCoffeePowerUp,
): Trello.PowerUp.CapabilityHandlers => ({
  "board-buttons": async (
    t: Trello.PowerUp.IFrame,
  ): Promise<Trello.PowerUp.BoardButtonCallback[]> => {
    if (!(await powerUp.updateChecker.hasBeenUpdated(t))) {
      return [];
    }

    return [
      {
        icon: {
          dark: `${powerUp.baseUrl}/assets/moka_white.svg`,
          light: `${powerUp.baseUrl}/assets/moka.svg`,
        },
        text: t.localizeKey("boardButtonLabel"),
        callback: powerUp.updateChecker.showMenu,
      },
    ];
  },

  "card-back-section": async (
    t: Trello.PowerUp.IFrame,
  ): Promise<Trello.PowerUp.CardBackSection> => {
    const discussionStatus =
      await powerUp.discussion.cardStorage.getDiscussionStatus(t);
    if (discussionStatus === undefined) {
      return null;
    }

    return {
      title: t.localizeKey("discussion"),
      icon: `${powerUp.baseUrl}/assets/powerup/timer.svg`,
      content: {
        type: "iframe",
        url: t.signUrl(
          `${powerUp.baseUrl}/discussion-ui.html?${await Analytics.getOverrides(powerUp.boardStorage, t)}`,
        ),
      },
    };
  },

  "card-badges": async (
    t: Trello.PowerUp.IFrame,
  ): Promise<Trello.PowerUp.CardBadge[]> => {
    const badges = [
      await powerUp.elapsedCardBadge.render(t),
      await powerUp.votingCardBadge.render(t),
    ];

    return badges.filter((badge) => badge);
  },

  "card-buttons": async (
    t: Trello.PowerUp.IFrame,
  ): Promise<Trello.PowerUp.CardButton[]> => [
    {
      icon: `${powerUp.baseUrl}/assets/powerup/timer.svg`,
      text: await powerUp.getButtonLabel(t),
      callback: powerUp.handleDiscussion,
    },
    {
      icon: `${powerUp.baseUrl}/assets/powerup/heart.svg`,
      text: t.localizeKey("vote", {
        symbol: (await powerUp.voting.hasCurrentMemberVoted(t)) ? "☑" : "☐",
      }),
      callback: powerUp.handleVoting,
    },
  ],

  "card-detail-badges": async (
    t: Trello.PowerUp.IFrame,
  ): Promise<Trello.PowerUp.CardDetailBadge[]> => {
    const badges = [
      await powerUp.elapsedCardDetailBadge.render(t),
      await powerUp.votingCardDetailBadge.render(t),
    ];

    return badges.filter((badge) => badge);
  },

  "list-actions": (
    t: Trello.PowerUp.IFrame,
  ): Promise<Trello.PowerUp.ListAction[]> =>
    Promise.resolve([
      {
        text: t.localizeKey("clearVotesFromList"),
        callback: async (t2): Promise<void> => {
          const result = await t2.list("cards");
          result.cards.forEach(({ id }) => {
            powerUp.cardStorage.deleteMultiple(t2, [CardStorage.VOTES], id);
          });
          await Analytics.event(
            (t2 as any).source?.window[0],
            "listVotesCleared",
          );
        },
      },
    ]),

  "list-sorters": (
    t: Trello.PowerUp.IFrame,
  ): Promise<Trello.PowerUp.ListSorter[]> =>
    Promise.resolve([
      {
        text: t.localizeKey("sortByVote"),
        callback: async (t2, opts): Promise<{ sortedIds: string[] }> => {
          const votingData = await Promise.all(
            opts.cards.map(
              async (
                card,
              ): Promise<{ leanCoffeeVotes: number; id: string }> => {
                const leanCoffeeVotes = await powerUp.voting.countVotesByCard(
                  t2,
                  card.id,
                );
                return { leanCoffeeVotes, id: card.id };
              },
            ),
          );

          const sortedCards = votingData.sort((cardA, cardB) => {
            if (cardA.leanCoffeeVotes < cardB.leanCoffeeVotes) {
              return 1;
            }
            if (cardB.leanCoffeeVotes < cardA.leanCoffeeVotes) {
              return -1;
            }
            return 0;
          });

          await Analytics.event(
            (t2 as any).source?.window[0],
            "listVotesSorted",
          );

          return {
            sortedIds: sortedCards.map((card) => card.id),
          };
        },
      },
    ]),

  "on-enable": async (t: Trello.PowerUp.IFrame): Promise<void> => {
    // There can be a race condition between the power-up starting
    // and the on-enable event being triggered.
    await navigator.locks.request(
      "powerup_init",
      { ifAvailable: true },
      async (lock) => {
        const isInitialised = await powerUp.boardStorage.getInitialised(t);
        // if the lock is null, it means LeanCoffeePowerup::start is taking care of initialisation
        if (lock === null || isInitialised) {
          return;
        }

        if (!isInitialised) {
          await powerUp.handlePowerupEnabled(t);
        }
      },
    );

    await Analytics.event(window, "enabled");
  },

  "on-disable": async (t: Trello.PowerUp.IFrame): Promise<void> => {
    const window = (t as any).source?.window[1]; // The order is not guaranteed
    await Analytics.event(window, "disabled");
  },

  "show-settings": async (t: Trello.PowerUp.IFrame): Promise<void> => {
    return t.popup({
      title: `Leaner Coffee ${__BUILDTIME_VERSION__}`,
      url: `${powerUp.baseUrl}/settings.html?${await Analytics.getOverrides(powerUp.boardStorage, t)}`,
      height: 184,
      args: {
        localization: I18nConfig,
      },
    });
  },
});
