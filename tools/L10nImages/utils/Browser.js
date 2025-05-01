const browserstack = require("browserstack-local");
const dateFormat = require("date-format");
const merge = require("deepmerge");
const { remote } = require("webdriverio");

const getLogger = require("./Logger");

const sleep = (ms) =>
  new Promise((resolve) => {
    setTimeout(resolve, ms);
  });
class Browser {
  constructor(browserName, isLocal) {
    this.logger = getLogger();
    this.isLocal = isLocal;

    const localOptions = {
      logLevel: "error",
      capabilities: {
        "moz:firefoxOptions": {
          args: ["-headless"],
          binary: process.env.FIREFOX_BINARY,
        },
      },
    };

    const remoteOptions = {
      logLevel: "error",
      user: process.env.BROWSERSTACK_USER,
      key: process.env.BROWSERSTACK_KEY,
      capabilities: {
        "bstack:options": {
          projectName: "Leaner Coffee - Screenshots",
          sessionName: `Generating Leaner Coffee screenshots in ${browserName}`,
          buildName: dateFormat("yyyy-MM-dd", new Date()),
          local: "true",
          debug: "true",
          video: "false",
          seleniumLogs: "false",
          maskCommands: "setValues",
          resolution: "1680x1050",
          os: "Windows",
          osVersion: "10",
        },
      },
    };

    const commonOptions = {
      waitforTimeout: 10000,
      capabilities: {
        browserName,
        acceptInsecureCerts: true,
      },
    };

    // https://w3c.github.io/webdriver/#capabilities
    this.options = merge(
      commonOptions,
      this.isLocal ? localOptions : remoteOptions,
    );

    if (!this.isLocal) {
      this.setupTunnel();
    }
  }

  async setupTunnel() {
    this.tunnel = new browserstack.Local();
    this.tunnel.start({ key: process.env.BROWSERSTACK_KEY }, async (error) => {
      if (error) {
        this.logger.error("Unable to create a tunnel for BrowserStack");
        await this.close();
        throw new Error(error);
      }
      this.logger.info("BrowserStack tunnel established\n");
    });
  }

  async open() {
    if (!this.isLocal) {
      let attempts = 0;

      while (!this.tunnel.isRunning()) {
        if (attempts === 60) {
          throw new Error(
            "Unable to establish a BrowserStack tunnel after 60 seconds",
          );
        }

        await sleep(1000);
        attempts++;
      }
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
    if (this.remote) {
      await this.remote.deleteSession();
    }

    if (!this.isLocal) {
      return new Promise((resolve, reject) => {
        this.tunnel.stop((error) => {
          if (error) {
            reject(error);
          }
          this.logger.info("BrowserStack tunnel closed");
          resolve();
        });
      });
    }

    return true;
  }
}

module.exports = Browser;
