import { Trello } from './types/TrelloPowerUp';
import Debug from './utils/Debug';
import { LeanCoffeeBase, LeanCoffeeBaseParams } from './LeanCoffeeBase';

class LeanCoffeeSettings extends LeanCoffeeBase {
  isProduction: boolean;
  t: Trello.PowerUp.IFrame;

  constructor({ w, config }: LeanCoffeeBaseParams) {
    super({ w, config });
    this.t = w.TrelloPowerUp.iframe({ localization: this.localization });
    this.isProduction = process.env.NODE_ENV === 'production';
  }

  init(): void {
    if (!this.isProduction) {
      (this.w.document.querySelector('.dev-only') as HTMLElement).style.display = 'block';
      this.w.document.getElementById('showData').addEventListener('click', this.showData.bind(this));
      this.w.document.getElementById('wipeData').addEventListener('click', this.wipeData.bind(this));
    }

    this.t.sizeTo('#leanCoffeeSettingsForm');
  }

  showData = (evt: Event): void => {
    evt.preventDefault();
    if (this.isProduction) { return; }

    Debug.showData(this.t);
  };

  wipeData = (evt: Event): void => {
    evt.preventDefault();
    if (this.isProduction) { return; }

    Debug.wipeData(this.t, this.cardStorage, this.boardStorage);
  };
}

export default LeanCoffeeSettings;
