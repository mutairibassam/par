const winston = require("winston");
const rotate = require("winston-logrotate").Rotate;
const env = require("./config/default.json").env;

module.exports.intialize = () => {
    if (env === "development" || env === "stage") {
        module.exports.logger = winston.createLogger({
            transports: [
                new rotate({
                    file: "./logs/development.log",
                    colorize: true,
                    timestamp: true,
                    json: true,
                    size: "2m",
                    keep: 15,
                    compress: true,
                }),
            ],
        });
    } else {
        module.exports.logger = winston.createLogger({
            transports: [
                new rotate({
                    file: "./logs/production.log",
                    colorize: true,
                    timestamp: true,
                    json: true,
                    size: "2m",
                    keep: 15,
                    compress: true,
                }),
            ],
        });
    }
};
