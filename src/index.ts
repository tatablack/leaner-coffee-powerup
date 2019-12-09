import LeanCoffeePowerUp from './LeanCoffeePowerUp';

declare global {
  interface Window {
    webkitAudioContext?: typeof AudioContext;
  }
}

type Env = 'development' | 'production';

type Config = {
  [key in Env]: {
    hostname: string;
    port?: number;
    defaultDuration?: number;
  };
};

const env: Config = process.env.CONFIG as unknown as Config;
const { hostname, port } = env[process.env.NODE_ENV as Env];
const DEFAULT_DISCUSSION_DURATION = 5 * 60 * 1000;

/* eslint-disable prefer-template */
const instance = new LeanCoffeePowerUp({
  w: window,
  baseUrl: `${hostname}${port ? ':' + port : ''}`,
  maxDiscussionDuration: DEFAULT_DISCUSSION_DURATION
});

instance.start();
