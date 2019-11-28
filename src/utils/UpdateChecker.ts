import Bluebird from 'bluebird';
import BoardStorage from '../storage/BoardStorage';

const LAST_UNCHECKED_VERSION = '0.6.2';

class UpdateChecker {
  storage: BoardStorage;
  storedVersion: string;

  constructor(storage) {
    this.storage = storage;
  }

  hasBeenUpdated = async (t): Bluebird<boolean> => {
    this.storedVersion = await this.storage.getPowerUpVersion(t);
    return !this.storedVersion || (this.storedVersion !== process.env.VERSION);
  };

  showMenu = async (t): Bluebird<void> => {
    const storedVersion = await this.storage.getPowerUpVersion(t);

    t.popup({
      title: `Updated from ${storedVersion || LAST_UNCHECKED_VERSION} to ${process.env.VERSION}`,
      url: './release-notes.html',
      args: { version: process.env.VERSION },
      callback: this.storeNewVersion,
      height: 65
    });
  };

  storeNewVersion = async (t): Bluebird<void> => {
    await this.storage.setPowerUpVersion(t, process.env.VERSION);
  };
}

export default UpdateChecker;
