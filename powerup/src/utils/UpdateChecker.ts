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
    return !this.storedVersion || this.storedVersion !== __BUILDTIME_VERSION__;
  };

  showMenu = async (t: Trello.PowerUp.IFrame): Promise<void> => {
    const storedVersion = await this.boardStorage.getPowerUpVersion(t);
    return t.popup({
      title: t.localizeKey("boardButtonPopupTitle", {
        oldVersion: storedVersion || LAST_UNCHECKED_VERSION,
        newVersion: __BUILDTIME_VERSION__,
      }),
      url: `./release-notes.html?${await Analytics.getOverrides(this.boardStorage, t)}`,
      args: { version: __BUILDTIME_VERSION__, localization: I18nConfig },
      callback: this.storeNewVersion,
      height: 65,
    });
  };

  storeNewVersion = async (t: Trello.PowerUp.IFrame): Promise<void> => {
    await this.boardStorage.setPowerUpVersion(t, __BUILDTIME_VERSION__);
  };
}

export default UpdateChecker;
