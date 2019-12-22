import LeanCoffeeSettings from './LeanCoffeeSettings';

const config: Config = process.env.CONFIG as unknown as Config;

const settings = new LeanCoffeeSettings({
  w: window,
  config,
});
settings.init();
