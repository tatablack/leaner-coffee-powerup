import BoardStorage from "./storage/BoardStorage";
import CardStorage from "./storage/CardStorage";
import MemberStorage from "./storage/MemberStorage";
import { Trello } from "./types/TrelloPowerUp";
import { ErrorReporterInjector } from "./utils/Errors";
import { bindAll } from "./utils/Scope";

export interface LeanCoffeeBaseParams {
  w: Window;
  config: Config;
  t?: Trello.PowerUp | Trello.PowerUp.IFrame;
}

@ErrorReporterInjector
export class LeanCoffeeBase {
  w: Window;
  boardStorage: BoardStorage;
  cardStorage: CardStorage;
  memberStorage: MemberStorage;
  config: Config;

  constructor({ w, config }: LeanCoffeeBaseParams) {
    this.w = w;
    this.config = config;
    this.boardStorage = new BoardStorage();
    this.cardStorage = new CardStorage();
    this.memberStorage = new MemberStorage();
    bindAll(this);
  }
}
