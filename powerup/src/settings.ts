import * as Sentry from "@sentry/browser";

import LeanCoffeeSettings from "./LeanCoffeeSettings";
import { SentryDefaultOptions } from "./utils/Sentry";

const config: Config = process.env.CONFIG as unknown as Config;
Sentry.init(SentryDefaultOptions);

const settings = new LeanCoffeeSettings({
  w: window,
  config,
});
settings.init();
