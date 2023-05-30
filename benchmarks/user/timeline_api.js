const autocannon = require("autocannon");
//const process = require("dotenv").config();
const config = require("../../config/default.json");

function startBench() {
    const url = `${config.base_url}:${config.port}`;

    //const args = process.argv.slice(2);
    //const numConnections = args[0] || 100;
    //const maxConnectionRequests = args[1] || 100;
    const numConnections = 100;
    const maxConnectionRequests = 10;

    // let requestNumber = 0;

    const instance = autocannon(
        {
            url,
            connections: numConnections,
            duration: 10,
            maxConnectionRequests,
            headers: {
                "content-type": "application/json",
                "Authorization": "bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VybmFtZSI6Im11dGFpcmliYXNzYW0yIiwiaWF0IjoxNjgwOTU1MTQxLCJleHAiOjE2ODE1NTk5NDF9.71qlBGXFdgx38Luhf0PNilmd-GZIwH05sTEZgrwpNW8"
            },
            requests: [
                {
                    method: "GET",
                    path: "/api/v1/post/timeline",
                },
            ],
        },
        finishedBench
    );

    autocannon.track(instance);

    function finishedBench(err, res) {
        console.log("Finished Bench", err, res);
    }
}

startBench();
