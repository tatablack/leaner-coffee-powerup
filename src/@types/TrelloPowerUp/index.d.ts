// Type definitions for the Trello PowerUp Client v1.20.9
// Definitions by: Angelo Tata https://github.com/tatablack/

import { Bluebird } from 'bluebird';

declare global {
  interface Window {
    TrelloPowerUp: TrelloPowerUp;
  }
}

declare namespace Trello {
  type Promise<R> = Bluebird<R>;
  type CallbackCacheAction = 'run' | 'retain' | 'release';
  type CallbackSerializeResult = {
    _callback: string;
  }

  interface CallbackCacheOptions {
    action: CallbackCacheAction;
    options: any;
    callback: string;
  }

  // TODO: dei parametri 't' dovrei poter trovare il tipo
  interface CallbackCache {
    callback(t: any, options: CallbackCacheOptions, serializeResult): Trello.Promise;
    serialize(fx: (t: any, args: any) => any): CallbackSerializeResult;
    reset(): void;
  }

  interface TrelloIFrameOptions {
    context?: string;
    secret?: string;
  }

  interface HostHandlers {
    getContext(): any;
    sizeTo(arg: string | number | Element): any;
  }

  interface TrelloIFrame extends HostHandlers {
    io: any | null;
    args: any[];
    secret?: string;
    options: TrelloIFrameOptions;
    i18nPromise: Trello.Promise<void>;
  }

  interface TrelloPlugin {
    connect(): any; // return an instance of PostMessageIO
    request(): any; //  // return PostMessageIO.request, whatever that is
    init(): any; // return an instance of PostMessageIO
    NotHandled(): any; // return PostMessageIO.NotHandled, whatever that is
  }

  interface TrelloUtil {
    color: {
      getHexString(): string;
      namedColorStringToHex(): string;
    };

    convert: {
      bytesToHexString(): string;
      hexStringToUint8Array(): any;
    };

    crypto: {
      decryptSecret(): any;
      encryptSecret(): any;
      exportAESCBCKeyToRaw(): any;
      generateAESCBCKey(): any;
      generateInitVector(): any;
      importAESCBCKeyFromRaw(): any;
      sha256Digest(): any;
    };

    initLocalizer(locale: string, options: LocalizerOptions): Trello.Promise<void>;
    makeErrorEnum(): makeError.Constructor<T & makeError.BaseError>;
    relativeUrl(url: string): string;
  }

  type ResourceDictionary = {
    [key: string]: string;
  }

  interface Localizer {
    resourceDictionary: ResourceDictionary;
    localize(key: string, args: string[]): string;
  }

  interface LocalizerOptions {
    localizer?: Localizer;
    loadLocalizer?(): Trello.Promise<Localizer>;
    localization?: {
      defaultLocale: string;
      supportedLocales: string[];
      resourceUrl: string;
    };
  }

  interface TrelloPowerUp {
    version: string;
    Promise: Trello.Promise;
    CallbackCache: CallbackCache;
    PostMessageIO: PostMessageIO;
    iframe(options?: TrelloIFrameOptions): TrelloIFrame;
    initialize(handlers: Handlers, options?): TrelloPlugin | TrelloIFrame;
    restApiError();
    util: TrelloUtil;
  }

  interface Handlers {
    [key: Handler]: () => any;
  };

  type Handler = 'attachment-sections' | 'attachment-thumbnail' | 'board-buttons' |
                 'card-back-section' | 'card-badfes' | 'card-buttons' |
                 'card-detail-badges' | 'card-from-url' | 'format-url' |
                 'list-actions' | 'list-sorters' | 'on-enable' |
                 'on-disable' | 'remove-data' | 'show-settings' |
                 'authorization-status' | 'show-authorization';

  type StorageScope = 'board' | 'card' | 'member' | 'organization';

  type StorageVisibility = 'shared' | 'private';

  type TrelloColors = 'blue' | 'green' | 'orange' | 'red' | 'yellow' |
    'purple' | 'pink' | 'sky' | 'lime' | 'light-gray';

  interface CardBadge {
    dynamic?(): CardBadge;
    text?: string;
    icon?: string;
    color?: TrelloColors;
    refresh?: number;
  }

  interface CardDetailBadge extends CardBadge {
    title: string;
    callback?(t: any, opts: any): void;
    url?: string;
    target?: string;
  }

  interface AttachmentsByType {
    [key: string]: {
      board: number;
      card: number;
    };
  }

  interface Preview {
    bytes: number;
    height: number;
    scaled: boolean;
    url: string;
    width: number;
  }

  interface Attachment {
    date: string;
    edgeColor: string;
    id: string;
    idMember: string;
    name: string;
    previews: Preview[];
    url: string;
  }

  interface BadgesInfo {
    attachments: number;
    attachmentsByType: AttachmentsByType;
    checkItems: number;
    checkItemsChecked: number;
    comments: number;
    description: boolean;
    due: string; // timestamp
    dueComplete: boolean;
    fogbugz: string;
    location: boolean;
    subscribed: boolean;
    viewingMemberVoted: boolean;
    votes: number;
  }

  interface Coordinates {
    latitude: number;
    longitude: number;
  }

  interface Label {
    id: string;
    name: string;
    color: TrelloColors;
  }

  interface Member {
    id: string;
    fullName: string | null;
    username: string | null;
    initials: string | null;
    avatar: string | null;
  }

  interface CustomField {
    id: string;
    idCustomField: string;
    idValue?: string;
    value?: CustomFieldValue;
  }

  interface CustomFieldValue {
    checked?: string;
    date?: string;
    text?: string;
    number?: string;
  }

  interface Card {
    address: string | null;
    attachments: Attachment[];
    badges: BadgesInfo;
    closed: boolean;
    coordinates: Coordinates | null;
    cover: Attachment | null;
    customFieldItems: CustomField[];
    dateLastActivity: string; // "2019-11-28T15:53:19.709Z"
    desc: string;
    due: string | null; // "2019-11-28T15:53:19.709Z"
    dueComplete: boolean;
    id: string;
    idList: string;
    idShort: number;
    labels: Label[];
    locationName: string | null;
    members: Member[];
    name: string;
    pos: number;
    shortLink: string;
    url: string; // https://trello.com/c/I5nAdteE/9-test
  }

  interface Popup {
    text: string;
    callback?: void;
  }
}

export default Trello;
