import { Trello } from '../types/TrelloPowerUp';

/* eslint-disable @typescript-eslint/no-explicit-any */
class Storage {
  scope: Trello.PowerUp.Scope;
  visibility: Trello.PowerUp.Visibility;

  constructor(scope: Trello.PowerUp.Scope = 'member', visibility: Trello.PowerUp.Visibility = 'private') {
    Object.assign(this, { scope, visibility });
  }

  readById(t: Trello.PowerUp.IFrame, key: string, cardId: string): PromiseLike<any> {
    return t.get(cardId, this.visibility, key);
  }

  read(t: Trello.PowerUp.IFrame, key: string): PromiseLike<any> {
    return t.get(this.scope, this.visibility, key);
  }

  write(t: Trello.PowerUp.IFrame, key: string, value: any): PromiseLike<void> {
    return t.set(this.scope, this.visibility, key, value);
  }

  writeMultiple(t: Trello.PowerUp.IFrame, entries: {
    [ key: string]: any;
  }): PromiseLike<void> {
    return t.set(this.scope, this.visibility, entries);
  }

  delete(t: Trello.PowerUp.IFrame, key: string): PromiseLike<void> {
    return t.remove(this.scope, this.visibility, key);
  }

  deleteMultiple(t: Trello.PowerUp.IFrame, entries: string[]): PromiseLike<void> {
    return t.remove(this.scope, this.visibility, entries);
  }

  deleteMultipleById(t: Trello.PowerUp.IFrame, entries: string[], cardId: string): PromiseLike<void> {
    return t.remove(cardId, this.visibility, entries);
  }
}

export default Storage;
