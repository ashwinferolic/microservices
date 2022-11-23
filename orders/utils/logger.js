const { createLogger, transports } = require("winston");

const logger = createLogger({
  transports: [new transports.Console()],
});

const userLogger = createLogger({
  transports: [new transports.Console()],
});

module.exports = { userLogger };
