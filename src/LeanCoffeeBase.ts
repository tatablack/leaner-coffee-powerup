import Bluebird from 'bluebird';
import BoardStorage from './storage/BoardStorage';
import CardStorage from './storage/CardStorage';

export interface LeanCoffeeBaseParams {
  w: Window;
  t?: any;
}

export class LeanCoffeeBase {
  w: Window;
  t: any;
  Promise: typeof Bluebird;
  boardStorage: BoardStorage;
  cardStorage: CardStorage;

  constructor({ w, t }: LeanCoffeeBaseParams) {
    this.w = w;
    this.t = t || w.TrelloPowerUp;
    this.Promise = w.TrelloPowerUp.Promise;
    this.boardStorage = new BoardStorage();
    this.cardStorage = new CardStorage();
  }
}
