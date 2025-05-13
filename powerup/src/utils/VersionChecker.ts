import { parseSemVer } from "semver-parser";

import Analytics from "./Analytics";
import { I18nConfig } from "./I18nConfig";
import BoardStorage from "../storage/BoardStorage";
import MemberStorage from "../storage/MemberStorage";
import { Trello } from "../types/TrelloPowerUp";

class VersionChecker {
  boardStorage: BoardStorage;
  memberStorage: MemberStorage;

  constructor(boardStorage: BoardStorage, memberStorage: MemberStorage) {
    this.boardStorage = boardStorage;
    this.memberStorage = memberStorage;
  }

  isThereANewMinorOrMajor = async (
    t: Trello.PowerUp.IFrame,
  ): Promise<boolean> => {
    const storedVersionRaw = await this.memberStorage.read(
      t,
      MemberStorage.POWER_UP_VERSION,
    );

    if (!storedVersionRaw) {
      return true;
    }

    const storedVersion = parseSemVer(storedVersionRaw);
    const newVersion = parseSemVer(__BUILDTIME_VERSION__);

    const isNewer =
      newVersion.major > storedVersion.major ||
      newVersion.minor > storedVersion.minor;

    return !storedVersion || isNewer;
  };

  showMenu = async (t: Trello.PowerUp.IFrame): Promise<void> => {
    const storedVersion = await this.memberStorage.read(
      t,
      MemberStorage.POWER_UP_VERSION,
    );
    const title = storedVersion
      ? t.localizeKey("boardButtonPopupTitle", {
          oldVersion: storedVersion,
          newVersion: __BUILDTIME_VERSION__,
        })
      : t.localizeKey("boardButtonPopupTitleMissingVersion", {
          newVersion: __BUILDTIME_VERSION__,
        });

    return t.popup({
      title: title,
      url: `./release-notes.html?${await Analytics.getOverrides(this.boardStorage, t)}`,
      args: { version: __BUILDTIME_VERSION__, localization: I18nConfig },
      callback: this.storeNewVersion,
      height: 65,
    });
  };

  storeNewVersion = async (t: Trello.PowerUp.IFrame): Promise<void> => {
    await this.memberStorage.write(
      t,
      MemberStorage.POWER_UP_VERSION,
      __BUILDTIME_VERSION__,
    );
  };
}

export default VersionChecker;
