const express = require("express");
const bodyParser = require("body-parser");

/**
 *  database client
 */
const mongo_conn_native = require("./mongo_conn_native").Connection;

/**
 *  load config file
 */
const config = require("./config/default.json");

/**
 *  for logging
 */
require("./logger").intialize();
const logger = require("./logger").logger;

/**
 *  Response
 */
const Response = require("./src/common/response").Response;

// Initialzie Express
const app = express();

// expose /temp/uploads directory to be accessed through link
app.use("/temp/uploads", express.static("temp/uploads"));

// Response Body parser
// parse application/x-www-form-urlencoded
app.use(bodyParser.urlencoded({ limit: "5mb", extended: true }));

// parse application/octets-stream
/* binary files can accept upto 5mb */
app.use(bodyParser.raw({ type: "application/octet-stream", limit: "1mb" }));

// parse application/json
app.use(bodyParser.json({ limit: "500mb", extended: true }));

// For CORS
app.use((req, res, next) => {
    res.header("Access-Control-Allow-Origin", "*");
    res.header("Access-Control-Allow-Methods", "*");
    res.header("Access-Control-Allow-Headers", "*");
    res.header("Access-Control-Allow-Credentials", "true");
    next();
});

// Routes
const routePublicAPI = require("./src/restAPI/routes/route_public");
const routeUserAPI = require("./src/restAPI/routes/route_user");
const routePostAPI = require("./src/restAPI/routes/route_post");

app.use("/api/v1/user", async (req, res, next) => {
    const result = true;
    if (!result) {
        res.status(401).send(Response.unauthorized());
    }
    next();
});

// connect to database
mongo_conn_native.connectToMongo().then(
    async () => {
        // Routes

        // public apis which does not need to authentication
        app.use("/api/v1/public", routePublicAPI);
        // user api
        app.use("/api/v1/user", routeUserAPI);
        // timeline api
        app.use("/api/v1/post", routePostAPI);

        /**
         *      Get port number from configuration file
         *      ./config/default.json
         *
         *      in case there is no config file port 3016 will be in place
         */
        const port = config.port || 3016;
        app.listen(port, async () => {
            logger.info("Server is running " + port);
        });
    },
    (err) => {
        logger.error("Unable to connect mongo " + err);
    }
);

//exports.app = app;
module.exports = app;
