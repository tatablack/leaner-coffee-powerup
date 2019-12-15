import { Trello } from '../types/TrelloPowerUp';
import BoardStorage from '../storage/BoardStorage';

const LAST_UNCHECKED_VERSION = '0.6.2';

class UpdateChecker {
  storage: BoardStorage;
  storedVersion: string;

  constructor(storage: BoardStorage) {
    this.storage = storage;
  }

  hasBeenUpdated = async (t: Trello.PowerUp.IFrame): Promise<boolean> => {
    this.storedVersion = await this.storage.getPowerUpVersion(t);
    return !this.storedVersion || (this.storedVersion !== process.env.VERSION);
  };

  showMenu = async (t: Trello.PowerUp.IFrame): Promise<void> => {
    const storedVersion = await this.storage.getPowerUpVersion(t);

    return t.popup({
      title: t.localizeKey('boardButtonPopupTitle', {
        oldVersion: storedVersion || LAST_UNCHECKED_VERSION,
        newVersion: process.env.VERSION
      }),
      url: './release-notes.html',
      args: { version: process.env.VERSION },
      callback: this.storeNewVersion,
      height: 65
    });
  };

  storeNewVersion = async (t: Trello.PowerUp.IFrame): Promise<void> => {
    await this.storage.setPowerUpVersion(t, process.env.VERSION);
  };
}

export default UpdateChecker;
