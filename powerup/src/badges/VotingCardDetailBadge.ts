import VotingCardBadge from "./VotingCardBadge";
import { Trello } from "../types/TrelloPowerUp";
import { I18nConfig } from "../utils/I18nConfig";

class VotingCardDetailBadge extends VotingCardBadge {
  clearVoters = async (t: Trello.PowerUp.IFrame) => {
    await this.storage.deleteVotes(t);
  };

  showVoters = async (t: Trello.PowerUp.IFrame): Promise<void> => {
    const items = await this.getVoters(t);

    if (!items.length) {
      return;
    }

    await t.popup({
      title: t.localizeKey("voters"),
      url: "./voters.html",
      args: { items, localization: I18nConfig },
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
