import BoardStorage from "../storage/BoardStorage";
import { Trello } from "../types/TrelloPowerUp";

const getTagsForReporting = async (
  boardStorage: BoardStorage,
  t: Trello.PowerUp.AnonymousHostHandlers,
): Promise<string> => {
  const organisationIdHash = await boardStorage.getOrganisationIdHash(t);
  const boardIdHash = await boardStorage.getBoardIdHash(t);
  return `organisationIdHash=${organisationIdHash}&boardIdHash=${boardIdHash}`;
};

const isRunningInProduction = (): boolean =>
  (process.env.NODE_ENV as Environment) === "production";

export { getTagsForReporting, isRunningInProduction };
