import * as Sentry from "@sentry/browser";

import LeanCoffeePowerUp from "./LeanCoffeePowerUp";
import { SentryDefaultOptions } from "./utils/Sentry";

declare global {
  interface Window {
    webkitAudioContext?: typeof AudioContext;
  }
}

const config: Config = process.env.CONFIG as unknown as Config;
Sentry.init(SentryDefaultOptions);

const instance = new LeanCoffeePowerUp({
  w: window,
  config,
});

instance.start();
