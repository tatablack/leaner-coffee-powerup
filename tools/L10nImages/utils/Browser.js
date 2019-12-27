const { remote } = require('webdriverio');
const dateFormat = require('date-format');
const merge = require('deepmerge');
const browserstack = require('browserstack-local');

const getLogger = require('./Logger');

const sleep = (ms) => new Promise((resolve) => { setTimeout(resolve, ms); });

const Browsers = {
  Firefox: {
    capabilities: {
      browser_version: '71.0',
      os: 'Windows',
      os_version: '10'
    }
  }
};

class Browser {
  constructor(browserName) {
    this.logger = getLogger();

    const commonOptions = {
      logLevel: 'error',
      waitforTimeout: 10000,
      // hostname: `${process.env.BROWSERSTACK_USER}:${process.env.BROWSERSTACK_KEY}@hub-cloud.browserstack.com`,
      user: process.env.BROWSERSTACK_USER,
      key: process.env.BROWSERSTACK_KEY,
      capabilities: {
        name: `Generating Leaner Coffee screenshots in ${browserName}`,
        browserName,
        acceptSslCerts: true,
        resolution: '1680x1050',
        'bstack:options': {
          projectName: 'Leaner Coffee - Screenshots',
          buildName: dateFormat('yyyy-MM-dd', new Date()),
          local: 'true',
          debug: 'true',
          video: 'false',
          seleniumLogs: 'false',
          maskCommands: 'setValues'
        }
      }
    };

    this.options = merge(commonOptions, Browsers[browserName]);
    this.setupTunnel();
  }

  async setupTunnel() {
    this.tunnel = new browserstack.Local();
    this.tunnel.start(
      { key: process.env.BROWSERSTACK_KEY },
      async (error) => {
        if (error) {
          this.logger.error('Unable to create a tunnel for BrowserStack');
          await this.close();
          throw new Error(error);
        }
        this.logger.info('BrowserStack tunnel established\n');
      }
    );
  }

  async open() {
    let attempts = 0;

    while (!this.tunnel.isRunning()) {
      if (attempts === 60) { throw new Error('Unable to establish a BrowserStack tunnel after 60 seconds'); }

      // eslint-disable-next-line no-await-in-loop
      await sleep(1000);
      attempts++;
    }

    try {
      this.remote = await remote(this.options);
    } catch (err) {
      await this.close();
      this.logger.error(err);
    }

    return this.remote;
  }

  async close() {
    if (this.remote) { await this.remote.deleteSession(); }

    return new Promise((resolve, reject) => {
      this.tunnel.stop((error) => {
        if (error) { reject(error); }
        this.logger.info('BrowserStack tunnel closed');
        resolve();
      });
    });
  }
}

module.exports = Browser;
