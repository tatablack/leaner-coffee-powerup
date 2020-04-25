import LeanCoffeePowerUp from './LeanCoffeePowerUp';

declare global {
  interface Window {
    webkitAudioContext?: typeof AudioContext;
  }
}

const config: Config = process.env.CONFIG as unknown as Config;

/* eslint-disable prefer-template */
const instance = new LeanCoffeePowerUp({
  w: window,
  config
});

instance.start();
