import { LeanCoffeeBase, LeanCoffeeBaseParams } from "./LeanCoffeeBase";
import BoardStorage from "./storage/BoardStorage";
import { isRunningInProduction } from "./utils/Errors";
import { I18nConfig } from "./utils/I18nConfig";

export class LeanCoffeeIFrame extends LeanCoffeeBase {
  t: Trello.PowerUp.IFrame;

  constructor({ w, config }: LeanCoffeeBaseParams) {
    super({ w, config });

    this.t = w.TrelloPowerUp.iframe({
      localization: I18nConfig,
      helpfulStacks: !isRunningInProduction(),
    });

    Promise.all([
      this.boardStorage.read<string>(this.t, BoardStorage.ORGANISATION_HASH),
      this.boardStorage.read<string>(this.t, BoardStorage.BOARD_HASH),
    ]).then(([organisationIdHash, boardIdHash]) => {
      if (this.w.Sentry) {
        this.w.Sentry.onLoad(async () => {
          this.w.Sentry.setTags({
            organisationIdHash: organisationIdHash,
            boardIdHash: boardIdHash,
          });
        });
      }
    });
  }
}
