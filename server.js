const express = require("express");
const bodyParser = require("body-parser");
const jwt = require("jsonwebtoken");
const env = require("dotenv").config();
const getTokenByUsername = require("./src/database/db_auth").getTokenByUsername;
// const process = require("process");

// create new workers
// const cluster = require("cluster");
// get cpus length
// const cpus = require("os").cpus().length;

/**
 *  database client
 */
const mongo_conn_native = require("./mongo_conn_native").Connection;

/**
 *  load config file
 */
const config = require("./config/default.json");

/**
 *  for logging [https://www.npmjs.com/package/winston]
 */
require("./logger").intialize();
const logger = require("./logger").logger;

/**
 *  for Response
 */
const Response = require("./src/common/response").Response;

/**
 *  setting various HTTP headers [https://helmetjs.github.io/]
 */
const helmet = require("helmet");

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

app.use(helmet());

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
const routeAuthAPI = require("./src/restAPI/routes/route_auth");

async function authenticateToken(req, res, next) {
    const authHeader = req.headers["authorization"];
    const token = authHeader && authHeader.split(" ")[1];
    if (token == null) {
        return res.status(401).send(
            Response.unauthorized({
                msg: "Authorization header cannot be empty.",
            })
        );
    }

    jwt.verify(token, env.parsed.ACCESS_TOKEN_SECRET, async (err, user) => {
        if (err) return res.status(403).send(Response.forbidden({}));
        /// check in database and compare the tokens
        const usr = user.username ?? user.name;
        const dbToken = await getTokenByUsername(usr);
        /// if it's match next()
        if(token === dbToken) {
            /// if it's not match deny
            req.user = user;
            return next();
        }
        return res.status(403).send(
            Response.forbidden({})
        ); 
    });
}

// connect to database
mongo_conn_native.connectToMongo().then(
    async () => {
        // Routes

        // public apis which does not need to authentication
        app.use("/api/v1/public", routePublicAPI);
        // user api
        app.use("/api/v1/user", authenticateToken, routeUserAPI);
        // timeline api
        app.use("/api/v1/post", authenticateToken, routePostAPI);
        // auth api
        app.use("/api/v1/auth", authenticateToken, routeAuthAPI);

        /**
         *      Get port number from configuration file
         *      ./config/default.json
         *
         *      in case there is no config file port 3016 will be in place
         */
        const port = config.port || 3016;
        app.listen(port, async () => {
            logger.info(
                `Server running ${config.base_url}:${port}`
            );
        });
        // if (cluster.isMaster) {
        //     for (let i = 0; i < 1; i++) {
        //         cluster.fork();
        //     }
        //     cluster.on("exit", (worker, code, signal) => {
        //         if (signal) {
        //             logger.info(
        //                 `worker ${worker.process.pid} was killed by signal: ${signal}`
        //             );
        //         } else if (code !== 0) {
        //             logger.info(
        //                 `worker ${worker.process.pid} exited with error code: ${code}`
        //             );
        //         } else {
        //             logger.info(`worker ${worker.process.pid} just died.`);
        //         }
        //         cluster.fork();
        //     });
        // } else {
        //     app.listen(port, async () => {
        //         logger.info(
        //             `Server ${process.pid} @ ${config.base_url}:${port}`
        //         );
        //     });
        // }
    },
    (err) => {
        logger.error("Unable to connect mongo " + err);
    }
);

//exports.app = app;
module.exports = app;
