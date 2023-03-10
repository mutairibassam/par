// const { MongoClient } = require("mongodb");
const mongoose = require("mongoose");
const config = require("./config/default.json");

const uri = config.mongo_conn_str; // used for local server only
class Connection {
    static async connectToMongo() {
        if (this.db) return this.db;
        let mongo_client = await mongoose.connect(uri, this.options);
        this.client = mongo_client;
        this.db = mongo_client.db;
        return this.db;
    }

    static async close() {
        mongoose.connection.close(true);
    }
}

Connection.client = null;
Connection.db = null;
Connection.url = uri;
Connection.options = {
    // poolSize:   10,
    // reconnectTries:     5000,
    useNewUrlParser: true,
    useUnifiedTopology: true,
};

module.exports = { Connection };
