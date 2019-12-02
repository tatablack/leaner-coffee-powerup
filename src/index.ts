import LeanCoffeePowerUp from './LeanCoffeePowerUp';

declare global {
  interface Window {
    webkitAudioContext?: typeof AudioContext;
  }
}

const { hostname, port } = process.env.CONFIG[process.env.NODE_ENV];
const DEFAULT_DISCUSSION_DURATION = 5 * 60 * 1000;

/* eslint-disable prefer-template */
const instance = new LeanCoffeePowerUp({
  w: window,
  baseUrl: `${hostname}${port ? ':' + port : ''}`,
  maxDiscussionDuration: DEFAULT_DISCUSSION_DURATION
});

instance.start();
