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
