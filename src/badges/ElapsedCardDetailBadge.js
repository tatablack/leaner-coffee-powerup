import formatDuration from 'format-duration';

import ElapsedCardBadge from './ElapsedCardBadge';


class ElapsedCardDetailBadge extends ElapsedCardBadge {
  getTitle = async t => (await this.discussion.isPausedFor(t) ? 'Should we keep discussing?' : 'Discussion time');

  getText = async (t, elapsed) => {
    const isOngoing = await this.discussion.isOngoingFor(t);
    const isPaused = await this.discussion.isPausedFor(t);

    return (isOngoing ? 'Ongoing → ' : (isPaused ? 'Elapsed → ' : '')) + formatDuration(elapsed);
  };
}

export default ElapsedCardDetailBadge;
