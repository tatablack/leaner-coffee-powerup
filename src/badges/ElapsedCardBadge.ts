import formatDuration from 'format-duration';

import { BadgeColors } from '../utils/TrelloConstants';
import Bluebird from 'bluebird';

class ElapsedCardBadge implements ElapsedCardBadge {
  EMPTY_TITLE = '';
  discussion: any;

  constructor(discussion) {
    this.discussion = discussion;
    this.render = this.render.bind(this);
  }

  getTitle() {
    return this.EMPTY_TITLE;
  }

  getText = async (t, elapsed): Bluebird<string> => formatDuration(elapsed);

  getColor = async (t): Bluebird<BadgeColors> => {
    const isOngoing = await this.discussion.isOngoingFor(t);

    if (isOngoing) { return 'orange'; }

    return await this.discussion.isPausedFor(t) ? 'yellow' : 'light-gray';
  };


  // Unable to use class properties here because I need to call
  // it from a subclass, and it's currently broken - see:
  // https://github.com/babel/babel/issues/5104
  //
  // Upgrading to Babel 7.x should solve it.
  async render(t) {
    const elapsed = await this.discussion.getElapsed(t);
    if (!elapsed) { return null; }

    return {
      title: this.getTitle(),
      text: await this.getText(t, elapsed),
      color: await this.getColor(t)
    };
  }
}

export default ElapsedCardBadge;
