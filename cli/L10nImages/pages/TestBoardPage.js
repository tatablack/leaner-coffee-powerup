import snakeCase from "just-snake-case";

import Page from "./Page.js";

class TestBoardPage extends Page {
  constructor(browser) {
    super(
      browser,
      {
        closeCardButton: ".js-close-window",
        cardBadgeVote: ".js-list:nth-child(1) > div",
        cardBadgeElapsed: ".js-list:nth-child(2) > div",
        cardBackSectionOngoing: ".js-plugin-card-back-sections",
        cardBackSectionPaused: ".js-plugin-card-back-sections",
        powerUpButtons: ".js-button-list",
        discussionButton: ".js-button-list > .card-plugin-btn > .button-link",
        startOrPauseButton: ".pop-over-list.js-list > li:first-child",
        stopButton: ".pop-over-list.js-list > li:nth-child(2)",
      },
      "info",
    );
  }

  async isAvailable() {
    await this.browser.pause(500);
    await this.browser.waitUntil(
      async () => {
        const text = await (
          await this.browser.$(this.selectors.cardBadgeVote)
        ).getText();
        return text.length > "Life, the Universe and Everything".length;
      },
      20000,
      "Expected powerup to be fully loaded after 10s",
    );
  }

  async open() {
    this.browser.url("https://trello.com/b/6FGJ2zCC/test-powerup");
    // The double load is meant to ensure the new language is picked up
    this.browser.url("https://trello.com/b/6FGJ2zCC/test-powerup");
    await this.isAvailable();
  }

  async takeAllScreenshotsFor(languageCode) {
    this.logger.info({
      label: languageCode,
      message: "┌ Initiating screenshots",
    });
    await this.hideAddCardButton();

    await this.saveScreenshotFor("cardBadgeVote", languageCode);
    await this.saveScreenshotFor("cardBadgeElapsed", languageCode);

    await this.clickOn("cardBadgeElapsed");
    await this.saveScreenshotFor("powerUpButtons", languageCode);

    await this.clickOn("discussionButton");
    await this.clickOn("startOrPauseButton");
    await this.saveScreenshotFor("cardBackSectionOngoing", languageCode);

    await this.clickOn("discussionButton");
    await this.clickOn("startOrPauseButton");
    await this.saveScreenshotFor("cardBackSectionPaused", languageCode);

    await this.clickOn("discussionButton");
    await this.clickOn("stopButton");
    await this.clickOn("closeCardButton");

    this.logger.info({
      label: languageCode,
      message: `└ Done - all assets saved in ./assets/listings/${languageCode}/\n`,
    });
  }

  async hideAddCardButton() {
    return this.browser.executeScript(
      'document.querySelectorAll(".js-card-composer-container").forEach((button) => button.style.display = "none")',
      [],
    );
  }

  async clickOn(selector) {
    this.logger.debug(
      `├─ Waiting for ${this.selectors[selector]} to be found...`,
    );
    const element = await this.browser.$(this.selectors[selector]);
    this.logger.debug("├─ element found...");
    await element.waitForDisplayed();
    await element.click();
    this.logger.debug(`├─ clicked on ${selector}.`);
    await this.browser.pause(3000);
  }

  async saveScreenshotFor(elementName, languageCode) {
    this.logger.info({
      label: languageCode,
      message: `├ Saving screenshot for ${elementName}`,
    });
    const element = await this.browser.$(this.selectors[elementName]);
    this.logger.debug(
      `├─ waiting for ${this.selectors[elementName]} to be displayed...`,
    );
    await element.waitForDisplayed();
    this.logger.debug("├─ element found...");

    await this.browser.pause(3000);
    await element.saveScreenshot(
      `./assets/listings/${languageCode}/${snakeCase(elementName)}.png`,
    );
    this.logger.debug("├─ ...done.");
  }
}

export default TestBoardPage;
