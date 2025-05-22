import BoardStorage from "../storage/BoardStorage";
import { Trello } from "../types/TrelloPowerUp";

const getTagsForReporting = async (boardStorage: BoardStorage, t: Trello.PowerUp.HostHandlers): Promise<string> => {
  const organisationIdHash = await boardStorage.read<string>(t, BoardStorage.ORGANISATION_HASH);
  const boardIdHash = await boardStorage.read<string>(t, BoardStorage.BOARD_HASH);
  return `organisationIdHash=${organisationIdHash}&boardIdHash=${boardIdHash}`;
};

const isRunningInProduction = (): boolean => (process.env.NODE_ENV as Environment) === "production";

const ErrorReporter = (target: any, methodName: string, descriptor: PropertyDescriptor) => {
  const originalMethod = descriptor.value;
  const isAsync = originalMethod.constructor.name === "AsyncFunction";
  const warningMessage = `Leaner Coffee Power-Up: error in ${methodName} (reported)`;

  if (isAsync) {
    descriptor.value = async function (...args: any[]) {
      try {
        return await originalMethod.apply(this, args);
      } catch (error) {
        console.warn(warningMessage);
        window.Sentry.captureException(error);
      }
    };
  } else {
    descriptor.value = function (...args: any[]) {
      try {
        return originalMethod.apply(this, args);
      } catch (error) {
        console.warn(warningMessage);
        window.Sentry.captureException(error);
      }
    };
  }

  return descriptor;
};

function ErrorReporterInjector<T extends { new (...args: any[]): object }>(constructor: T) {
  // Get all prototype methods
  const prototype = constructor.prototype;
  const methodNames = Object.getOwnPropertyNames(prototype).filter(
    (name) => typeof prototype[name] === "function" && name !== "constructor", // Skip constructor
  );

  // Apply the ErrorReporter decorator to each method
  methodNames.forEach((methodName) => {
    const descriptor = Object.getOwnPropertyDescriptor(prototype, methodName);
    if (descriptor && typeof descriptor.value === "function") {
      const decoratedDescriptor = ErrorReporter(prototype, methodName, descriptor);

      // console.log(
      //   `Decorating ${constructor.name}::${methodName} with ErrorReporter`,
      // );
      Object.defineProperty(prototype, methodName, decoratedDescriptor);
    }
  });

  return constructor;
}

export { getTagsForReporting, isRunningInProduction, ErrorReporter, ErrorReporterInjector };
