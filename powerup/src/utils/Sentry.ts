export const SentryDefaultOptions = {
  dsn: process.env.SENTRY_DSN,
  sendDefaultPii: false,
  release: process.env.VERSION,
  environment: process.env.NODE_ENV,
};
