import { Trello } from '../types/TrelloPowerUp';
import BoardStorage from '../storage/BoardStorage';
import { I18nConfig } from './I18nConfig';

class BoardMenu {
  storage: BoardStorage;

  constructor(storage: BoardStorage) {
    this.storage = storage;
  }

  handleCallback = async (t: Trello.PowerUp.IFrame, opts: any): Promise<void> => {
    console.log(opts);
    // await this.storage.setPowerUpVersion(t, process.env.VERSION);
  };

  show = async (t: Trello.PowerUp.IFrame): Promise<void> => {
    const storedVersion = await this.storage.getPowerUpVersion(t);
    const justUpdated = storedVersion !== process.env.VERSION;

    return t.popup({
      title: 'Leaner Coffee',
      url: './board-menu.html',
      args: { version: process.env.VERSION, justUpdated, localization: I18nConfig },
      callback: this.handleCallback,
      height: 65
    });
  };
}

export default BoardMenu;
