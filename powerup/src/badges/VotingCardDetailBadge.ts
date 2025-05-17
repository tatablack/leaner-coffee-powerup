import VotingCardBadge from "./VotingCardBadge";
import { Trello } from "../types/TrelloPowerUp";
import Analytics from "../utils/Analytics";
import { getTagsForReporting } from "../utils/Errors";
import { I18nConfig } from "../utils/I18nConfig";

class VotingCardDetailBadge extends VotingCardBadge {
  clearVoters = async (t: Trello.PowerUp.IFrame) => {
    const totalVoters = await this.getVoters(t);

    await this.cardStorage.deleteVotes(t);
    await Analytics.event(this.w, "votesCleared", {
      total: totalVoters.length,
    });
  };

  showVoters = async (t: Trello.PowerUp.IFrame): Promise<void> => {
    const items = await this.getVoters(t);

    if (!items.length) {
      return;
    }

    await t.popup({
      title: t.localizeKey("voters"),
      url: `./voters.html?${await Analytics.getOverrides(this.boardStorage, t)}&${await getTagsForReporting(this.boardStorage, t)}`,
      args: {
        items,
        localization: I18nConfig,
      },
      callback: this.clearVoters,
    });
  };

  render = async (
    t: Trello.PowerUp.IFrame,
  ): Promise<Trello.PowerUp.CardDetailBadge> => {
    const commonData = (await super.render(
      t,
    )) as Trello.PowerUp.CardDetailBadge;

    if (commonData) {
      commonData.title = t.localizeKey("voters");
      delete commonData.icon;
      commonData.callback = this.showVoters;
    }

    return commonData;
  };
}

export default VotingCardDetailBadge;
