import * as Sentry from "@sentry/browser";

import { LeanCoffeePopupOngoingOrPaused } from "./LeanCoffeePopupOngoingOrPaused";
import { SentryDefaultOptions } from "../utils/Sentry";

Sentry.init(SentryDefaultOptions);

const instance = new LeanCoffeePopupOngoingOrPaused({ w: window });
instance.init();
