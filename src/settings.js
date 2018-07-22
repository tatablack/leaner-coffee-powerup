import LeanCoffeeSettings from './LeanCoffeeSettings';

window.settingsInstance = new LeanCoffeeSettings(window, process.env.NODE_ENV, process.env.VERSION);
window.settingsInstance.init();
