const Analytics = {
  async event(
    window: Window,
    eventName: string,
    eventData?: Record<string, unknown>,
  ) {
    if (window.umami) {
      await window.umami.track(eventName, eventData);
    }
  },
};

export default Analytics;
