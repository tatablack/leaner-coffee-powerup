export type StorageScope = 'board' | 'card' | 'member' | 'organization';

export type StorageVisibility = 'shared' | 'private';

export type BadgeColors = 'blue' | 'green' | 'orange' | 'red' | 'yellow' |
                          'purple' | 'pink' | 'sky' | 'lime' | 'light-gray';

export interface CardBadge {
  dynamic?(): CardBadge;
  text?: string;
  icon?: string;
  color?: BadgeColors;
  refresh?: number;
}

export interface CardDetailBadge extends CardBadge {
  title: string;
  callback?(t: any, opts: any): void;
  url?: string;
  target?: string;
}
