import { Trello } from "../types/TrelloPowerUp";
import { isRunningInProduction } from "../utils/Errors";

export interface LeanCoffeePopupBaseParams {
  w: Window;
}

export class LeanCoffeePopupBase {
  w: Window;
  t: Trello.PowerUp.IFrame;

  constructor({ w }: LeanCoffeePopupBaseParams) {
    this.t = w.TrelloPowerUp.iframe({
      helpfulStacks: !isRunningInProduction(),
    });
    this.w = w;


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
