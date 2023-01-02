const autocannon = require("autocannon");
//const process = require("dotenv").config();
const config = require("../../config/default.json");
const mockData = require("./create_mock.json");

function startBench() {
    const url = `${config.base_url}:${config.port}`;

    //const args = process.argv.slice(2);
    //const numConnections = args[0] || 100;
    //const maxConnectionRequests = args[1] || 100;
    const numConnections = 1000;
    const maxConnectionRequests = 1;

    let requestNumber = 0;

    const instance = autocannon(
        {
            url,
            connections: numConnections,
            duration: 10,
            maxConnectionRequests,
            headers: {
                "content-type": "application/json",
            },
            requests: [
                {
                    method: "PUT",
                    path: "/api/v1/public/create",
                    setupRequest: function (request) {
                        console.log("Request Number: ", requestNumber + 1);
                        request.body = JSON.stringify(mockData[requestNumber]);
                        requestNumber++;
                        return request;
                    },
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
