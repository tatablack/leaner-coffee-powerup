import formatDuration from 'format-duration';
import { Trello } from './types/TrelloPowerUp';

import { LeanCoffeeBase, LeanCoffeeBaseParams } from './LeanCoffeeBase';
import { I18nConfig } from './utils/I18nConfig';

enum ThumbDirection {
  'UP' = 'UP',
  'DOWN' = 'DOWN',
  'MIDDLE' = 'MIDDLE'
}

class LeanCoffeeDiscussionUI extends LeanCoffeeBase {
  t: Trello.PowerUp.IFrame;
  badges: HTMLElement;
  badgeElapsed: HTMLElement;
  badgeHeaderStatus: HTMLElement;
  badgeHeaderWhatNext: HTMLElement;
  messageNone: HTMLElement;
  messageEnded: HTMLElement;
  voting: NodeListOf<HTMLElement>;
  intervalId: number;
  previousStatus: DiscussionStatus;

  constructor({ w, config }: LeanCoffeeBaseParams) {
    super({ w, config });
    this.t = w.TrelloPowerUp.iframe({ localization: I18nConfig });

    this.badges = this.w.document.querySelector('.badges');
    this.badgeElapsed = this.w.document.querySelector('.badge-elapsed');
    this.badgeHeaderStatus = this.w.document.querySelector('[data-i18n-id="discussionUiStatus"]');
    this.badgeHeaderWhatNext = this.w.document.querySelector('[data-i18n-id="discussionUiWhatNext"]');
    this.messageNone = this.w.document.querySelector('[data-i18n-id="discussionUiMessageNone"]');
    this.messageEnded = this.w.document.querySelector('[data-i18n-id="discussionUiMessageEnded"]');
    this.voting = this.w.document.querySelectorAll('.voting');
  }

  init(): void {
    this.w.document.querySelector('.voting-up').addEventListener(
      'click', () => this.handleThumbs('UP')
    );
    this.w.document.querySelector('.voting-middle').addEventListener(
      'click', () => this.handleThumbs('MIDDLE')
    );
    this.w.document.querySelector('.voting-down').addEventListener(
      'click', () => this.handleThumbs('DOWN')
    );
    this.monitorDiscussion();
    this.intervalId = this.w.setInterval(this.monitorDiscussion, 1000);

    this.t.render(() => {
      this.t.localizeNode(document.body);
      this.t.sizeTo('body');
    });
  }

  monitorDiscussion = async (): Promise<void> => {
    const discussionStatus = await this.cardStorage.getDiscussionStatus(this.t);
    const isOngoingOrPausedForThisCard = ['ONGOING', 'PAUSED'].includes(discussionStatus);

    if (!!discussionStatus && this.previousStatus === discussionStatus && !isOngoingOrPausedForThisCard) {
      return;
    }

    switch (discussionStatus) {
      case 'ENDED': {
        // when discussion ends, hide badge and display message
        this.toggleBadges(false);
        this.toggleFields('.message', 'discussionUiMessageEnded');
        break;
      } case 'ONGOING': {
        // when discussion is ongoing, update badge (display ongoing and 1-sec res timer)
        if (this.previousStatus !== discussionStatus) {
          this.toggleVoting(false);
          this.toggleBadges(true);
          this.toggleFields('.message', '');

          this.updateStatusHeader('ONGOING');
        }

        this.updateElapsed('ONGOING');
        break;
      } case 'PAUSED': {
        // when discussion is paused, update badge (display elapsed and three buttons to deal with discussion)
        if (this.previousStatus !== discussionStatus) {
          this.toggleFields('.message', '');
          this.toggleVoting(true);
          this.toggleBadges(true);
          this.updateStatusHeader('PAUSED');
          this.updateElapsed('PAUSED');
        }

        this.updateThumbs();
        break;
      } default:
        this.toggleBadges(false);
        this.toggleVoting(false);
        this.toggleFields('.message', 'discussionUiMessageNone');
        break;
    }

    this.previousStatus = discussionStatus;
    try {
      await this.t.sizeTo('body');
    } catch (err) {
      console.log(err);
    }
  };

  updateElapsed = async (status: DiscussionStatus): Promise<void> => {
    if (status === 'ONGOING') {
      const startedAt = await this.boardStorage.getDiscussionStartedAt(this.t);
      const previousElapsed = await this.boardStorage.getDiscussionPreviousElapsed(this.t) || 0;
      const elapsed = startedAt ? Date.now() - startedAt : 0;
      const formattedTotalElapsed = formatDuration(elapsed + previousElapsed);

      this.badgeElapsed.classList.add(status.toLowerCase());
      this.badgeElapsed.classList.remove('paused');
      this.badgeElapsed.textContent = `${this.t.localizeKey('discussionOngoing')} → ${formattedTotalElapsed}`;
    } else {
      const elapsed = await this.cardStorage.getDiscussionElapsed(this.t);

      this.badgeElapsed.classList.add(status.toLowerCase());
      this.badgeElapsed.classList.remove('ongoing');
      this.badgeElapsed.textContent = `${this.t.localizeKey('discussionElapsed')} → ${formatDuration(elapsed)}`;
    }
  };

  updateThumbs = async (): Promise<void> => {
    const savedThumbs = await this.cardStorage.getDiscussionThumbs(this.t) || {};
    const currentMember = this.t.getContext().member;
    const currentMemberThumb = savedThumbs[currentMember];

    Object.keys(ThumbDirection).forEach((thumbType) => {
      const countByThumbType = Object.keys(savedThumbs).filter(
        (memberId) => savedThumbs[memberId] === thumbType
      ).length;

      const thumbsBadge = this.w.document.querySelector(`.voting-${thumbType.toLowerCase()}`) as HTMLElement;
      thumbsBadge.innerText = countByThumbType.toString();

      if (thumbType === currentMemberThumb) {
        thumbsBadge.classList.add('own');
      } else {
        thumbsBadge.classList.remove('own');
      }
    });
  };

  handleThumbs = async (thumb: Thumb): Promise<void> => {
    const thumbs = await this.cardStorage.getDiscussionThumbs(this.t) || {};
    const currentMember = this.t.getContext().member;

    if (thumbs[currentMember] === thumb) {
      delete thumbs[currentMember];
    } else {
      thumbs[currentMember] = thumb;
    }

    return this.cardStorage.saveDiscussionThumbs(this.t, thumbs);
  };

  toggleBadges = (visible: boolean): void => {
    this.badges.style.display = visible ? 'grid' : 'none';
  };


  toggleVoting = (visible: boolean): void => {
    this.voting.forEach((element) => {
      element.style.visibility = visible ? 'visible' : 'hidden';
    });
  };

  updateStatusHeader = (status: DiscussionStatus): void => {
    if (status === 'PAUSED') {
      this.toggleFields('.badge-header-text', 'discussionUiWhatNext');
    } else {
      this.toggleFields('.badge-header-text', 'discussionUiStatus');
    }
  };

  toggleFields = (clazz: string, key: string): void => {
    const elements = this.w.document.querySelectorAll(clazz) as NodeListOf<HTMLElement>;

    elements.forEach((message) => {
      const shouldBeDisplayed = message.dataset.i18nId === key;
      // eslint-disable-next-line no-param-reassign
      message.style.display = shouldBeDisplayed ? 'block' : 'none';
    });
  };
}

export default LeanCoffeeDiscussionUI;
