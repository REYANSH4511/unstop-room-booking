import winston from "winston";
import DailyRotateFile from "winston-daily-rotate-file";
import constants from "../config/constants.js";

/**
 * ============================================================================
 * WINSTON LOGGER CONFIGURATION
 * ============================================================================
 *
 * Features:
 * - Console output with colorized formatting for development
 * - Daily rotating file logs for production
 * - Separate error log file for critical issues
 * - HTTP request stream compatible with Morgan
 */

const logDir = "./src/logs";

const consoleFormat = winston.format.combine(
  winston.format.colorize(),
  winston.format.timestamp({ format: "YYYY-MM-DD HH:mm:ss" }),
  winston.format.printf(({ level, message, timestamp }) => {
    return `${timestamp} [${level}]: ${message}`;
  })
);

const fileFormat = winston.format.combine(
  winston.format.timestamp({ format: "YYYY-MM-DD HH:mm:ss" }),
  winston.format.json()
);

const transports: winston.transport[] = [
  new winston.transports.Console({
    format: consoleFormat,
    level: constants.logLevel,
  }),
];

if (constants.nodeEnv === "production") {
  transports.push(
    new DailyRotateFile({
      filename: `${logDir}/all-%DATE%.log`,
      datePattern: "YYYY-MM-DD",
      maxFiles: "14d",
      format: fileFormat,
    }),
    new DailyRotateFile({
      filename: `${logDir}/error-%DATE%.log`,
      datePattern: "YYYY-MM-DD",
      maxFiles: "14d",
      level: "error",
      format: fileFormat,
    })
  );
}

const logger = winston.createLogger({
  level: constants.logLevel,
  transports,
});

/**
 * Morgan-compatible stream for HTTP request logging.
 */
(logger as unknown as Record<string, unknown>).stream = {
  write: (message: string): void => {
    logger.info(message.trim());
  },
};

export default logger;
