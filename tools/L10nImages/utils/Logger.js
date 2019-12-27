const { createLogger, format, transports } = require('winston');

const {
  combine, timestamp, colorize, printf
} = format;

const getLogger = () => createLogger({
  level: 'info',
  format: combine(
    timestamp({
      format: 'YYYY-MM-DD HH:mm:ss'
    }),
    colorize({ message: true }),
    printf(
      (info) => `${info.timestamp} [${info.label ? info.label : '-'}] ${info.message}`
    )
  ),
  transports: [
    new transports.Console()
  ]
});

module.exports = getLogger;
