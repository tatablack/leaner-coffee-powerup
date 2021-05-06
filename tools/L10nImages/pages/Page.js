const getLogger = require('../utils/Logger');

class Page {
  constructor(browser, selectors, level = 'info') {
    this.logger = getLogger(level);
    Object.assign(this, { browser, selectors });
  }
}

module.exports = Page;
