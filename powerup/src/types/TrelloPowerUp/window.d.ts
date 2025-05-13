import type { umami } from "umami-browser";

declare global {
  interface Window {
    Sentry: typeof import("@sentry/browser");
    umami: umami.umami;
    LeanerCoffeeAnalyticsBeforeSend: (
      event: string,
      payload: umami.CustomPayload,
    ) => umami.CustomPayload;
    LeanerCoffeeAnalyticsReferrer: string;
    LeanerCoffeeAnalyticsHostname: string;
  }
}
