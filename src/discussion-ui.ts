import LeanCoffeeDiscussionUI from './LeanCoffeeDiscussionUI';

declare global {
  interface Window {
    discussionUIInstance: LeanCoffeeDiscussionUI;
  }
}

window.discussionUIInstance = new LeanCoffeeDiscussionUI(window);
window.discussionUIInstance.init();
