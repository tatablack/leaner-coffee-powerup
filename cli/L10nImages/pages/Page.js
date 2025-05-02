import getLogger from "../utils/Logger.js";

class Page {
  constructor(browser, selectors, level = "info") {
    this.logger = getLogger(level);
    Object.assign(this, { browser, selectors });
  }
}

export default Page;
