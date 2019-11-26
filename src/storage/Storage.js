import { StorageScope, StorageVisibility } from '../utils/TrelloConstants';

class Storage {
  constructor(scope = StorageScope.MEMBER, visibility = StorageVisibility.PRIVATE) {
    Object.assign(this, { scope, visibility });
  }

  readById(t, key, cardId) {
    return t.get(cardId, this.visibility, key);
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

  delete(t, key) {
    return t.remove(this.scope, this.visibility, key);
  }

  deleteMultiple(t, entries) {
    return t.remove(this.scope, this.visibility, entries);
  }

  deleteMultipleById(t, entries, cardId) {
    return t.remove(cardId, this.visibility, entries);
  }
}

export default Storage;
