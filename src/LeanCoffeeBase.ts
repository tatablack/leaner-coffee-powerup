import { Trello } from './types/TrelloPowerUp';
import BoardStorage from './storage/BoardStorage';
import CardStorage from './storage/CardStorage';

export interface LeanCoffeeBaseParams {
  w: Window;
  config: Config;
  t?: Trello.PowerUp | Trello.PowerUp.IFrame;
}

export class LeanCoffeeBase {
  w: Window;
  boardStorage: BoardStorage;
  cardStorage: CardStorage;
  supportedLocales: string[];
  localization: Trello.PowerUp.Localization;

  constructor({ w, config }: LeanCoffeeBaseParams) {
    this.w = w;
    this.boardStorage = new BoardStorage();
    this.cardStorage = new CardStorage();

    const { supportedLocales } = config[process.env.NODE_ENV as Environment];
    this.supportedLocales = supportedLocales;
    this.localization = {
      defaultLocale: 'en',
      supportedLocales: this.supportedLocales,
      resourceUrl: '/i18n/{locale}.json'
    };
  }
}
