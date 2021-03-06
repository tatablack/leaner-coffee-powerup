import { Trello } from '../types/TrelloPowerUp';

/* eslint-disable @typescript-eslint/no-explicit-any */
class Storage {
  scope: Trello.PowerUp.Scope;
  visibility: Trello.PowerUp.Visibility;

  constructor(scope: Trello.PowerUp.Scope = 'member', visibility: Trello.PowerUp.Visibility = 'private') {
    Object.assign(this, { scope, visibility });
  }

  read(t: Trello.PowerUp.IFrame, key: string, cardId?: string): PromiseLike<any> {
    return t.get(cardId ?? this.scope, this.visibility, key);
  }

  // eslint-disable-next-line @typescript-eslint/explicit-module-boundary-types
  write(t: Trello.PowerUp.IFrame, key: string, value: any, cardId?: string): PromiseLike<void> {
    return t.set(cardId ?? this.scope, this.visibility, key, value);
  }

  writeMultiple(t: Trello.PowerUp.IFrame, entries: {
    [ key: string]: any;
  }, cardId?: string): PromiseLike<void> {
    return t.set(cardId ?? this.scope, this.visibility, entries);
  }

  delete(t: Trello.PowerUp.IFrame, key: string, cardId?: string): PromiseLike<void> {
    return t.remove(cardId ?? this.scope, this.visibility, key);
  }

  deleteMultiple(t: Trello.PowerUp.IFrame, entries: string[], cardId?: string): PromiseLike<void> {
    return t.remove(cardId ?? this.scope, this.visibility, entries);
  }
}

export default Storage;
