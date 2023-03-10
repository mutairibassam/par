/* eslint-disable no-undef */
const fs = require("fs");
/**
 *  for logging
 */
require("./../logger").intialize();
const logger = require("./../logger").logger;

describe("contain logs use cases", function () {
    describe("should log into a development log file successfuly", () => {
        it("a new info log", async () => {
            logger.info("test"); // function to be tested
            const sample = "2022-12-05T08:54:25.713Z [development] info: test";
            const actual = fs
                .readFileSync("./logs/development.log")
                .toString()
                .split("\n")
                .map(String);
            var log = actual[actual.length - 3];
            // eslint-disable-next-line no-unused-vars
            var [_, _env, _label, __] = sample.split(" ");
            var [timestamp, env, label, msg] = log.split(" ");
            expect(timestamp).not.toBeUndefined();
            expect(env).toBe(_env);
            expect(label).toBe(_label);
            expect(msg).not.toBeUndefined();
        });
    });
});
