import Analytics from "./Analytics";
import { I18nConfig } from "./I18nConfig";
import BoardStorage from "../storage/BoardStorage";
import { Trello } from "../types/TrelloPowerUp";

const LAST_UNCHECKED_VERSION = "0.6.2";

class UpdateChecker {
  boardStorage: BoardStorage;
  storedVersion: string;

  constructor(storage: BoardStorage) {
    this.boardStorage = storage;
  }

  hasBeenUpdated = async (t: Trello.PowerUp.IFrame): Promise<boolean> => {
    this.storedVersion = await this.boardStorage.getPowerUpVersion(t);
    return !this.storedVersion || this.storedVersion !== process.env.VERSION;
  };

  showMenu = async (t: Trello.PowerUp.IFrame): Promise<void> => {
    const storedVersion = await this.boardStorage.getPowerUpVersion(t);
    return t.popup({
      title: t.localizeKey("boardButtonPopupTitle", {
        oldVersion: storedVersion || LAST_UNCHECKED_VERSION,
        newVersion: process.env.VERSION,
      }),
      url: `./release-notes.html?${await Analytics.getOverrides(this.boardStorage, t)}`,
      args: { version: process.env.VERSION, localization: I18nConfig },
      callback: this.storeNewVersion,
      height: 65,
    });
  };

  storeNewVersion = async (t: Trello.PowerUp.IFrame): Promise<void> => {
    await this.boardStorage.setPowerUpVersion(t, process.env.VERSION);
  };
}

export default UpdateChecker;
