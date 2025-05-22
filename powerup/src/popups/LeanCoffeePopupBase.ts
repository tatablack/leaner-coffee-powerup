import BoardStorage from "../storage/BoardStorage";
import { Trello } from "../types/TrelloPowerUp";
import { ErrorReporterInjector, isRunningInProduction } from "../utils/Errors";
import { bindAll } from "../utils/Scope";

export interface LeanCoffeePopupBaseParams {
  w: Window;
}

@ErrorReporterInjector
class LeanCoffeePopupBase {
  w: Window;
  t: Trello.PowerUp.IFrame;
  boardStorage: BoardStorage;

  constructor({ w }: LeanCoffeePopupBaseParams) {
    this.boardStorage = new BoardStorage();
    this.t = w.TrelloPowerUp.iframe({
      helpfulStacks: !isRunningInProduction(),
    });
    this.w = w;
    bindAll(this);

    Promise.all([
      this.boardStorage.read<string>(this.t, BoardStorage.BOARD_HASH),
      this.boardStorage.read<string>(this.t, BoardStorage.ORGANISATION_HASH),
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

  toggleFields(cssSelector: string, key: string): void {
    const elements: NodeListOf<HTMLElement> = this.w.document.querySelectorAll(cssSelector);

    elements.forEach((message: HTMLElement) => {
      const shouldBeDisplayed = message.dataset.i18nId === key;

      message.style.display = shouldBeDisplayed ? "block" : "none";
    });
  }

  initLocaliser(callback: () => void): void {
    this.w.TrelloPowerUp.util
      .initLocalizer(this.w.locale, {
        localization: this.t.arg("localization"),
      })
      .then(callback);
  }
}

export default LeanCoffeePopupBase;
