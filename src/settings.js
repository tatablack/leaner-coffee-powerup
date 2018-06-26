import LeanCoffeeSettings from './LeanCoffeeSettings';

window.settingsInstance = new LeanCoffeeSettings(window, process.env.NODE_ENV);
window.settingsInstance.init();
