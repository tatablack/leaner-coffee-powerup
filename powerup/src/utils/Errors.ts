const isRunningInProduction = (): boolean =>
  (process.env.NODE_ENV as Environment) === "production";

export { isRunningInProduction };
