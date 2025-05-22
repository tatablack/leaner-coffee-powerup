import { createLogger, format, transports } from "winston";

const { combine, timestamp, colorize, printf } = format;

const getLogger = (level = "info") =>
  createLogger({
    level,
    format: combine(
      timestamp({
        format: "YYYY-MM-DD HH:mm:ss",
      }),
      colorize({ message: true }),
      printf((info) => `${info.timestamp} [${info.label ? info.label : "--"}] ${info.message}`),
    ),
    transports: [new transports.Console()],
  });

export default getLogger;
