import BoardStorage from './storage/BoardStorage';
import CardStorage from './storage/CardStorage';
import Debug from './Debug';


class LeanCoffeeSettings {
  constructor(window, environment, version) {
    this.w = window;
    this.t = window.TrelloPowerUp.iframe();
    this.version = version;
    this.Promise = window.TrelloPowerUp.Promise;
    this.isProduction = environment === 'production';
    this.boardStorage = new BoardStorage();
    this.cardStorage = new CardStorage();
  }

  init() {
    if (!this.isProduction) {
      this.w.document.querySelector('.dev-only').style.display = 'block';
    }

    this.w.document.querySelector('.title').innerText = `Jeeves v${this.version}`;
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
