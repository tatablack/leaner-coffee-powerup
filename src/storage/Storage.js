import { StorageScope, StorageVisibility } from '../TrelloConstants';

class Storage {
  constructor(scope = StorageScope.MEMBER, visibility = StorageVisibility.PRIVATE) {
    Object.assign(this, { scope, visibility });
  }

  read(t, key) {
    return t.get(this.scope, this.visibility, key);
  }

  write(t, key, value) {
    return t.set(this.scope, this.visibility, key, value);
  }

  writeMultiple(t, entries) {
    return t.set(this.scope, this.visibility, entries);
  }

  deleteMultiple(t, entries) {
    return t.remove(this.scope, this.visibility, entries);
  }
}

export default Storage;
