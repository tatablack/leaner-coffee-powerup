import LeanCoffeeSettings from './LeanCoffeeSettings';

declare global {
  interface Window {
    settingsInstance: LeanCoffeeSettings;
  }
}

window.settingsInstance = new LeanCoffeeSettings(window, process.env.NODE_ENV);
window.settingsInstance.init();
