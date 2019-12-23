const Browser = require('./Browser');
const SupportedLanguages = require('./SupportedLanguages');
const LoginPage = require('./pages/LoginPage');
const TestBoardPage = require('./pages/TestBoardPage');
const getLogger = require('./Logger');

const logger = getLogger();
let browser;
let currentLanguage;

(async () => {
  browser = await (new Browser('firefox')).build();
  browser.maximizeWindow();
  const loginPage = new LoginPage(browser);
  await loginPage.open();
  await loginPage.login(process.env.TRELLO_USERNAME, process.env.TRELLO_PASSWORD);

  const testBoardPage = new TestBoardPage(browser);
  await testBoardPage.open();

  // eslint-disable-next-line no-restricted-syntax
  for (const [languageCode, languageName] of Object.entries(SupportedLanguages)) {
    currentLanguage = languageCode;
    // eslint-disable-next-line no-await-in-loop
    await testBoardPage.takeAllScreenshotsFor(languageCode, languageName);
  }
})()
  .catch((e) => logger.error({ label: currentLanguage, message: e }))
  .finally(async () => {
    if (browser) {
      try {
        await browser.saveScreenshot('./error.png');
        await browser.deleteSession();
      } catch (e) {
        logger.error({ label: currentLanguage, message: 'Unable to save final screenshot or delete session' });
        logger.error({ label: currentLanguage, message: e });
      }
    }
  });
