const fs = require('fs');
const { remote } = require('webdriverio');

const FIREFOX = '/Applications/Firefox.app/Contents/MacOS/firefox-bin';
const FIREFOX_DE = '/Applications/Firefox Developer Edition.app/Contents/MacOS/firefox-bin';

class Browser {
  constructor(browserName) {
    const commonOptions = {
      logLevel: 'warn',
      path: '/',
      waitforTimeout: 10000
    };

    const Browsers = {
      firefox: {
        capabilities: {
          acceptInsecureCerts: true,
          browserName,
          'moz:firefoxOptions': {
            args: ['-headless'],
            binary: Browser.getFirefoxBinaryPath()
          }
        }
      },
      chrome: {
        port: 9515,
        capabilities: {
          browserName,
          chromeOptions: {
            args: ['allow-http-screen-capture', 'headless', 'hide-scrollbars']
          }
        }
      }
    };

    this.options = { ...Browsers[browserName], ...commonOptions };
  }

  static getFirefoxBinaryPath() {
    if (fs.existsSync(FIREFOX_DE)) { return FIREFOX_DE; }
    if (fs.existsSync(FIREFOX)) { return FIREFOX; }

    throw new Error('Unable to find Firefox binary');
  }

  build() {
    return remote(this.options);
  }
}

module.exports = Browser;
