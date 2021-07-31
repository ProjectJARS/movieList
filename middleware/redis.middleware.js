const express = require('express');
const redis = require("redis");
const router = express.Router();

const client = redis.createClient({
    port: process.env.REDIS_PORT,
    host: process.env.REDIS_HOST,
    password: process.env.REDIS_PASSWORD
});

module.exports.trendingContent = (req, res, next) => {
    client.get("trendingContentString", (err, data) => {
        if (err) throw err;
        if (data != null) {
            console.log("cache work")
            res.send(JSON.parse(data));
        }
        else {
            next();
        }
    })
}

module.exports.discoveredContent = (req, res, next) => {
    client.get("discoverTVorMovieString", (err, data) => {
        if (err) throw err;
        if (data != null) {
            res.send(data);
        }
        else {
            next();
        }
    })
}
