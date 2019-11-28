import Bluebird from 'bluebird';
import Debug from './utils/Debug';
import { LeanCoffeeBase, LeanCoffeeBaseParams } from './LeanCoffeeBase';

interface LeanCoffeeSettingsParams extends LeanCoffeeBaseParams {
  environment: Environment;
}

class LeanCoffeeSettings extends LeanCoffeeBase {
  isProduction: boolean;

  constructor({ w, environment }: LeanCoffeeSettingsParams) {
    super({ w, t: w.TrelloPowerUp.iframe() });
    this.isProduction = environment === 'production';
  }

  init(): void {
    if (!this.isProduction) {
      (this.w.document.querySelector('.dev-only') as HTMLElement).style.display = 'block';
    }

    this.t.sizeTo('#leanCoffeeSettingsForm');
  }

  showData = async (): Bluebird<void> => {
    if (this.isProduction) { return; }

    await Debug.showData(this.t, this.Promise);
  };

  wipeData = async (): Bluebird<void> => {
    if (this.isProduction) { return; }

    await Debug.wipeData(this.t, this.Promise, this.cardStorage, this.boardStorage);
  };
}

export default LeanCoffeeSettings;
