/* eslint-disable no-undef */
const supertest = require("supertest");
const app = require("../../server");
const userRouter = require("../restAPI/routes/route_user");
const publicRouter = require("../restAPI/routes/route_public");
supertest(app.use(userRouter));
supertest(app.use(publicRouter));

describe("contain user apis", function () {
    const data = {
        first_name: "test", // mandatory
        last_name: "test", // optional
        username: "test_user",
        bio: "Self-sufficient and reliable professional with 6 years of experience in software development.", // optional
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
            await supertest(app)
                .put("/create")
                .send({ data })
                .set("Accept", "application/json")
                .expect(201);
        });
        it("should fail because of empty body", async () => {
            await supertest(app)
                .put("/create")
                .send({
                    /* empty body */
                })
                .set("Accept", "application/json")
                .expect(401);
        });
    });

    // describe("contain update api cases", () => {
    //     it("should update existing user data successfully", async () => {
    //         data.first_name = "my new name";
    //         await request
    //             .post("/update")
    //             .send({ data })
    //             .set("Accept", "application/json")
    //             .expect(200);
    //     });

    //     it("should fail since there is no user", async () => {
    //         data.username = "notExist";
    //         await request
    //             .post("/update")
    //             .send({ data })
    //             .set("Accept", "application/json")
    //             .expect(401);
    //     });
    // });
});
