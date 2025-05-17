import formatDuration from "format-duration";

import { LeanCoffeeBaseParams } from "./LeanCoffeeBase";
import { LeanCoffeeIFrame } from "./LeanCoffeeIFrame";
import Analytics from "./utils/Analytics";

enum ThumbDirection {
  "UP" = "UP",
  "DOWN" = "DOWN",
  "MIDDLE" = "MIDDLE",
}

class LeanCoffeeDiscussionUI extends LeanCoffeeIFrame {
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

    this.badges = this.w.document.querySelector(".badges");
    this.badgeElapsed = this.w.document.querySelector(".badge-elapsed");
    this.badgeHeaderStatus = this.w.document.querySelector(
      '[data-i18n-id="discussionUiStatus"]',
    );
    this.badgeHeaderWhatNext = this.w.document.querySelector(
      '[data-i18n-id="discussionUiWhatNext"]',
    );
    this.messageNone = this.w.document.querySelector(
      '[data-i18n-id="discussionUiMessageNone"]',
    );
    this.messageEnded = this.w.document.querySelector(
      '[data-i18n-id="discussionUiMessageEnded"]',
    );
    this.voting = this.w.document.querySelectorAll(".voting");
  }

  init(): void {
    this.w.document
      .querySelector(".voting-up")
      .addEventListener("click", () => this.handleThumbs("UP"));
    this.w.document
      .querySelector(".voting-middle")
      .addEventListener("click", () => this.handleThumbs("MIDDLE"));
    this.w.document
      .querySelector(".voting-down")
      .addEventListener("click", () => this.handleThumbs("DOWN"));

    this.t.render(() => {
      this.t.localizeNode(document.body);
      this.w.setTimeout(() => this.t.sizeTo.call(this.t, "body"), 100);
      this.monitorDiscussion();
      this.w.clearInterval(this.intervalId);
      this.intervalId = this.w.setInterval(this.monitorDiscussion, 1000);
    });
  }

  async monitorDiscussion(): Promise<void> {
    const discussionStatus = await this.cardStorage.getDiscussionStatus(this.t);
    const isOngoingOrPausedForThisCard = ["ONGOING", "PAUSED"].includes(
      discussionStatus,
    );

    if (
      !!discussionStatus &&
      this.previousStatus === discussionStatus &&
      !isOngoingOrPausedForThisCard
    ) {
      return;
    }

    switch (discussionStatus) {
      case "ENDED": {
        // when the discussion ends, hide badge and display a message
        this.toggleBadges(false);
        this.toggleFields(".message", "discussionUiMessageEnded");
        break;
      }
      case "ONGOING": {
        // when discussion is ongoing, update badge (display ongoing and 1-sec res timer)
        if (this.previousStatus !== discussionStatus) {
          this.toggleVoting(false);
          this.toggleBadges(true);
          this.toggleFields(".message", "");

          this.updateStatusHeader("ONGOING");
        }

        this.updateElapsed("ONGOING");
        break;
      }
      case "PAUSED": {
        // when discussion is paused, update the badge (display elapsed and three buttons to deal with discussion)
        if (this.previousStatus !== discussionStatus) {
          this.toggleFields(".message", "");
          this.toggleVoting(true);
          this.toggleBadges(true);
          this.updateStatusHeader("PAUSED");
          this.updateElapsed("PAUSED");
        }

        this.updateThumbs();
        break;
      }
      default:
        this.toggleBadges(false);
        this.toggleVoting(false);
        this.toggleFields(".message", "discussionUiMessageNone");
        break;
    }

    this.previousStatus = discussionStatus;
  }

  async updateElapsed(status: DiscussionStatus): Promise<void> {
    if (status === "ONGOING") {
      const startedAt = await this.boardStorage.getDiscussionStartedAt(this.t);
      const previousElapsed =
        (await this.boardStorage.getDiscussionPreviousElapsed(this.t)) || 0;
      const elapsed = startedAt ? Date.now() - startedAt : 0;
      const formattedTotalElapsed = formatDuration(elapsed + previousElapsed);

      this.badgeElapsed.classList.add(status.toLowerCase());
      this.badgeElapsed.classList.remove("paused");
      this.badgeElapsed.textContent = `${this.t.localizeKey("discussionOngoing")} → ${formattedTotalElapsed}`;
    } else {
      const elapsed = await this.cardStorage.getDiscussionElapsed(this.t);

      this.badgeElapsed.classList.add(status.toLowerCase());
      this.badgeElapsed.classList.remove("ongoing");
      this.badgeElapsed.textContent = `${this.t.localizeKey("discussionElapsed")} → ${formatDuration(elapsed)}`;
    }
  }

  async updateThumbs(): Promise<void> {
    const savedThumbs =
      (await this.cardStorage.getDiscussionThumbs(this.t)) || {};
    const currentMember = this.t.getContext().member;
    const currentMemberThumb = savedThumbs[currentMember];

    Object.keys(ThumbDirection).forEach((thumbType) => {
      const countByThumbType = Object.keys(savedThumbs).filter(
        (memberId) => savedThumbs[memberId] === thumbType,
      ).length;

      const thumbsBadge = this.w.document.querySelector(
        `.voting-${thumbType.toLowerCase()}`,
      ) as HTMLElement;
      thumbsBadge.innerText = countByThumbType.toString();

      if (thumbType === currentMemberThumb) {
        thumbsBadge.classList.add("own");
      } else {
        thumbsBadge.classList.remove("own");
      }
    });
  }

  async handleThumbs(thumb: Thumb): Promise<void> {
    const thumbs = (await this.cardStorage.getDiscussionThumbs(this.t)) || {};
    const currentMember = this.t.getContext().member;

    if (thumbs[currentMember] === thumb) {
      delete thumbs[currentMember];
      await Analytics.event(this.w, "keepDiscussingVoted", {
        outcome: "removed",
        choice: thumb,
      });
    } else {
      thumbs[currentMember] = thumb;
      await Analytics.event(this.w, "keepDiscussingVoted", {
        outcome: "added",
        choice: thumb,
      });
    }

    return this.cardStorage.saveDiscussionThumbs(this.t, thumbs);
  }

  toggleBadges(visible: boolean): void {
    this.badges.style.display = visible ? "grid" : "none";
  }

  toggleVoting = (visible: boolean): void => {
    this.voting.forEach((element) => {
      element.style.visibility = visible ? "visible" : "hidden";
    });
  };

  updateStatusHeader(status: DiscussionStatus): void {
    if (status === "PAUSED") {
      this.toggleFields(".badge-header-text", "discussionUiWhatNext");
    } else {
      this.toggleFields(".badge-header-text", "discussionUiStatus");
    }
  }

  toggleFields(cssSelector: string, key: string): void {
    const elements = this.w.document.querySelectorAll(
      cssSelector,
    ) as NodeListOf<HTMLElement>;

    elements.forEach((message) => {
      const shouldBeDisplayed = message.dataset.i18nId === key;

      message.style.display = shouldBeDisplayed ? "block" : "none";
    });
  }
}

export default LeanCoffeeDiscussionUI;
