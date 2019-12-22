import LeanCoffeePowerUp from './LeanCoffeePowerUp';

declare global {
  interface Window {
    webkitAudioContext?: typeof AudioContext;
  }
}

const config: Config = process.env.CONFIG as unknown as Config;
const DEFAULT_DISCUSSION_DURATION = 5 * 60 * 1000;

/* eslint-disable prefer-template */
const instance = new LeanCoffeePowerUp({
  w: window,
  config,
  maxDiscussionDuration: DEFAULT_DISCUSSION_DURATION
});

instance.start();
