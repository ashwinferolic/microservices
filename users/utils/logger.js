const { createLogger, transports, format } = require("winston");
const { combine, timestamp, json, prettyPrint } = format;

const userLogger = () => {
  return createLogger({
    defaultMeta: { component: "User" },
    level: "debug",
    format: combine(
      timestamp({
        format: "YYYY-MM-DD HH:mm:ss",
      }),
      json(),
      prettyPrint()
    ),
    transports: [
      new transports.File({ filename: "combined.log" }),
      new transports.File({ filename: "error.log", level: "error" }),
    ],
  });
};

module.exports = { userLogger };
