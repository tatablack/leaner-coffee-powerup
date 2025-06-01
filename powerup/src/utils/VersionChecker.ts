import { parseSemVer } from "semver-parser";

import Analytics from "./Analytics";
import { ErrorReporterInjector, getTagsForReporting } from "./Errors";
import { I18nConfig } from "./I18nConfig";
import { bindAll } from "./Scope";
import BoardStorage from "../storage/BoardStorage";
import MemberStorage from "../storage/MemberStorage";
import Trello from "../types/trellopowerup/index";

@ErrorReporterInjector
class VersionChecker {
  boardStorage: BoardStorage;
  memberStorage: MemberStorage;

  constructor(boardStorage: BoardStorage, memberStorage: MemberStorage) {
    this.boardStorage = boardStorage;
    this.memberStorage = memberStorage;
    bindAll(this);
  }

  async isThereANewMinorOrMajor(t: Trello.PowerUp.CallbackHandler): Promise<boolean> {
    const storedVersionRaw = await this.memberStorage.read<string>(t, MemberStorage.POWER_UP_VERSION);

    if (!storedVersionRaw) {
      return true;
    }

    const storedVersion = parseSemVer(storedVersionRaw);
    const newVersion = parseSemVer(__BUILDTIME_VERSION__);

    const isNewer = newVersion.major > storedVersion.major || newVersion.minor > storedVersion.minor;

    return !storedVersion || isNewer;
  }

  async showMenu(t: Trello.PowerUp.CallbackHandler): Promise<void> {
    const storedVersion = await this.memberStorage.read<string>(t, MemberStorage.POWER_UP_VERSION);
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
      url: `./release-notes.html?${await Analytics.getOverrides(this.boardStorage, t)}&${await getTagsForReporting(this.boardStorage, t)}`,
      args: { version: __BUILDTIME_VERSION__, localization: I18nConfig },
      callback: this.storeNewVersion,
      height: 65,
    });
  }

  async storeNewVersion(t: Trello.PowerUp.CallbackHandler): Promise<void> {
    await this.memberStorage.write(t, MemberStorage.POWER_UP_VERSION, __BUILDTIME_VERSION__);
  }
}

export default VersionChecker;
