import formatDuration from 'format-duration';

import Discussion from '../Discussion';
import CardStorage from '../storage/CardStorage';
import { BadgeColors } from '../TrelloConstants';


class ElapsedCardBadge {
  DEFAULT_TITLE = '';

  constructor() {
    this.discussion = new Discussion();
    this.cardStorage = new CardStorage();
  }

  async getTitle(t) {
    return this.DEFAULT_TITLE;
  }

  getText = async (t, elapsed) => formatDuration(elapsed);

  getColor = async (t) => {
    const isOngoing = await this.discussion.isOngoingFor(t);

    if (isOngoing) { return BadgeColors.ORANGE; }

    return await this.discussion.isPausedFor(t) ? BadgeColors.YELLOW : BadgeColors.LIGHTGRAY;
  };

  render = async (t) => {
    const elapsed = await this.cardStorage.getDiscussionElapsed(t);
    if (!elapsed) { return null; }

    return {
      title: await this.getTitle(t),
      text: await this.getText(t, elapsed),
      color: await this.getColor(t)
    };
  };
}

export default ElapsedCardBadge;
