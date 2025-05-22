import { Trello } from "../types/TrelloPowerUp";
import { ErrorReporterInjector } from "../utils/Errors";
import { bindAll } from "../utils/Scope";

@ErrorReporterInjector
class Storage {
  scope: Trello.PowerUp.Scope;
  visibility: Trello.PowerUp.Visibility;

  constructor(
    scope: Trello.PowerUp.Scope = "member",
    visibility: Trello.PowerUp.Visibility = "private",
  ) {
    Object.assign(this, { scope, visibility });
    bindAll(this);
  }

  canWrite(t: Trello.PowerUp.HostHandlers): boolean {
    return this.scope === "member" || t.memberCanWriteToModel(this.scope);
  }

  static async getMemberType(
    t: Trello.PowerUp.AnonymousHostHandlers,
  ): Promise<string> {
    const board = await t.board("memberships");
    const currentMember = await t.member("id");
    const myMembership = board.memberships.find(
      (m) => m.idMember === currentMember.id,
    );
    return myMembership ? myMembership.memberType : "unknown";
  }

  read<T>(
    t: Trello.PowerUp.HostHandlers | Trello.PowerUp.AnonymousHostHandlers,
    key: string,
    cardId?: string,
  ): PromiseLike<T> {
    return t.get(cardId ?? this.scope, this.visibility, key);
  }

  async write(
    t: Trello.PowerUp.HostHandlers | Trello.PowerUp.AnonymousHostHandlers,
    key: string,
    value: any,
    cardId?: string,
  ): Promise<void> {
    if (!("memberCanWriteToModel" in t)) {
      window.Sentry.addBreadcrumb({
        category: "database",
        message: `Unknown permissions when trying to save "${key}" to the "${this.scope}" ${this.visibility} scope"`,
        level: "warning",
      });
    }

    if (!("memberCanWriteToModel" in t) || this.canWrite(t)) {
      await t.set(cardId ?? this.scope, this.visibility, key, value);
    } else {
      window.Sentry.captureException(new Error("Error while editing scope"), {
        contexts: {
          WriteOperation: {
            scope: this.scope,
            visibility: this.visibility,
            key: key,
            hasCardId: !!cardId,
            memberType: await Storage.getMemberType(t),
          },
        },
      });
    }
  }

  async writeMultiple(
    t: Trello.PowerUp.HostHandlers | Trello.PowerUp.AnonymousHostHandlers,
    entries: {
      [key: string]: any;
    },
    cardId?: string,
  ): Promise<void> {
    if (!("memberCanWriteToModel" in t)) {
      window.Sentry.addBreadcrumb({
        category: "database",
        message: `Unknown permissions when trying to save "${Object.keys(entries).join(", ")}" to the "${this.scope}" ${this.visibility} scope`,
        level: "warning",
      });
    }

    if (!("memberCanWriteToModel" in t) || this.canWrite(t)) {
      await t.set(cardId ?? this.scope, this.visibility, entries);
    } else {
      window.Sentry.captureException(new Error("Error while editing scope"), {
        contexts: {
          WriteOperation: {
            scope: this.scope,
            visibility: this.visibility,
            key: Object.keys(entries),
            hasCardId: !!cardId,
            memberType: await Storage.getMemberType(t),
          },
        },
      });
    }
  }

  async delete(
    t: Trello.PowerUp.HostHandlers | Trello.PowerUp.AnonymousHostHandlers,
    key: string,
    cardId?: string,
  ): Promise<void> {
    if (!("memberCanWriteToModel" in t)) {
      window.Sentry.addBreadcrumb({
        category: "database",
        message: `Unknown permissions when trying to save "${key}" to the "${this.scope}" ${this.visibility} scope"`,
        level: "warning",
      });
    }

    if (!("memberCanWriteToModel" in t) || this.canWrite(t)) {
      return t.remove(cardId ?? this.scope, this.visibility, key);
    } else {
      window.Sentry.captureException(new Error("Error while editing scope"), {
        contexts: {
          DeleteOperation: {
            scope: this.scope,
            visibility: this.visibility,
            key: key,
            hasCardId: !!cardId,
            memberType: await Storage.getMemberType(t),
          },
        },
      });
    }
  }

  async deleteMultiple(
    t: Trello.PowerUp.HostHandlers | Trello.PowerUp.AnonymousHostHandlers,
    entries: string[],
    cardId?: string,
  ): Promise<void> {
    if (!("memberCanWriteToModel" in t)) {
      window.Sentry.addBreadcrumb({
        category: "database",
        message: `Unknown permissions when trying to save "${Object.keys(entries).join(", ")}" to the "${this.scope}" ${this.visibility} scope`,
        level: "warning",
      });
    }

    if (!("memberCanWriteToModel" in t) || this.canWrite(t)) {
      return t.remove(cardId ?? this.scope, this.visibility, entries);
    } else {
      window.Sentry.captureException(new Error("Error while editing scope"), {
        contexts: {
          DeleteOperation: {
            scope: this.scope,
            visibility: this.visibility,
            key: Object.keys(entries),
            hasCardId: !!cardId,
            memberType: await Storage.getMemberType(t),
          },
        },
      });
    }
  }
}

export default Storage;
