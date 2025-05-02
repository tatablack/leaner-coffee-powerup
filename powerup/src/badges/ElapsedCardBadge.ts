import formatDuration from "format-duration";

import { Trello } from "../types/TrelloPowerUp";
import Discussion from "../utils/Discussion";

class ElapsedCardBadge implements ElapsedCardBadge {
  discussion: Discussion;

  constructor(discussion: Discussion) {
    this.discussion = discussion;
    this.render = this.render.bind(this);
  }

  getText = async (
    t: Trello.PowerUp.IFrame,
    elapsed: number,
  ): Promise<string> => formatDuration(elapsed);

  getColor = async (
    t: Trello.PowerUp.IFrame,
  ): Promise<Trello.PowerUp.Colors> => {
    const isOngoing = await this.discussion.isOngoingFor(t);

    if (isOngoing) {
      return "orange";
    }

    return (await this.discussion.isPausedFor(t)) ? "yellow" : "light-gray";
  };

  // Unable to use class properties here because I need to call
  // it from a subclass, and it's currently broken - see:
  // https://github.com/babel/babel/issues/5104
  //
  // Upgrading to Babel 7.x should solve it.
  // NOTE: CHECK whether this is still relevant for ts-loader
  async render(t: Trello.PowerUp.IFrame): Promise<Trello.PowerUp.CardBadge> {
    const elapsed = await this.discussion.getElapsed(t);
    if (!elapsed) {
      return null;
    }

    return {
      text: await this.getText(t, elapsed),
      color: await this.getColor(t),
    };
  }
}

export default ElapsedCardBadge;
