import { Trello } from "../types/TrelloPowerUp";

const config: Config = process.env.CONFIG as unknown as Config;
const { supportedLocales } = config[process.env.NODE_ENV as Environment];

export const I18nConfig: Trello.PowerUp.Localization = {
  defaultLocale: "en",
  supportedLocales,
  resourceUrl: "/i18n/{locale}.json",
};
