const env = require("./config/default.json").env;
const { createLogger, transports } = require("winston");
const logform = require("logform");
const { combine, timestamp, label, printf } = logform.format;

module.exports.intialize = () => {
    if (env === "development" || env === "stage") {
        module.exports.logger = createLogger({
            format: combine(
                label({ label: `${env}` }),
                timestamp(),
                printf((nfo) => {
                    return `${nfo.timestamp} [${nfo.label}] ${nfo.level}: ${nfo.message}`;
                })
            ),
            transports: [
                new transports.Console(),
                new transports.File({ filename: "./logs/development.log" }),
            ],
        });
    } else {
        module.exports.logger = createLogger({
            format: combine(
                label({ label: `${env}` }),
                timestamp(),
                printf((nfo) => {
                    return `${nfo.timestamp} [${nfo.label}] ${nfo.level}: ${nfo.message}`;
                })
            ),
            transports: [
                new transports.Console(),
                new transports.File({ filename: "./logs/production.log" }),
            ],
        });
    }
};
