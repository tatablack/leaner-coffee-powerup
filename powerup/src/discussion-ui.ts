import * as Sentry from "@sentry/browser";

import LeanCoffeeDiscussionUI from "./LeanCoffeeDiscussionUI";
import { SentryDefaultOptions } from "./utils/Sentry";

const config: Config = process.env.CONFIG as unknown as Config;
Sentry.init(SentryDefaultOptions);

const discussionUI = new LeanCoffeeDiscussionUI({ w: window, config });
discussionUI.init();
