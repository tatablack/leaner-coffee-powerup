import LeanCoffeePowerUp from './LeanCoffeePowerUp';

const HOSTNAME = process.env.CONFIG[process.env.NODE_ENV].hostname;
const PORT = process.env.CONFIG[process.env.NODE_ENV].port;
const DEFAULT_DISCUSSION_DURATION = 5 * 60 * 1000;

/* global TrelloPowerUp */
/* eslint-disable prefer-template */
const instance = new LeanCoffeePowerUp({
  TrelloPowerUp,
  host: `${HOSTNAME}${PORT ? ':' + PORT : ''}`,
  maxDiscussionDuration: DEFAULT_DISCUSSION_DURATION
});

instance.start();
