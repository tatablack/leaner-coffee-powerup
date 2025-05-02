const Page = require("./Page");

const sleep = (ms) =>
  new Promise((resolve) => {
    setTimeout(resolve, ms);
  });

class LoginPage extends Page {
  constructor(browser) {
    super(browser, {
      username: "#user",
      password: "#password",
      loginButton: "#login",
      atlassianLoginButton: "#login-submit",
      boardsMenuButton: '[data-test-id="header-boards-menu-button"]',
    });
  }

  open() {
    return this.browser.url("https://trello.com/login");
  }

  async login(username, password) {
    this.logger.info("┌ Initiating login process");
    const usernameField = await this.username;
    await usernameField.setValue(username);

    this.logger.info("├ Setting username");
    await sleep(2000);

    const loginBtn = await this.loginButton;
    await loginBtn.click();

    const passwordField = await this.password;
    await passwordField.setValue(password);

    this.logger.info("├ Setting password");

    const atlassianLoginBtn = await this.atlassianLoginButton;
    await atlassianLoginBtn.click();

    this.logger.info(`└ Done - logged in as ${username}\n`);
    const boardsMenuButton = await this.boardsMenuButton;
    await boardsMenuButton.waitForClickable();
  }

  get username() {
    return this.browser.$(this.selectors.username);
  }

  get password() {
    return this.browser.$(this.selectors.password);
  }

  get loginButton() {
    return this.browser.$(this.selectors.loginButton);
  }

  get atlassianLoginButton() {
    return this.browser.$(this.selectors.atlassianLoginButton);
  }

  get boardsMenuButton() {
    return this.browser.$(this.selectors.boardsMenuButton);
  }
}

module.exports = LoginPage;
