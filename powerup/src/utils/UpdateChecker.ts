import { parseSemVer } from "semver-parser";

import Analytics from "./Analytics";
import { I18nConfig } from "./I18nConfig";
import BoardStorage from "../storage/BoardStorage";
import { Trello } from "../types/TrelloPowerUp";

const LAST_UNCHECKED_VERSION = "0.6.2";

class UpdateChecker {
  boardStorage: BoardStorage;

  constructor(storage: BoardStorage) {
    this.boardStorage = storage;
  }

  isThereANewMinorOrMajor = async (
    t: Trello.PowerUp.IFrame,
  ): Promise<boolean> => {
    const storedVersion = parseSemVer(
      await this.boardStorage.getPowerUpVersion(t),
    );
    const newVersion = parseSemVer(__BUILDTIME_VERSION__);

    // We don't want to show the board button for the release notes
    // if there is a new patch version, but only for minor and major updates.
    const isNewer =
      newVersion.major > storedVersion.major ||
      newVersion.minor > storedVersion.minor;

    return !storedVersion || isNewer;
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
