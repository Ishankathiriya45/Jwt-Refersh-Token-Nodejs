const winston = require("winston");
require("winston-daily-rotate-file");
const path = require("path");
const fs = require("fs");

const logDir = path.join(__dirname, "..", "logs");
if (!fs.existsSync(logDir)) fs.mkdirSync(logDir);

// Daily Rotate Transport for error logs
const errorTransport = new winston.transports.DailyRotateFile({
    filename: path.join(logDir, "error-%DATE%.log"),
    datePattern: "YYYY-MM-DD",
    level: "error",
    zippedArchive: false,
    maxSize: "20m",
    maxFiles: "14d",
});

// Daily Rotate Transport for combined logs
const combinedTransport = new winston.transports.DailyRotateFile({
    filename: path.join(logDir, "combined-%DATE%.log"),
    datePattern: "YYYY-MM-DD",
    zippedArchive: false,
    maxSize: "20m",
    maxFiles: "14d",
});

const logger = winston.createLogger({
    level: "info",
    format: winston.format.json(),
    transports: [errorTransport, combinedTransport],
});

if (global.config.run_mode !== "PROD") {
    logger.add(
        new winston.transports.Console({
            format: winston.format.simple(),
        })
    );
}

module.exports = { logger };
