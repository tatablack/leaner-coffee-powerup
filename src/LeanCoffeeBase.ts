import BoardStorage from "./storage/BoardStorage";
import CardStorage from "./storage/CardStorage";
import { Trello } from "./types/TrelloPowerUp";

export interface LeanCoffeeBaseParams {
  w: Window;
  config: Config;
  t?: Trello.PowerUp | Trello.PowerUp.IFrame;
}

export class LeanCoffeeBase {
  w: Window;
  boardStorage: BoardStorage;
  cardStorage: CardStorage;
  config: Config;

  constructor({ w, config }: LeanCoffeeBaseParams) {
    this.w = w;
    this.config = config;
    this.boardStorage = new BoardStorage();
    this.cardStorage = new CardStorage();
  }

  isRunningInProduction = (): boolean =>
    (process.env.NODE_ENV as Environment) === "production";
}
