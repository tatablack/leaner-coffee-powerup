import Storage from "./Storage";

class MemberStorage extends Storage {
  static POWER_UP_VERSION = "powerUpVersion";

  constructor() {
    super("member", "private");
  }
}

export default MemberStorage;
