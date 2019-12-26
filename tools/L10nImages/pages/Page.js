const getLogger = require('../utils/Logger');

class Page {
  constructor(browser, selectors) {
    this.logger = getLogger();
    Object.assign(this, { browser, selectors });
  }
}

module.exports = Page;
