/* eslint-disable no-undef */
const supertest = require("supertest");
const app = require("../../server");
const router = require("../restAPI/routes/route_user");
const request = supertest(app.use(router));

describe("contain user apis", function () {
    const data = {
        first_name: "test", // mandatory
        last_name: "test", // optional
        bio: "Self-sufficient and reliable professional with 6 years of experience in software development.", // optional
        username: "test", // mandatory
        email: "test@gmail.com", // mandatory
        mobile: "0511111111", // optional
        external: {
            // all optional
            linkedin: "https://...",
            github: "https://...",
            twitter: "https://...",
            portfolio: "https://...",
        },
    };

    describe("contain create api cases", () => {
        it("a new user should be created successfully", async () => {
            await request
                .put("/create")
                .send({ data })
                .set("Accept", "application/json")
                .expect(201);
        });
        it("should fail because of empty body", async () => {
            await request
                .put("/create")
                .send({
                    /* empty body */
                })
                .set("Accept", "application/json")
                .expect(401);
        });
    });

    //describe("contain update api cases", () => {
    //    it("a new user should be created successfully", async () => {
    //        await request
    //            .post("/update")
    //            .send({ data })
    //            .set("Accept", "application/json")
    //            .expect(201);
    //    });

    //    it("should update a user successfully", async () => {
    //        await request
    //            .post("/update")
    //            .send({ data })
    //            .set("Accept", "application/json")
    //            .expect(201);
    //    });
    //});
});
