import Trello from "../types/trellopowerup/index";
import { Scope, Visibility } from "../types/trellopowerup/lib/hosthandlers";
import { ErrorReporterInjector } from "../utils/Errors";
import { bindAll } from "../utils/Scope";

type StorageMethodNames = "set" | "remove";

// Define parameter types for each method overload explicitly
type StorageMethodParameters<T extends StorageMethodNames> = T extends "set"
  ?
      | [scope: Scope | string, visibility: Visibility, key: string, value: unknown]
      | [scope: Scope | string, visibility: Visibility, entries: { [key: string]: unknown }]
  : T extends "remove"
    ?
        | [scope: Scope | string, visibility: Visibility, key: string]
        | [scope: Scope | string, visibility: Visibility, entries: string[]]
    : never;

@ErrorReporterInjector
class Storage {
  scope: Trello.PowerUp.Scope;
  visibility: Trello.PowerUp.Visibility;

  constructor(scope: Trello.PowerUp.Scope = "member", visibility: Trello.PowerUp.Visibility = "private") {
    Object.assign(this, { scope, visibility });
    bindAll(this);
  }

  static async getMemberType(t: Trello.PowerUp.AnonymousHostHandlers): Promise<string> {
    const board = await t.board("memberships");
    const currentMember = await t.member("id");
    const myMembership = board.memberships.find((m) => m.idMember === currentMember.id);
    return myMembership ? myMembership.memberType : "unknown";
  }

  async read<T>(
    t: Trello.PowerUp.HostHandlers | Trello.PowerUp.AnonymousHostHandlers,
    key: string,
    cardId?: string,
  ): Promise<T> {
    return await t.get(cardId ?? this.scope, this.visibility, key);
  }

  async execute<T extends StorageMethodNames>(
    t: Trello.PowerUp.HostHandlers,
    method: T,
    ...args: StorageMethodParameters<T>
  ): Promise<void> {
    try {
      return await (t[method] as any)(...args);
    } catch (error) {
      const context = t.getContext();
      const errorMessage = error instanceof Error ? error.message : error.toString();

      window.Sentry.captureException(new Error("Error while editing scope: " + errorMessage), {
        contexts: {
          WriteOperation: {
            scope: this.scope,
            visibility: this.visibility,
            memberType: await Storage.getMemberType(t),
            permissions: context.permissions,
          },
        },
      });
    }
  }

  async write(t: Trello.PowerUp.HostHandlers, key: string, value: any, cardId?: string): Promise<void> {
    await this.execute<"set">(t, "set", cardId ?? this.scope, this.visibility, key, value);
  }

  async writeMultiple(
    t: Trello.PowerUp.HostHandlers,
    entries: {
      [key: string]: any;
    },
    cardId?: string,
  ): Promise<void> {
    await this.execute<"set">(t, "set", cardId ?? this.scope, this.visibility, entries);
  }

  async delete(t: Trello.PowerUp.HostHandlers, key: string, cardId?: string): Promise<void> {
    await this.execute<"remove">(t, "remove", cardId ?? this.scope, this.visibility, key);
  }

  async deleteMultiple(t: Trello.PowerUp.HostHandlers, entries: string[], cardId?: string): Promise<void> {
    await this.execute<"remove">(t, "remove", cardId ?? this.scope, this.visibility, entries);
  }
}

export default Storage;
