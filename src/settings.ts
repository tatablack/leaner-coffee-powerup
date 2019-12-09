import LeanCoffeeSettings from './LeanCoffeeSettings';

const settings = new LeanCoffeeSettings({
  w: window,
  environment: process.env.NODE_ENV as Environment
});
settings.init();
