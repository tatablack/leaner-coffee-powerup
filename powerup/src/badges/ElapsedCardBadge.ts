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

  // Unable to use class properties here because in subclasses
  // I need to user `super`, and it wouldn't be possible. See:
  // https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Operators/super#accessing_super_in_class_field_declaration
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
