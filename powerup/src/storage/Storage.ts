import { Trello } from "../types/TrelloPowerUp";

class Storage {
  scope: Trello.PowerUp.Scope;
  visibility: Trello.PowerUp.Visibility;

  constructor(
    scope: Trello.PowerUp.Scope = "member",
    visibility: Trello.PowerUp.Visibility = "private",
  ) {
    Object.assign(this, { scope, visibility });
  }

  read(
    t: Trello.PowerUp.AnonymousHostHandlers,
    key: string,
    cardId?: string,
  ): PromiseLike<any> {
    return t.get(cardId ?? this.scope, this.visibility, key);
  }

  write(
    t: Trello.PowerUp.AnonymousHostHandlers,
    key: string,
    value: any,
    cardId?: string,
  ): PromiseLike<void> {
    return t.set(cardId ?? this.scope, this.visibility, key, value);
  }

  writeMultiple(
    t: Trello.PowerUp.AnonymousHostHandlers,
    entries: {
      [key: string]: any;
    },
    cardId?: string,
  ): PromiseLike<void> {
    return t.set(cardId ?? this.scope, this.visibility, entries);
  }

  delete(
    t: Trello.PowerUp.AnonymousHostHandlers,
    key: string,
    cardId?: string,
  ): PromiseLike<void> {
    return t.remove(cardId ?? this.scope, this.visibility, key);
  }

  deleteMultiple(
    t: Trello.PowerUp.AnonymousHostHandlers,
    entries: string[],
    cardId?: string,
  ): PromiseLike<void> {
    return t.remove(cardId ?? this.scope, this.visibility, entries);
  }
}

export default Storage;
