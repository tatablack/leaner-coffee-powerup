import ElapsedCardBadge from './ElapsedCardBadge';


class ElapsedCardDetailBadge extends ElapsedCardBadge {
    getTitle = async t => (await this.discussion.isPausedFor(t) ? 'Should we keep discussing?' : 'Discussion time');

    getText = async (t, elapsed) => {
      const isOngoing = await this.discussion.isOngoingFor(t);
      return (isOngoing ? 'Ongoing: ' : '') + super.getText(elapsed);
    };
}

export default ElapsedCardDetailBadge;
