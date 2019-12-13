import { Trello } from './types/TrelloPowerUp';
import BoardStorage from './storage/BoardStorage';
import CardStorage from './storage/CardStorage';

export interface LeanCoffeeBaseParams {
  w: Window;
  t?: Trello.PowerUp | Trello.PowerUp.IFrame;
}

export class LeanCoffeeBase {
  w: Window;
  boardStorage: BoardStorage;
  cardStorage: CardStorage;

  constructor({ w }: LeanCoffeeBaseParams) {
    this.w = w;
    this.boardStorage = new BoardStorage();
    this.cardStorage = new CardStorage();
  }
}
