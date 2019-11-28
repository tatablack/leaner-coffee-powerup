import LeanCoffeeDiscussionUI from './LeanCoffeeDiscussionUI';

declare global {
  interface Window {
    TrelloPowerUp: any;
    discussionUIInstance: LeanCoffeeDiscussionUI;
  }
}

window.discussionUIInstance = new LeanCoffeeDiscussionUI({ w: window });
window.discussionUIInstance.init();
