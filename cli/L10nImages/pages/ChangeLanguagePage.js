import Page from "./Page.js";

class ChangeLanguagePage extends Page {
  constructor(browser) {
    super(browser, {
      languageDropdown: '[data-test-selector="subtle-dropdown"] button',
      languageDropdownMenuItems: "span={languageName}",
    });
  }

  async isAvailable() {
    await this.browser.pause(500);
    await this.browser.waitUntil(
      async () => {
        const languageDropdown = await this.browser.$(this.selectors.languageDropdown);
        return (await languageDropdown.getText()) !== undefined;
      },
      5000,
      "Expected preferences page to be fully loaded after 5s",
    );
  }

  async open() {
    this.browser.url("https://id.atlassian.com/manage-profile/account-preferences/");
    await this.isAvailable();
  }

  async getCurrentLanguage() {
    const languageDropdown = await this.browser.$(this.selectors.languageDropdown);
    return languageDropdown.getText();
  }

  async switchLanguageTo(languageName) {
    this.logger.info("┌ Initiating language switch");
    const currentLanguage = this.getCurrentLanguage();

    if (currentLanguage === languageName) {
      this.logger.info(`└ Aborted - the current language is already ${languageName}\n`);
      return;
    }

    const languageDropdown = await this.browser.$(this.selectors.languageDropdown);
    await languageDropdown.click();

    const languageDropdownMenuItem = await this.browser.$(
      this.selectors.languageDropdownMenuItems.replace("{languageName}", languageName),
    );
    await languageDropdownMenuItem.click();
    this.logger.info(`└ Done - switched to ${languageName}\n`);
    await this.isAvailable();
  }
}

export default ChangeLanguagePage;
