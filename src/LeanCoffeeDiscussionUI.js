import formatDuration from 'format-duration';

import BoardStorage from './storage/BoardStorage';
import CardStorage from './storage/CardStorage';
import { Statuses, Thumbs } from './utils/Discussion';

const MESSAGES = {
  NONE: 'This card is not being discussed at the moment.',
  ENDED: 'The discussion on this card has ended.'
};


class LeanCoffeeDiscussionUI {
  constructor(window) {
    this.w = window;
    this.t = window.TrelloPowerUp.iframe();
    this.Promise = window.TrelloPowerUp.Promise;
    this.boardStorage = new BoardStorage();
    this.cardStorage = new CardStorage();

    this.badges = this.w.document.querySelector('.badges');
    this.badgeElapsed = this.w.document.querySelector('.badge-elapsed');
    this.badgeHeaderElapsed = this.w.document.querySelector('.badge-header-elapsed');
    this.message = this.w.document.querySelector('.message');
    this.voting = this.w.document.querySelectorAll('.voting');
  }

  async init() {
    this.monitorDiscussion();
    this.intervalId = setInterval(this.monitorDiscussion, 1000);
  }

  monitorDiscussion = async () => {
    const discussionStatus = await this.cardStorage.getDiscussionStatus(this.t);
    const isOngoingOrPausedForThisCard = [Statuses.ONGOING, Statuses.PAUSED].includes(discussionStatus);

    if (!!discussionStatus && this.previousStatus === discussionStatus && !isOngoingOrPausedForThisCard) {
      return;
    }

    switch (discussionStatus) {
      case Statuses.ENDED: {
        // when discussion ends, hide badge and display message
        this.toggleBadges(false);
        this.updateMessage(MESSAGES.ENDED);
        break;
      } case Statuses.ONGOING: {
        // when discussion is ongoing, update badge (display ongoing and 1-sec res timer)
        if (this.previousStatus !== discussionStatus) {
          this.toggleVoting(false);
          this.toggleBadges(true);
          this.updateMessage('');

          this.updateStatusHeader(Statuses.ONGOING);
        }

        this.updateElapsed(Statuses.ONGOING);
        break;
      } case Statuses.PAUSED: {
        // when discussion is paused, update badge (display elapsed and three buttons to deal with discussion)
        if (this.previousStatus !== discussionStatus) {
          this.updateMessage('');
          this.toggleVoting(true);
          this.toggleBadges(true);
          this.updateStatusHeader(Statuses.PAUSED);
          this.updateElapsed(Statuses.PAUSED);
        }

        this.updateThumbs();
        break;
      } default:
        this.toggleBadges(false);
        this.toggleVoting(false);
        this.updateMessage(MESSAGES.NONE);
        break;
    }

    this.previousStatus = discussionStatus;
  };

  updateElapsed = async (status) => {
    if (status === Statuses.ONGOING) {
      const startedAt = await this.boardStorage.getDiscussionStartedAt(this.t);
      const previousElapsed = await this.boardStorage.getDiscussionPreviousElapsed(this.t) || 0;
      const elapsed = startedAt ? Date.now() - startedAt : 0;

      this.badgeElapsed.classList.add(status.toLowerCase());
      this.badgeElapsed.classList.remove(Statuses.PAUSED.toLowerCase());
      this.badgeElapsed.textContent = `Ongoing → ${formatDuration(elapsed + previousElapsed)}`;
    } else {
      const elapsed = await this.cardStorage.getDiscussionElapsed(this.t);

      this.badgeElapsed.classList.add(status.toLowerCase());
      this.badgeElapsed.classList.remove(Statuses.ONGOING.toLowerCase());
      this.badgeElapsed.textContent = `Elapsed → ${formatDuration(elapsed)}`;
    }
  };

  updateStatusHeader = (status) => {
    if (status === Statuses.PAUSED) {
      this.badgeHeaderElapsed.innerText = 'Should we keep discussing?';
    } else {
      this.badgeHeaderElapsed.innerText = 'Status';
    }
  };

  updateThumbs = async () => {
    const thumbs = await this.cardStorage.getDiscussionThumbs(this.t) || {};
    const currentMember = this.t.getContext().member;
    const currentMemberThumbs = thumbs[currentMember];

    Object.keys(Thumbs).forEach((thumbsType) => {
      const count = Object.keys(thumbs).filter((key) => thumbs[key] === Thumbs[thumbsType]).length;
      const thumbsBadge = this.w.document.querySelector(`.voting-${thumbsType.toLowerCase()}`);
      thumbsBadge.innerText = count;

      if (thumbsType === currentMemberThumbs) {
        thumbsBadge.classList.add('own');
      } else {
        thumbsBadge.classList.remove('own');
      }
    });
  };

  handleThumbs = async (thumbsType) => {
    const thumbs = await this.cardStorage.getDiscussionThumbs(this.t) || {};
    const currentMember = this.t.getContext().member;

    if (thumbs[currentMember] === thumbsType) {
      delete thumbs[currentMember];
    } else {
      thumbs[currentMember] = thumbsType;
    }

    this.cardStorage.saveDiscussionThumbs(this.t, thumbs);
  };

  toggleBadges = (visible) => {
    this.badges.style.display = visible ? 'grid' : 'none';
  };

  toggleVoting = (visible) => {
    this.voting.forEach((element) => {
      element.style.visibility = visible ? 'visible' : 'hidden';
    });
  };

  updateMessage = (message) => {
    this.message.innerText = message;
    this.message.style.display = 'block';
    this.t.sizeTo('body');
  };
}

export default LeanCoffeeDiscussionUI;
