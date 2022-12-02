const winston = require("winston");
const rotate = require("winston-logrotate").Rotate;
const env = require("./config/default.json").env;

module.exports.intialize = () => {
    module.exports.logger = winston.createLogger({
        transports: [
            new rotate({
                file: "./logs/web.log",
                colorize: true,
                timestamp: true,
                json: true,
                size: "2m",
                keep: 15,
                compress: true,
                level: env === "development" ? "debug" : "info",
            }),
        ],
    });
};
