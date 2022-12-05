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
            logger.info("test");
            const original =
                "2022-12-05T08:54:25.713Z [development] info: test";
            const logs = fs
                .readFileSync("./logs/development.log")
                .toString()
                .split("\n")
                .map(String);
            var result = logs[logs.length - 3];
            // eslint-disable-next-line no-unused-vars
            var [_, oenv, olabel, omsg] = original.split(" ");
            // eslint-disable-next-line no-unused-vars
            var [__, env, label, msg] = result.split(" ");
            expect(env).toBe(oenv);
            expect(label).toBe(olabel);
            expect(msg).toBe(omsg);
        });
    });
});
