const Page = require('./Page');

class LoginPage extends Page {
  constructor(browser) {
    super(browser, {
      username: '#user',
      password: '#password',
      loginButton: '#login',
      boardsMenuButton: '[data-test-id="header-boards-menu-button"]'
    });
  }

  open() {
    return this.browser.url('https://trello.com/login');
  }

  async login(username, password) {
    const usernameField = await this.username;
    const passwordField = await this.password;

    await usernameField.setValue(username);
    await passwordField.setValue(password);

    const loginBtn = await this.loginButton;
    await loginBtn.click();

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

  get boardsMenuButton() {
    return this.browser.$(this.selectors.boardsMenuButton);
  }
}

module.exports = LoginPage;
