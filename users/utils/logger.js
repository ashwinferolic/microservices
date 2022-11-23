const { createLogger, transports, format } = require("winston");
const path = require("path");
const { combine, timestamp, json } = format;
require("winston-daily-rotate-file");

const userLogger = () => {
  return createLogger({
    defaultMeta: { component: "User" },
    level: "debug",
    format: combine(
      timestamp({
        format: "YYYY-MM-DD HH:mm:ss",
      }),
      json()
    ),
    transports: [
      new transports.DailyRotateFile({
        frequency: "1m",
        level: "info",
        filename: "mrmed-combined-%DATE%.log",
        dirname: path.resolve("logs"),
        datePattern: "YYYY-MM-DD-HH",
        zippedArchive: false,
        maxSize: "20m",
        maxFiles: "14d",
      }),
      new transports.DailyRotateFile({
        frequency: "1m",
        level: "error",
        filename: "mrmed-error-%DATE%.log",
        dirname: path.resolve("logs"),
        datePattern: "YYYY-MM-DD-HH",
        zippedArchive: false,
        maxSize: "20m",
        maxFiles: "14d",
      }),
    ],
  });
};

module.exports = { userLogger };
