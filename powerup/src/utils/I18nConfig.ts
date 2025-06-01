import Trello from "../types/trellopowerup/index";

const config: Config = process.env.CONFIG as unknown as Config;
const { supportedLocales } = config[process.env.NODE_ENV as Environment];

export const I18nConfig: Trello.L18N.Localization = {
  defaultLocale: "en",
  supportedLocales,
  resourceUrl: "/i18n/{locale}.json",
};
