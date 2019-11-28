import LeanCoffeeSettings from './LeanCoffeeSettings';

declare global {
  interface Window {
    TrelloPowerUp: any;
    settingsInstance: LeanCoffeeSettings;
  }
}

window.settingsInstance = new LeanCoffeeSettings({
  w: window,
  environment: process.env.NODE_ENV as Environment
});
window.settingsInstance.init();
