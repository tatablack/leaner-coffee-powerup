import CustomPayload = umami.CustomPayload;

import BoardStorage from "../storage/BoardStorage";
import { Trello } from "../types/TrelloPowerUp";

const sanitiseUrl = (urlString: string): string => {
  const url = new URL(urlString);
  return (
    url.protocol +
    url.hostname +
    (url.port ? `:${url.port}` : "") +
    url.pathname
  );
};

const beforeSend = (event: string, payload: CustomPayload): CustomPayload => {
  return {
    ...payload,
    ...{
      referrer: window.LeanerCoffeeAnalyticsReferrer,
      hostname: window.LeanerCoffeeAnalyticsHostname,
    },
    url: sanitiseUrl(payload.url),
  };
};

const pageview = async (window: Window, eventData: umami.EventData = {}) => {
  if (window.umami) {
    await window.umami.track((props: any) => {
      return { ...props, ...eventData };
    });
  } else {
    console.warn("Umami not available for pageview", eventData);
  }
};

const event = async (
  window: Window,
  eventName: string,
  eventData?: umami.EventData,
) => {
  if (window.umami) {
    await window.umami.track(eventName, eventData);
  } else {
    console.warn("Umami not available for event", eventData);
  }
};

const getOverrides = async (
  boardStorage: BoardStorage,
  t: Trello.PowerUp.AnonymousHostHandlers,
): Promise<string> => {
  const organisationIdHash = await boardStorage.getOrganisationIdHash(t);
  const boardIdHash = await boardStorage.getBoardIdHash(t);
  const referrer = encodeURIComponent("https://" + organisationIdHash);
  return `referrer=${referrer}&hostname=${boardIdHash}`;
};

const Analytics = {
  beforeSend,
  pageview,
  event,
  getOverrides,
};

export default Analytics;
