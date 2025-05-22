import path from "node:path";

import yargs from "yargs";

import ChangeLanguagePage from "./pages/ChangeLanguagePage.js";
import LoginPage from "./pages/LoginPage.js";
import TestBoardPage from "./pages/TestBoardPage.js";
import Browser from "./utils/Browser.js";
import getLogger from "./utils/Logger.js";
import SupportedLanguages from "./utils/SupportedLanguages.js";

const logger = getLogger();

const supportedLanguagesPath = path.relative(
  process.cwd(),
  path.join(path.dirname(process.argv[1]), "utils", "SupportedLanguages.js"),
);
let browserHandler;
let currentLanguage;

const { argv } = yargs()
  .scriptName("\n🌟 build-screenshots 🌟")
  .usage("$0 [args]", "Create screenshots for a target locale, or all supported ones (default)")
  .option("locale", {
    alias: "l",
    demandOption: true,
    default: ["all"],
    type: "array",
    describe: `one or more target locales from ${supportedLanguagesPath}, e.g. "en", or "zh-Hans", or "en it"`,
  })
  .option("local", {
    default: false,
    type: "boolean",
    describe: "Whether to use a locally installed browser, or a remote one through BrowserStack",
  })
  .check((parsedArgv) => {
    if (!process.env.TRELLO_USERNAME || !process.env.TRELLO_PASSWORD) {
      throw new Error(
        "Unable to proceed: the environment variables TRELLO_USERNAME and TRELLO_PASSWORD need to be set.",
      );
    }

    // Only languages already declared in ./utils/SupportedLanguages.js are valid
    const supportedLanguageKeys = Object.keys(SupportedLanguages);
    if (parsedArgv.locale["0"] !== "all" && !parsedArgv.locale.every((lang) => supportedLanguageKeys.includes(lang))) {
      throw new Error(
        "All target locales must be already supported.\n" +
          `You provided "${parsedArgv.locale}"` +
          ` but we only support "${supportedLanguageKeys}"`,
      );
    }

    if (parsedArgv.local && !process.env.FIREFOX_BINARY) {
      throw new Error("The FIREFOX_BINARY environment variable must be set to the path of the Firefox executable");
    }

    return true;
  })
  .version(false)
  .showHelpOnFail(false)
  .help();

(async () => {
  browserHandler = new Browser("firefox", argv.local);
  const browser = await browserHandler.open();

  if (!browser) {
    logger.error("Unable to instantiate a Browser. See above error for details.");
    process.exit(1);
  }

  await browser.maximizeWindow();

  const loginPage = new LoginPage(browser);
  await loginPage.open();
  await loginPage.login(process.env.TRELLO_USERNAME, process.env.TRELLO_PASSWORD);

  // Detect the initial language
  const changeLanguagePage = new ChangeLanguagePage(browser);
  await changeLanguagePage.open();
  const initialLanguage = await changeLanguagePage.getCurrentLanguage();

  for (const [languageCode, languageName] of Object.entries(SupportedLanguages)) {
    if (argv.locale[0] === "all" || argv.locale.includes(languageCode)) {
      currentLanguage = languageCode;

      await changeLanguagePage.open();
      await changeLanguagePage.switchLanguageTo(languageName);

      const testBoardPage = new TestBoardPage(browser);
      await testBoardPage.open();
      await testBoardPage.takeAllScreenshotsFor(languageCode);
    }
  }

  // Restore initial language
  await changeLanguagePage.open();
  await changeLanguagePage.switchLanguageTo(initialLanguage);
})()
  .catch((e) => logger.error({ label: currentLanguage, message: e }))
  .finally(async () => {
    if (browserHandler) {
      try {
        await browserHandler.close();
      } catch (e) {
        logger.error({ label: currentLanguage, message: "Unable to delete session 🤔" });
        logger.error({ label: currentLanguage, message: e });
      }
    }
  });
