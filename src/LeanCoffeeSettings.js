import BoardStorage from './storage/BoardStorage';
import CardStorage from './storage/CardStorage';
import Debug from './Debug';


class LeanCoffeeSettings {
  constructor(window, environment) {
    this.w = window;
    this.t = window.TrelloPowerUp.iframe();
    this.Promise = window.TrelloPowerUp.Promise;
    this.isProduction = environment === 'production';
    this.boardStorage = new BoardStorage();
    this.cardStorage = new CardStorage();
  }

  init() {
    if (!this.isProduction) {
      this.w.document.getElementsByClassName('dev-only')[0].style.display = 'block';
    }
  }

  showData = async () => {
    if (this.isProduction) { return; }

    Debug.showData(this.t, this.Promise);
  };

  wipeData = async () => {
    if (this.isProduction) { return; }

    Debug.wipeData(this.t, this.Promise, this.cardStorage, this.boardStorage);
  };
}

export default LeanCoffeeSettings;
