import Trello from './@types/TrelloPowerUp';
import BoardStorage from './storage/BoardStorage';
import CardStorage from './storage/CardStorage';

export interface LeanCoffeeBaseParams {
  w: Window;
  t?: any;
}

export class LeanCoffeeBase {
  w: Window;
  Promise: Trello.Promise<any>;
  boardStorage: BoardStorage;
  cardStorage: CardStorage;

  constructor({ w, t }: LeanCoffeeBaseParams) {
    this.w = w;
    this.Promise = w.TrelloPowerUp.Promise;
    this.boardStorage = new BoardStorage();
    this.cardStorage = new CardStorage();
  }
}
