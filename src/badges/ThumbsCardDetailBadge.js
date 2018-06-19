import CardStorage from '../storage/CardStorage';
import { Statuses, Thumbs } from '../Discussion';


class ThumbsCardDetailBadge {
  constructor() {
    this.cardStorage = new CardStorage();
  }

  hasThumbed = (t, thumbs, thumbsType) => {
    const currentMember = t.getContext().member;
    return thumbs[currentMember] === thumbsType;
  };

  handleThumbs = async (t, thumbsType) => {
    const thumbs = await this.cardStorage.getDiscussionThumbs(t) || {};
    const currentMember = t.getContext().member;

    thumbs[currentMember] = thumbsType;

    this.cardStorage.saveDiscussionThumbs(t, thumbs);
  };

  static getTitle(thumbsType) {
    switch (true) {
      case thumbsType === Thumbs.UP:
        return 'Yes';
      case thumbsType === Thumbs.MIDDLE:
        return 'Not sure';
      default:
        return 'No';
    }
  }

  render = async (t, thumbsType) => {
    if (await this.cardStorage.getDiscussionStatus(t) !== Statuses.PAUSED) { return null; }

    const thumbs = await this.cardStorage.getDiscussionThumbs(t) || {};
    const count = Object.keys(thumbs).filter(key => thumbs[key] === Thumbs[thumbsType]).length;

    return {
      title: ThumbsCardDetailBadge.getTitle(thumbsType),
      text: count,
      color: this.hasThumbed(t, thumbs, thumbsType) ? 'blue' : null,
      callback: t2 => this.handleThumbs(t2, thumbsType)
    };
  };
}

export default ThumbsCardDetailBadge;
