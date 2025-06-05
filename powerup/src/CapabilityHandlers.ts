import LeanCoffeePowerUp from "./LeanCoffeePowerUp";
import BoardStorage from "./storage/BoardStorage";
import CardStorage from "./storage/CardStorage";
import Trello from "./types/trellopowerup/index";
import Analytics from "./utils/Analytics";
import classifyDuration from "./utils/Duration";
import { ErrorReporterInjector } from "./utils/Errors";
import { I18nConfig } from "./utils/I18nConfig";
import { bindAll } from "./utils/Scope";

@ErrorReporterInjector
class CapabilityHandlers {
  powerUp: LeanCoffeePowerUp;
  boardStorage: BoardStorage;

  constructor(powerUp: LeanCoffeePowerUp) {
    this.powerUp = powerUp;
    this.boardStorage = new BoardStorage();
    bindAll(this);
  }

  async boardButtonsHandler(t: Trello.PowerUp.CallbackHandler): Promise<Trello.PowerUp.BoardButtonCallback[]> {
    // We are hijacking this capability to do some initialisation,
    // because on-enable is not guaranteed to be triggered on new installations.
    // See: https://developer.atlassian.com/cloud/trello/power-ups/capabilities/on-enable/#not-guaranteed
    await navigator.locks.request("powerup_init", { ifAvailable: true }, async (lock) => {
      // if the lock is null, it means the on-enable handler is taking care of initialisation
      if (lock === null) {
        return;
      }

      // If the power-up is not initialised, we initialise it.
      if (!(await this.boardStorage.read<string>(t, BoardStorage.POWER_UP_INSTALLATION_DATE))) {
        await this.powerUp.handlePowerupEnabled(t);
      }
    });

    // We don't want to show the board button for the release notes
    // if there is a new patch version: only for minor and major updates.
    if (!(await this.powerUp.versionChecker.isThereANewMinorOrMajor(t))) {
      return [];
    }

    return [
      {
        icon: {
          dark: `${this.powerUp.baseUrl}/assets/moka_white.svg`,
          light: `${this.powerUp.baseUrl}/assets/moka.svg`,
        },
        text: t.localizeKey("boardButtonLabel"),
        callback: this.powerUp.versionChecker.showMenu,
      },
    ];
  }

  async cardBackSection(t: Trello.PowerUp.CallbackHandler): Promise<Trello.PowerUp.CardBackSection> {
    const discussionStatus = await this.powerUp.discussion.cardStorage.read<DiscussionStatus>(
      t,
      CardStorage.DISCUSSION_STATUS,
    );
    if (discussionStatus === undefined) {
      return null;
    }

    return {
      title: t.localizeKey("discussion"),
      icon: `${this.powerUp.baseUrl}/assets/powerup/timer.svg`,
      content: {
        type: "iframe",
        url: t.signUrl(
          `${this.powerUp.baseUrl}/discussion-ui.html?${await Analytics.getOverrides(this.powerUp.boardStorage, t)}`,
        ),
      },
    };
  }

  async cardBadges(t: Trello.PowerUp.CallbackHandler): Promise<Trello.PowerUp.CardBadge[]> {
    const badges = [await this.powerUp.elapsedCardBadge.render(t), await this.powerUp.votingCardBadge.render(t)];

    return badges.filter((badge) => badge);
  }

  async cardButtons(t: Trello.PowerUp.CallbackHandler): Promise<Trello.PowerUp.CardButton[]> {
    return [
      {
        icon: `${this.powerUp.baseUrl}/assets/powerup/timer.svg`,
        text: await this.powerUp.getButtonLabel(t),
        callback: this.powerUp.handleDiscussion,
      },
      {
        icon: `${this.powerUp.baseUrl}/assets/powerup/heart.svg`,
        text: t.localizeKey("vote", {
          symbol: (await this.powerUp.voting.hasCurrentMemberVoted(t)) ? "☑" : "☐",
        }),
        callback: this.powerUp.handleVoting,
      },
    ];
  }

  async cardDetailBadges(t: Trello.PowerUp.CallbackHandler): Promise<Trello.PowerUp.CardDetailBadge[]> {
    const badges = [
      await this.powerUp.elapsedCardDetailBadge.render(t),
      await this.powerUp.votingCardDetailBadge.render(t),
    ];

    return badges.filter((badge) => badge);
  }
  async listActions(t: Trello.PowerUp.CallbackHandler): Promise<Trello.PowerUp.ListAction[]> {
    return Promise.resolve([
      {
        text: t.localizeKey("clearVotesFromList"),
        callback: async (t2): Promise<void> => {
          const result = await t2.list("cards");
          result.cards.forEach(({ id }) => {
            this.powerUp.cardStorage.deleteMultiple(t2, [CardStorage.VOTES], id);
          });
          await Analytics.event(window, "listVotesCleared");
        },
      },
    ]);
  }

  async listSorters(t: Trello.PowerUp.CallbackHandler): Promise<Trello.PowerUp.ListSorter[]> {
    return Promise.resolve([
      {
        text: t.localizeKey("sortByVote"),
        callback: async (t2, opts): Promise<{ sortedIds: string[] }> => {
          const votingData = await Promise.all(
            opts.cards.map(async (card): Promise<{ leanCoffeeVotes: number; id: string }> => {
              const leanCoffeeVotes = await this.powerUp.voting.countVotesByCard(t2, card.id);
              return { leanCoffeeVotes, id: card.id };
            }),
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

          await Analytics.event(window, "listVotesSorted");

          return {
            sortedIds: sortedCards.map((card) => card.id),
          };
        },
      },
    ]);
  }

  async onEnable(t: Trello.PowerUp.CallbackHandler): Promise<void> {
    // There can be a race condition between the power-up starting
    // and the on-enable event being triggered.
    await navigator.locks.request("powerup_init", { ifAvailable: true }, async (lock) => {
      // if the lock is null, it means the board-buttons handler is taking care of initialisation
      if (lock === null) {
        return;
      }

      // If the power-up is not initialised, we initialise it.
      if (!(await this.boardStorage.read<string>(t, BoardStorage.POWER_UP_INSTALLATION_DATE))) {
        await this.powerUp.handlePowerupEnabled(t);
      }
    });

    await Analytics.event(window, "enabled");
  }
  async onDisable(t: Trello.PowerUp.CallbackHandler): Promise<void> {
    const installationDate = await this.powerUp.boardStorage.read<string>(t, BoardStorage.POWER_UP_INSTALLATION_DATE);

    await Analytics.event(window, "disabled", {
      installedFor: classifyDuration(Date.now() - Date.parse(installationDate)),
    });
  }

  async showSettings(t: Trello.PowerUp.CallbackHandler): Promise<void> {
    return t.popup({
      title: `Leaner Coffee ${__BUILDTIME_VERSION__}`,
      url: `${this.powerUp.baseUrl}/settings.html?${await Analytics.getOverrides(this.powerUp.boardStorage, t)}`,
      height: 184,
      args: {
        localization: I18nConfig,
      },
    });
  }

  getAll(): Trello.PowerUp.CapabilityHandlers {
    return {
      "board-buttons": this.boardButtonsHandler,
      "card-back-section": this.cardBackSection,
      "card-badges": this.cardBadges,
      "card-buttons": this.cardButtons,
      "card-detail-badges": this.cardDetailBadges,
      "list-actions": this.listActions,
      "list-sorters": this.listSorters,
      "on-enable": this.onEnable,
      "on-disable": this.onDisable,
      "show-settings": this.showSettings,
    };
  }
}

export default CapabilityHandlers;
