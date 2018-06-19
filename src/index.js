import LeanCoffeePowerUp from './LeanCoffeePowerUp';

const HOSTNAME = '';
const DEFAULT_DISCUSSION_DURATION = 5 * 60 * 1000;

/* global TrelloPowerUp */
const instance = new LeanCoffeePowerUp({
  TrelloPowerUp,
  hostname: HOSTNAME,
  maxDiscussionDuration: DEFAULT_DISCUSSION_DURATION
});

instance.start();
