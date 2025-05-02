type DiscussionStatus = "ONGOING" | "PAUSED" | "ENDED";
type DiscussionIntervalId = number | null;
type DiscussionStartedAt = number | null;
type DiscussionPreviousElapsed = number | null;
type Environment = "production" | "development";

type Config = {
  [key in Environment]: {
    hostname: string;
    port?: number;
    defaultDuration?: number;
    supportedLocales: string[];
  };
};

interface Votes {
  [memberId: string]: {
    username: string;
    fullName: string;
    avatar: string;
  };
}

type Thumb = "UP" | "DOWN" | "MIDDLE";

interface Thumbs {
  [memberId: string]: Thumb;
}
