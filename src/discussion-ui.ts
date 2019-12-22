import LeanCoffeeDiscussionUI from './LeanCoffeeDiscussionUI';

const config: Config = process.env.CONFIG as unknown as Config;

const discussionUI = new LeanCoffeeDiscussionUI({ w: window, config });
discussionUI.init();
