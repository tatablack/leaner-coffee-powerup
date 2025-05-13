import BoardStorage from "../storage/BoardStorage";
import { Trello } from "../types/TrelloPowerUp";
import { isRunningInProduction } from "../utils/Errors";

export interface LeanCoffeePopupBaseParams {
  w: Window;
}

export class LeanCoffeePopupBase {
  w: Window;
  t: Trello.PowerUp.IFrame;
  boardStorage: BoardStorage;

  constructor({ w }: LeanCoffeePopupBaseParams) {
    this.boardStorage = new BoardStorage();
    this.t = w.TrelloPowerUp.iframe({
      helpfulStacks: !isRunningInProduction(),
    });
    this.w = w;

    Promise.all([
      this.boardStorage.getOrganisationIdHash(this.t),
      this.boardStorage.getBoardIdHash(this.t),
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
    const elements: NodeListOf<HTMLElement> =
      this.w.document.querySelectorAll(cssSelector);

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
