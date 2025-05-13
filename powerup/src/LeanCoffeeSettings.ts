import { LeanCoffeeBase, LeanCoffeeBaseParams } from "./LeanCoffeeBase";
import { Trello } from "./types/TrelloPowerUp";
import Debug from "./utils/Debug";
import { I18nConfig } from "./utils/I18nConfig";

class LeanCoffeeSettings extends LeanCoffeeBase {
  t: Trello.PowerUp.IFrame;

  constructor({ w, config }: LeanCoffeeBaseParams) {
    super({ w, config });
    this.t = w.TrelloPowerUp.iframe({
      localization: I18nConfig,
      helpfulStacks: !this.isRunningInProduction(),
    });
  }
import { isRunningInProduction } from "./utils/Errors";

  init(): void {
    if (!isRunningInProduction()) {
      (
        this.w.document.querySelector(".dev-only") as HTMLElement
      ).style.display = "block";
      this.w.document
        .getElementById("showData")
        .addEventListener("click", this.showData.bind(this));
      this.w.document
        .getElementById("wipeData")
        .addEventListener("click", this.wipeData.bind(this));
    }

    this.t.render(() => {
      this.t.localizeNode(document.body);
      this.t.sizeTo("#leanCoffeeSettingsForm");
    });
  }

  showData = async (evt: Event): Promise<void> => {
    evt.preventDefault();
    if (isRunningInProduction()) {
      return;
    }

    await Debug.showData(this.t);
  };

  wipeData = async (evt: Event): Promise<void> => {
    evt.preventDefault();
    if (isRunningInProduction()) {
      return;
    }

    await Debug.wipeData(this.t, this.cardStorage, this.boardStorage);
  };
}

export default LeanCoffeeSettings;
